import assert from "node:assert/strict";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the COSTECH@40 summit experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /COSTECH@40 Summit/);
  assert.match(html, /Four decades of ideas/);
  assert.match(html, /Panel activity themes/);
  assert.match(html, /Science for Tanzania&#x27;s Prosperity/);
  assert.match(html, /Innovation for Industrial Growth and Jobs/);
  assert.match(html, /17–18 November 2026/);
  assert.match(html, /Mlimani City/);
  assert.match(html, /Official programme/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("renders the contribution and administration routes", async () => {
  const [submissionResponse, adminResponse] = await Promise.all([render("/submit"), render("/admin")]);
  assert.equal(submissionResponse.status, 200);
  assert.equal(adminResponse.status, 200);
  assert.match(await submissionResponse.text(), /Bring your work to the national stage/);
  assert.match(await adminResponse.text(), /Shape what the nation sees/);
});

test("removes starter preview infrastructure", async () => {
  const { access, readFile } = await import("node:fs/promises");
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  await assert.rejects(access(new URL("public/_sites-preview", templateRoot)));
});
