const test = require("node:test");
const assert = require("node:assert");
const { validateProfileUrl, decodeRecord, summarizeRead } = require("../nfc-core");

test("accepts https URLs", () => {
  assert.equal(validateProfileUrl(" https://example.com/me "), "https://example.com/me");
});
test("rejects http, javascript and file URLs", () => {
  for (const bad of ["http://example.com", "javascript:alert(1)", "file:///etc/passwd"]) {
    assert.throws(() => validateProfileUrl(bad), bad);
  }
});
test("rejects garbage and embedded credentials", () => {
  assert.throws(() => validateProfileUrl("not a url"));
  assert.throws(() => validateProfileUrl("https://user:pw@example.com"));
});
test("decodes url records", () => {
  const bytes = new TextEncoder().encode("https://example.com");
  assert.equal(decodeRecord("url", bytes), "https://example.com");
});
test("decodes text records by skipping status byte and language code", () => {
  const bytes = new Uint8Array([2, 101, 110, ...new TextEncoder().encode("hello")]); // 'en'
  assert.equal(decodeRecord("text", bytes), "hello");
});
test("summarizes a read", () => {
  const out = summarizeRead({ serialNumber: "04:aa", records: [{ recordType: "url", data: new TextEncoder().encode("https://example.com") }] });
  assert.deepEqual(out, { serialNumber: "04:aa", records: [{ type: "url", text: "https://example.com" }] });
});
