import { describe, expect, it } from "vitest";
import { middleware } from "@/middleware";
import { NextRequest } from "next/server";

function req(path: string, cookie?: string) {
  const headers = new Headers();
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest(`http://localhost${path}`, { headers });
}

describe("middleware auth gates", () => {
  it("redirects unauthenticated admin access", () => {
    const res = middleware(req("/admin/productions"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/admin/login");
  });

  it("redirects unauthenticated preview access", () => {
    const res = middleware(req("/preview/projects/inkondo"));
    expect(res.status).toBe(307);
  });

  it("allows admin login without session", () => {
    const res = middleware(req("/admin/login"));
    expect(res.status).toBe(200);
  });

  it("passes through when session cookie present", () => {
    const res = middleware(req("/admin", "pams_session=fake-token"));
    expect(res.status).toBe(200);
  });
});

describe("project route config", () => {
  it("allows runtime D1 slug resolution (no dynamicParams=false)", async () => {
    const mod = (await import("@/app/projects/[slug]/page")) as Record<
      string,
      unknown
    >;
    expect(mod.dynamicParams).toBeUndefined();
    expect(mod.generateStaticParams).toBeUndefined();
  });
});
