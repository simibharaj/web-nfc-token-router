// Pure helpers (no browser APIs) so they can be tested in Node.

/** Only https URLs are allowed to be written to a card. Returns the normalized URL or throws. */
function validateProfileUrl(input) {
  let u;
  try { u = new URL(String(input).trim()); } catch { throw new Error("Not a valid URL"); }
  if (u.protocol !== "https:") throw new Error("Only https:// URLs can be written");
  if (u.username || u.password) throw new Error("URLs with embedded credentials are not allowed");
  return u.toString();
}

/** Decodes NDEF record bytes. Text records start with a status byte and language code. */
function decodeRecord(recordType, bytes) {
  const dec = new TextDecoder();
  if (recordType === "text") {
    const langLen = bytes[0] & 0x3f;
    return dec.decode(bytes.slice(1 + langLen));
  }
  return dec.decode(bytes);
}

/** Turns raw reader output into plain objects for display. */
function summarizeRead({ serialNumber, records }) {
  return {
    serialNumber: serialNumber || null,
    records: records.map(r => ({ type: r.recordType, text: decodeRecord(r.recordType, r.data) })),
  };
}

if (typeof module !== "undefined") module.exports = { validateProfileUrl, decodeRecord, summarizeRead };
