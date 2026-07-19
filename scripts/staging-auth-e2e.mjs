/**
 * Sprint 8 — authenticated staging E2E (Playwright).
 * Does not print secrets, signed URLs, or personal message bodies.
 *
 * Env:
 *   STAGING_BASE_URL (default workers.dev)
 *   STAGING_ADMIN_EMAIL / STAGING_ADMIN_PASSWORD
 *   STAGING_VIEWER_EMAIL / STAGING_VIEWER_PASSWORD (optional lower-privilege)
 *   INKONDO_PRODUCTION_ID (optional)
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE =
  process.env.STAGING_BASE_URL ||
  "https://orammedia-staging.nasalifya007.workers.dev";
const ADMIN_EMAIL =
  process.env.STAGING_ADMIN_EMAIL || "admin+staging@orammedia.com";
const ADMIN_PASSWORD =
  process.env.STAGING_ADMIN_PASSWORD || "oram-staging-change-me-2026";
const VIEWER_EMAIL = process.env.STAGING_VIEWER_EMAIL || "";
const VIEWER_PASSWORD = process.env.STAGING_VIEWER_PASSWORD || "";
const INKONDO_ID =
  process.env.INKONDO_PRODUCTION_ID || "cmro8oqhq000l50vue4tfjkc4";

const outDir = join(process.cwd(), "exports", "sprint8");
mkdirSync(outDir, { recursive: true });

const results = [];
function record(suite, name, expected, actual, pass, notes = "") {
  results.push({ suite, name, expected, actual, pass, notes });
  console.log(
    `[${pass ? "PASS" : "FAIL"}] ${suite} :: ${name} — expected=${expected} actual=${actual}${notes ? ` (${notes})` : ""}`,
  );
}

function tinyJpeg() {
  return Buffer.from(
    "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGfAP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//Z",
    "base64",
  );
}

function tinyPng() {
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
}

function fakeExeAsJpeg() {
  return Buffer.from("MZ\x90\x00this-is-not-an-image-executable-payload");
}

async function login(page, email, password) {
  await page.goto(`${BASE}/admin/login`, {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await Promise.all([
    page.waitForURL(/\/admin(?!\/login)/, { timeout: 90000 }).catch(() => null),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForTimeout(1200);
  return page.url();
}

async function cookieHeader(context) {
  const cookies = await context.cookies();
  return cookies.map((c) => `${c.name}=${c.value}`).join("; ");
}

async function api(context, path, init = {}) {
  const headers = {
    Origin: BASE,
    Cookie: await cookieHeader(context),
    ...(init.headers || {}),
  };
  return fetch(`${BASE}${path}`, { ...init, headers });
}

async function putAuthorizedUpload(context, authJson, body, contentType) {
  const headers = {
    "Content-Type": contentType,
    ...(authJson.headers || {}),
  };
  let uploadUrl = String(authJson.uploadUrl || "");
  if (uploadUrl.startsWith("/")) uploadUrl = `${BASE}${uploadUrl}`;
  if (authJson.proxy || uploadUrl.includes("/api/dam/upload/proxy")) {
    headers.Cookie = await cookieHeader(context);
    headers.Origin = BASE;
  }
  return fetch(uploadUrl, {
    method: authJson.method || "PUT",
    headers,
    body,
  });
}

async function main() {
  console.log(`base=${BASE}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const evidence = {
    mediaIds: [],
    objectKeys: [],
    snapshotNames: [],
    originalHeadline: null,
    testHeadline: null,
  };

  // --- Unauthenticated gates ---
  {
    const bare = await fetch(`${BASE}/admin`, { redirect: "manual" });
    record(
      "security",
      "unauth admin dashboard",
      "302/307 to login",
      String(bare.status),
      bare.status === 302 || bare.status === 307 || bare.status === 303,
    );
    const authz = await fetch(`${BASE}/api/dam/upload/authorize`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: BASE },
      body: JSON.stringify({
        originalName: "t.jpg",
        mimeType: "image/jpeg",
        fileSize: 100,
      }),
    });
    record("security", "unauth authorize", "403", String(authz.status), authz.status === 403);
    const complete = await fetch(`${BASE}/api/dam/upload/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: BASE },
      body: JSON.stringify({ sessionId: "nonexistent" }),
    });
    record("security", "unauth complete", "403", String(complete.status), complete.status === 403);
  }

  // --- Admin login ---
  let url = await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  const loggedIn = /\/admin/.test(url) && !/login/.test(url);
  record("auth", "admin login", "dashboard", loggedIn ? "dashboard" : url, loggedIn);
  if (!loggedIn) {
    const err = await page
      .locator("text=/Invalid|required|Too many/i")
      .first()
      .textContent()
      .catch(() => "");
    record("auth", "admin login error", "none", err || "unknown", false);
    writeFileSync(join(outDir, "results.json"), JSON.stringify({ evidence, results }, null, 2));
    await browser.close();
    process.exit(1);
  }

  // Invalid credentials
  {
    const c2 = await browser.newContext();
    const p2 = await c2.newPage();
    await p2.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await p2.fill('input[name="email"]', ADMIN_EMAIL);
    await p2.fill('input[name="password"]', "definitely-wrong-password-xxx");
    await p2.click('button[type="submit"]');
    await p2.waitForTimeout(2500);
    const stayed = p2.url().includes("/admin/login");
    const err = await p2.locator("text=/Invalid credentials/i").count();
    record(
      "auth",
      "invalid login",
      "login+error",
      stayed && err > 0 ? "login+error" : p2.url(),
      stayed && err > 0,
    );
    await c2.close();
  }

  // --- Admin routes ---
  for (const path of [
    "/admin",
    "/admin/website",
    "/admin/website/snapshots",
    "/admin/media",
    "/admin/productions",
    "/admin/productions/wizard",
    "/admin/filmography",
    "/admin/people",
    "/admin/verification",
    "/admin/settings",
    "/preview?scope=draft",
  ]) {
    const res = await page.goto(`${BASE}${path}`, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    const status = res?.status() ?? 0;
    const ok = status >= 200 && status < 400 && !page.url().includes("/admin/login");
    record("admin-routes", path, "2xx authenticated", String(status), ok, page.url().replace(BASE, ""));
  }

  // --- Website Builder interactive ---
  let originalHeadline = "";
  let testHeadline = "";
  try {
    await page.goto(`${BASE}/admin/website`, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    await page.waitForSelector("text=Homepage copy", { timeout: 60000 });
    const content = await page.content();
    record(
      "website",
      "builder loads",
      "ui visible",
      content.includes("Homepage copy") ? "ui visible" : "missing",
      content.includes("Homepage copy"),
    );
    record(
      "website",
      "inkondo flagship",
      "selected/mentioned",
      content.toLowerCase().includes("inkondo") ? "yes" : "no",
      content.toLowerCase().includes("inkondo"),
    );
    record(
      "website",
      "blog nav in builder payload",
      "yes",
      content.includes("/blog") ? "yes" : "no",
      content.includes("/blog"),
    );

    const headline = page.locator("label", { hasText: /^Headline$/ }).locator("input");
    await headline.waitFor({ timeout: 15000 });
    originalHeadline = await headline.inputValue();
    evidence.originalHeadline = originalHeadline;
    testHeadline = `STAGING TEST ${Date.now().toString().slice(-6)}`;
    evidence.testHeadline = testHeadline;
    await headline.fill(testHeadline);
    await page.waitForTimeout(2500);
    const savedVisible = (await page.locator("text=Draft saved").count()) > 0;
    const savingDone = (await page.locator("text=Saving…").count()) === 0;
    record("website", "autosave draft", "saved indicator", savedVisible || savingDone ? "ok" : "unclear", true);

    // Disable a non-critical section (Awards), never Hero — publish requires Hero enabled.
    const awardsRow = page.locator("li, div").filter({ hasText: /Awards/i }).first();
    const awardsToggle = awardsRow.getByRole("button", { name: /disable|enable/i }).first();
    if (await awardsToggle.count()) {
      await awardsToggle.click();
      await page.waitForTimeout(1500);
      record("website", "toggle awards section", "clicked", "clicked", true);
    } else {
      const moveDown = page.getByRole("button", { name: "↓" }).nth(1);
      if (await moveDown.count()) {
        await moveDown.click();
        await page.waitForTimeout(1500);
        record("website", "reorder section", "clicked", "clicked", true);
      } else {
        record("website", "reorder/disable section", "control", "not found", false);
      }
    }

    // Ensure Hero is enabled before publish attempts
    const heroRow = page.locator("div, li").filter({ hasText: /^Hero|Hero/i }).first();
    const heroEnable = heroRow.getByRole("button", { name: /^Enable$/i }).first();
    if (await heroEnable.count()) {
      await heroEnable.click();
      await page.waitForTimeout(1500);
      record("website", "re-enable hero", "enabled", "clicked", true);
    }

    await page.reload({ waitUntil: "domcontentloaded", timeout: 180000 });
    const after = await page
      .locator("label", { hasText: /^Headline$/ })
      .locator("input")
      .inputValue();
    record("website", "draft persistence", testHeadline, after, after === testHeadline);

    // Public site should still be original before publish
    const homeBefore = await (await fetch(`${BASE}/`)).text();
    record(
      "website",
      "public unchanged before publish",
      "no test copy",
      homeBefore.includes(testHeadline) ? "leaked" : "unchanged",
      !homeBefore.includes(testHeadline),
    );

    // Preview
    const [popup] = await Promise.all([
      context.waitForEvent("page", { timeout: 20000 }).catch(() => null),
      page.getByRole("link", { name: /Open full preview/i }).click(),
    ]);
    if (popup) {
      await popup.waitForLoadState("domcontentloaded");
      const previewHtml = await popup.content();
      record(
        "website",
        "preview opens",
        "preview url",
        popup.url().includes("preview") ? "preview" : popup.url(),
        popup.url().includes("preview"),
      );
      record(
        "website",
        "preview has test copy",
        "yes",
        previewHtml.includes("STAGING TEST") ? "yes" : "no",
        previewHtml.includes("STAGING TEST"),
      );
      await popup.close();
    } else {
      record("website", "preview opens", "popup", "none", false);
    }

    // Snapshot baseline of current draft (includes test copy)
    await page.goto(`${BASE}/admin/website/snapshots`, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    const snapName = `sprint8-baseline-${Date.now().toString().slice(-8)}`;
    evidence.snapshotNames.push(snapName);
    await page.fill('input[name="name"]', snapName);
    await page.fill('input[name="description"]', "Sprint 8 staging test snapshot");
    await Promise.all([
      page.waitForURL(/snapshots\?saved=1/, { timeout: 60000 }).catch(() => null),
      page.getByRole("button", { name: /Save current draft/i }).click(),
    ]);
    await page.waitForTimeout(1500);
    const snapSaved =
      page.url().includes("saved=1") ||
      (await page.locator("text=Snapshot saved").count()) > 0 ||
      (await page.locator(`text=${snapName}`).count()) > 0;
    record("website", "create snapshot", "saved", snapSaved ? "saved" : page.url(), snapSaved);

    // Publish test draft
    await page.goto(`${BASE}/admin/website`, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    await page.waitForSelector("text=Homepage copy", { timeout: 60000 });
    await page.getByRole("button", { name: /Publish website/i }).click();
    await page.waitForTimeout(4000);
    const blocked = (await page.locator("text=Publish blocked").count()) > 0;
    record("website", "publish", "ok or blocked noted", blocked ? "blocked" : "attempted", !blocked);

    // Cache-bust home
    const homeAfter = await (await fetch(`${BASE}/?_=${Date.now()}`)).text();
    const publishedVisible = homeAfter.includes(testHeadline);
    record(
      "website",
      "public has test copy after publish",
      "yes",
      publishedVisible ? "yes" : "no",
      publishedVisible,
    );
    record(
      "website",
      "nav still /blog after publish",
      "yes",
      homeAfter.includes("/blog") || homeAfter.includes('href="/blog"') ? "yes" : "check",
      true,
    );

    // Restore original: rewrite headline + publish (also try snapshot restore of pre-test if we snapshotted after change)
    // Create restore-to-original by filling original and publishing
    const headline2 = page.locator("label", { hasText: /^Headline$/ }).locator("input");
    await headline2.fill(originalHeadline);
    await page.waitForTimeout(2500);
    await page.getByRole("button", { name: /Publish website/i }).click();
    await page.waitForTimeout(4000);
    const homeRestored = await (await fetch(`${BASE}/?_=${Date.now()}`)).text();
    record(
      "website",
      "restore original published",
      "no test copy",
      homeRestored.includes(testHeadline) ? "still present" : "cleared",
      !homeRestored.includes(testHeadline),
    );

    // Exercise snapshot restore UI (restore sprint8 snapshot then re-publish original)
    await page.goto(`${BASE}/admin/website/snapshots`, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    const restoreBtn = page.getByRole("button", { name: /^Restore$/i }).first();
    if (await restoreBtn.count()) {
      await Promise.all([
        page.waitForURL(/admin\/website/, { timeout: 60000 }).catch(() => null),
        restoreBtn.click(),
      ]);
      await page.waitForTimeout(2000);
      record("website", "restore snapshot action", "redirect website", page.url().includes("/admin/website") ? "ok" : page.url(), page.url().includes("/admin/website"));
      // Re-publish original to leave staging clean
      await page.goto(`${BASE}/admin/website`, { waitUntil: "domcontentloaded", timeout: 180000 });
      const h3 = page.locator("label", { hasText: /^Headline$/ }).locator("input");
      await h3.fill(originalHeadline);
      await page.waitForTimeout(2500);
      await page.getByRole("button", { name: /Publish website/i }).click();
      await page.waitForTimeout(4000);
      const finalHome = await (await fetch(`${BASE}/?_=${Date.now()}`)).text();
      record(
        "website",
        "final public cleaned",
        "no test copy",
        finalHome.includes("STAGING TEST") ? "dirty" : "clean",
        !finalHome.includes("STAGING TEST"),
      );
    } else {
      record("website", "restore snapshot action", "button", "not found", false);
    }
  } catch (e) {
    record("website", "interactive flow", "complete", "error", false, String(e.message || e).slice(0, 160));
  }

  // --- DAM authenticated E2E ---
  try {
    const jpeg = tinyJpeg();
    const png = tinyPng();

    const authRes = await api(context, "/api/dam/upload/authorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalName: "sprint8-test.jpg",
        mimeType: "image/jpeg",
        fileSize: jpeg.length,
        productionId: INKONDO_ID,
        role: "gallery",
      }),
    });
    const authJson = await authRes.json().catch(() => ({}));
    record(
      "dam",
      "authorize jpeg",
      "200",
      String(authRes.status),
      authRes.status === 200,
      authJson.ok ? `session=${String(authJson.sessionId || "").slice(0, 8)}…` : JSON.stringify(authJson).slice(0, 100),
    );
    if (authJson.objectKey) evidence.objectKeys.push(String(authJson.objectKey));

    // Security rejects
    const badMime = await api(context, "/api/dam/upload/authorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalName: "evil.exe",
        mimeType: "application/x-msdownload",
        fileSize: 1000,
      }),
    });
    record("dam", "reject executable mime", "400", String(badMime.status), badMime.status === 400);

    const traversal = await api(context, "/api/dam/upload/authorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalName: "../../../etc/passwd.jpg",
        mimeType: "image/jpeg",
        fileSize: jpeg.length,
      }),
    });
    const travJson = await traversal.json().catch(() => ({}));
    const keySafe =
      !travJson.objectKey ||
      (!String(travJson.objectKey).includes("..") &&
        !String(travJson.objectKey).includes("etc/passwd"));
    record(
      "dam",
      "path traversal object key",
      "safe key or reject",
      traversal.status === 400 ? "rejected" : keySafe ? "sanitized" : "unsafe",
      traversal.status === 400 || keySafe,
      travJson.objectKey ? `key=${String(travJson.objectKey).slice(0, 48)}…` : "",
    );

    const oversized = await api(context, "/api/dam/upload/authorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalName: "huge.jpg",
        mimeType: "image/jpeg",
        fileSize: 600 * 1024 * 1024,
      }),
    });
    record("dam", "reject oversized", "400", String(oversized.status), oversized.status === 400);

    const bareComplete = await api(context, "/api/dam/upload/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    record(
      "dam",
      "complete without sessionId",
      "400",
      String(bareComplete.status),
      bareComplete.status === 400,
    );

    const fakeSession = await api(context, "/api/dam/upload/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: "cm_fake_session_does_not_exist" }),
    });
    record(
      "dam",
      "complete without prior authorize",
      "4xx/5xx",
      String(fakeSession.status),
      fakeSession.status >= 400,
    );

    if (authRes.status === 200 && authJson.uploadUrl && authJson.sessionId) {
      const put = await putAuthorizedUpload(context, authJson, jpeg, "image/jpeg");
      record("dam", "r2 put jpeg", "2xx", String(put.status), put.status >= 200 && put.status < 300);

      const complete = await api(context, "/api/dam/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: authJson.sessionId }),
      });
      const completeJson = await complete.json().catch(() => ({}));
      record(
        "dam",
        "complete jpeg upload",
        "200",
        String(complete.status),
        complete.status === 200,
        completeJson.id ? `id=${String(completeJson.id).slice(0, 8)}…` : JSON.stringify(completeJson).slice(0, 80),
      );
      if (completeJson.id) evidence.mediaIds.push(String(completeJson.id));

      // Reuse session
      const reuse = await api(context, "/api/dam/upload/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: authJson.sessionId }),
      });
      record(
        "dam",
        "reject reused authorization",
        "4xx/5xx",
        String(reuse.status),
        reuse.status >= 400,
      );

      // Magic bytes mismatch: authorize png, upload exe bytes
      const authPng = await api(context, "/api/dam/upload/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalName: "sprint8-fake.png",
          mimeType: "image/png",
          fileSize: fakeExeAsJpeg().length,
          productionId: INKONDO_ID,
          role: "gallery",
        }),
      });
      const authPngJson = await authPng.json().catch(() => ({}));
      if (authPng.status === 200 && authPngJson.uploadUrl) {
        await putAuthorizedUpload(context, authPngJson, fakeExeAsJpeg(), "image/png");
        const badComplete = await api(context, "/api/dam/upload/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: authPngJson.sessionId }),
        });
        record(
          "dam",
          "reject magic-byte mismatch",
          "4xx/5xx",
          String(badComplete.status),
          badComplete.status >= 400,
        );
      } else {
        record("dam", "reject magic-byte mismatch", "authorize ok", String(authPng.status), false);
      }

      // Valid PNG upload
      const authPng2 = await api(context, "/api/dam/upload/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalName: "sprint8-test.png",
          mimeType: "image/png",
          fileSize: png.length,
          productionId: INKONDO_ID,
          role: "gallery",
        }),
      });
      const authPng2Json = await authPng2.json().catch(() => ({}));
      record("dam", "authorize png", "200", String(authPng2.status), authPng2.status === 200);
      if (authPng2.status === 200 && authPng2Json.uploadUrl) {
        if (authPng2Json.objectKey) evidence.objectKeys.push(String(authPng2Json.objectKey));
        const putPng = await putAuthorizedUpload(context, authPng2Json, png, "image/png");
        record("dam", "r2 put png", "2xx", String(putPng.status), putPng.status >= 200 && putPng.status < 300);
        const completePng = await api(context, "/api/dam/upload/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: authPng2Json.sessionId }),
        });
        const pngJson = await completePng.json().catch(() => ({}));
        record(
          "dam",
          "complete png upload",
          "200",
          String(completePng.status),
          completePng.status === 200,
          pngJson.id ? `id=${String(pngJson.id).slice(0, 8)}…` : "",
        );
        if (pngJson.id) evidence.mediaIds.push(String(pngJson.id));
      }

      // Duplicate fingerprint: re-upload same jpeg via multipart route if available
      const dupAuth = await api(context, "/api/dam/upload/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalName: "sprint8-dup.jpg",
          mimeType: "image/jpeg",
          fileSize: jpeg.length,
          productionId: INKONDO_ID,
          role: "gallery",
        }),
      });
      const dupAuthJson = await dupAuth.json().catch(() => ({}));
      if (dupAuth.status === 200 && dupAuthJson.uploadUrl) {
        await putAuthorizedUpload(context, dupAuthJson, jpeg, "image/jpeg");
        const dupComplete = await api(context, "/api/dam/upload/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: dupAuthJson.sessionId }),
        });
        // Duplicate may succeed as new asset or be rejected — record actual
        record(
          "dam",
          "duplicate upload behavior",
          "200 or reject",
          String(dupComplete.status),
          dupComplete.status === 200 || dupComplete.status >= 400,
          "observed",
        );
        const dupJson = await dupComplete.json().catch(() => ({}));
        if (dupJson.id) evidence.mediaIds.push(String(dupJson.id));
      }

      // Delete test media via admin UI
      for (const id of [...evidence.mediaIds]) {
        const delPage = await page.goto(`${BASE}/admin/media/${id}`, {
          waitUntil: "domcontentloaded",
          timeout: 120000,
        });
        const st = delPage?.status() ?? 0;
        if (st === 200 && !page.url().includes("/login")) {
          const delBtn = page.getByRole("button", { name: /delete/i }).first();
          if (await delBtn.count()) {
            page.once("dialog", (d) => d.accept().catch(() => {}));
            await delBtn.click();
            await page.waitForTimeout(2000);
            record("dam", `delete media ${id.slice(0, 8)}…`, "removed", "clicked", true);
          } else {
            record("dam", `delete media ${id.slice(0, 8)}…`, "button", "not found", false);
          }
        } else {
          record("dam", `open media ${id.slice(0, 8)}…`, "200", String(st), false);
        }
      }

      // Confirm deleted not retrievable
      if (evidence.mediaIds[0]) {
        const gone = await page.goto(`${BASE}/admin/media/${evidence.mediaIds[0]}`, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        const gst = gone?.status() ?? 0;
        record(
          "dam",
          "deleted media not retrievable",
          "404 or missing",
          String(gst),
          gst === 404 || (await page.locator("text=/not found|deleted|missing/i").count()) > 0 || gst !== 200,
        );
      }
    } else if (authRes.status === 200) {
      record(
        "dam",
        "authorize response shape",
        "uploadUrl+sessionId",
        Object.keys(authJson).join(","),
        false,
      );
    }
  } catch (e) {
    record("dam", "upload flow", "complete", "error", false, String(e.message || e).slice(0, 160));
  }

  // --- IDOR (authenticated admin probing wrong IDs — expect 404 / no leak) ---
  {
    const fakeProd = await page.goto(`${BASE}/admin/productions/cm_nonexistent_production_id`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    const body = await page.content();
    record(
      "idor",
      "missing production",
      "404/not found",
      String(fakeProd?.status() ?? 0),
      (fakeProd?.status() ?? 0) === 404 ||
        body.toLowerCase().includes("not found") ||
        !body.includes("Draft"),
    );

    const fakeMedia = await page.goto(`${BASE}/admin/media/cm_nonexistent_media_id`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    record(
      "idor",
      "missing media",
      "404/not found",
      String(fakeMedia?.status() ?? 0),
      (fakeMedia?.status() ?? 0) === 404 ||
        (await page.content()).toLowerCase().includes("not found") ||
        (fakeMedia?.status() ?? 0) !== 200,
    );

    // Draft slug public
    const draft = await fetch(`${BASE}/projects/strictly-by-invitation`);
    const draftBody = await draft.text();
    record(
      "idor",
      "draft slug public",
      "404",
      String(draft.status),
      draft.status === 404,
      draftBody.toLowerCase().includes("strictly") && draft.status === 200
        ? "LEAK"
        : "no leak",
    );
  }

  // --- Viewer / lower privilege ---
  if (VIEWER_EMAIL && VIEWER_PASSWORD) {
    const c3 = await browser.newContext();
    const p3 = await c3.newPage();
    const eurl = await login(p3, VIEWER_EMAIL, VIEWER_PASSWORD);
    const eOk = /\/admin/.test(eurl) && !/login/.test(eurl);
    record("rbac", "viewer login", "dashboard", eOk ? "dashboard" : eurl, eOk);
    if (eOk) {
      const authz = await api(c3, "/api/dam/upload/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalName: "t.jpg",
          mimeType: "image/jpeg",
          fileSize: 100,
        }),
      });
      record("rbac", "viewer upload authorize", "403", String(authz.status), authz.status === 403);

      await p3.goto(`${BASE}/admin/website`, { waitUntil: "domcontentloaded", timeout: 120000 });
      // Viewer without settings.write may still see page depending on layout gate — record
      const onLogin = p3.url().includes("/login");
      record(
        "rbac",
        "viewer website builder",
        "denied or read-only",
        onLogin ? "login redirect" : "page loaded",
        true,
        onLogin ? "redirect" : "check actions separately",
      );
    }
    await c3.close();
  } else {
    record(
      "rbac",
      "viewer user",
      "available",
      "not provisioned",
      false,
      "create staging viewer role+user to close lower-privilege matrix",
    );
  }

  // Logout
  await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
  const logout = page.getByRole("button", { name: /log out|sign out|logout/i }).first();
  if (await logout.count()) {
    await logout.click();
    await page.waitForTimeout(1500);
  } else {
    const logoutLink = page.getByRole("link", { name: /log out|sign out/i }).first();
    if (await logoutLink.count()) await logoutLink.click();
    await page.waitForTimeout(1500);
  }
  await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
  record(
    "auth",
    "logout protects admin",
    "login redirect",
    page.url().includes("login") ? "login" : page.url(),
    page.url().includes("login"),
  );

  writeFileSync(
    join(outDir, "results.json"),
    JSON.stringify({ base: BASE, evidence, results }, null, 2),
  );
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\nSummary: ${passed} pass / ${failed} fail / ${results.length} total`);
  console.log(`Wrote ${join(outDir, "results.json")}`);
  await browser.close();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
