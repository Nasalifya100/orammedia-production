import { chromium } from "playwright";

const BASE = "https://orammedia-staging.nasalifya007.workers.dev";
const jpeg = Buffer.from(
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGfAP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//Z",
  "base64",
);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded" });
await page.fill('input[name="email"]', "admin+staging@orammedia.com");
await page.fill('input[name="password"]', "oram-staging-change-me-2026");
await Promise.all([
  page.waitForURL(/\/admin(?!\/login)/, { timeout: 60000 }),
  page.click('button[type="submit"]'),
]);
const cookie = (await context.cookies()).map((c) => `${c.name}=${c.value}`).join("; ");

const auth = await fetch(`${BASE}/api/dam/upload/authorize`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Cookie: cookie, Origin: BASE },
  body: JSON.stringify({
    originalName: "sprint8-test.jpg",
    mimeType: "image/jpeg",
    fileSize: jpeg.length,
    productionId: "cmro8oqhq000l50vue4tfjkc4",
    role: "gallery",
  }),
});
const aj = await auth.json();
console.log("auth", auth.status, {
  sessionId: String(aj.sessionId || "").slice(0, 8),
  proxy: aj.proxy,
  url: String(aj.uploadUrl || "").slice(0, 100),
});

try {
  const put = await fetch(aj.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/jpeg", Cookie: cookie, Origin: BASE },
    body: jpeg,
  });
  console.log("put", put.status, await put.text());
} catch (e) {
  console.log("put error", e.cause || e.message || e);
}

try {
  const complete = await fetch(`${BASE}/api/dam/upload/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie, Origin: BASE },
    body: JSON.stringify({ sessionId: aj.sessionId }),
  });
  console.log("complete", complete.status, await complete.text());
} catch (e) {
  console.log("complete error", e.message);
}

await page.goto(`${BASE}/admin/website`, { waitUntil: "domcontentloaded" });
const headline = page.locator("label", { hasText: /^Headline$/ }).locator("input");
const val = await headline.inputValue();
console.log("draft headline", val);
await page.getByRole("button", { name: /Publish website/i }).click();
await page.waitForTimeout(5000);
const blocked = await page.locator("text=Publish blocked").count();
const errList = await page.locator(".text-red-200 li").allTextContents().catch(() => []);
console.log("blocked", blocked, "errors", errList);
const home = await (await fetch(`${BASE}/?cb=${Date.now()}`)).text();
console.log("home includes draft headline", home.includes(val));
await browser.close();
