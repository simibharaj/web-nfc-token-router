# Web NFC Token Router (demo)

Read an NFC card and write a link to one, straight from a web page, using the browser's Web NFC API.

## Browser support (important)
Web NFC works only in **Chrome on Android**, on an **https** page, after a tap or click. It does not work on iPhone/Safari or on desktop. Open `index.html` from an https host (for example GitHub Pages) on an Android phone.

## What is tested
The logic that does not need hardware is unit tested (`npm test`, Node 18+):
- Only `https://` links can be written. `http:`, `javascript:`, `file:` and links with embedded passwords are refused.
- Text and URL records are decoded correctly, including the language-code byte in text records.

## What is not tested
The actual card read/write calls (`nfc-bridge.js`) need a real phone and card. They are written against the Web NFC spec but are **not verified on hardware in this repo**. Treat it as a starting point.

## Safety notes
- Writing a card replaces what is on it. Use blank cards you own.
- The page never sends card contents anywhere.

## Files
- `nfc-core.js`: pure validation/decoding helpers (tested)
- `nfc-bridge.js`: Web NFC wrapper
- `index.html`: small demo page
