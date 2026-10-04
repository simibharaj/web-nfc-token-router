// Thin wrapper around the Web NFC API (NDEFReader).
// Works only in Chrome on Android, on a secure (https) page, after a user gesture.
class NFCTokenManager {
  constructor() {
    this.isSupported = "NDEFReader" in window;
    this.controller = null;
  }

  async startListening(onRead, onError) {
    if (!this.isSupported) return onError("Web NFC is not supported in this browser. Use Chrome on Android over https.");
    try {
      this.controller = new AbortController();
      const reader = new NDEFReader();
      await reader.scan({ signal: this.controller.signal });
      reader.onreadingerror = () => onError("Card detected but could not be read.");
      reader.onreading = ({ serialNumber, message }) => {
        const records = [...message.records].map(r => ({
          recordType: r.recordType, data: new Uint8Array(r.data.buffer, r.data.byteOffset, r.data.byteLength),
        }));
        onRead(summarizeRead({ serialNumber, records }));
      };
    } catch (err) { onError(`Could not start scanning: ${err.message}`); }
  }

  stopListening() { if (this.controller) this.controller.abort(); }

  async writeProfileUrl(rawUrl) {
    if (!this.isSupported) throw new Error("Web NFC is not supported in this browser.");
    const url = validateProfileUrl(rawUrl);          // refuses anything but https
    await new NDEFReader().write({ records: [{ recordType: "url", data: url }] });
    return url;
  }
}
