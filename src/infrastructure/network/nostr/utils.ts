import { bech32 } from "bech32";

export function pubkeyToNpub(pubkey: string): string {
  const words = bech32.toWords(hexToUint8Array(pubkey));
  return bech32.encode("npub", words);
}

function hexToUint8Array(hex: string): Uint8Array {
  const length = hex.length / 2;
  const uint8Array = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    const byte = parseInt(hex.substr(i * 2, 2), 16);
    uint8Array[i] = byte;
  }
  return uint8Array;
}
