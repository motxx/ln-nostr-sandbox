import { bech32 } from "bech32";
import { UnsignedEvent } from "nostr-tools";
import { createHash } from "sha256-uint8array";

export const toLnurlPayStaticEndpoint = (nip05Id: string) => {
  const [name, domain] = nip05Id.split("@");
  if (!name || !domain) {
    throw new Error("Invalid nip05Id");
  }
  return `https://${domain}/.well-known/lnurlp/${name}`;
};

export const toLnurlPayUrl = (staticEndpoint: string) => {
  const data = new TextEncoder().encode(staticEndpoint);
  const words = bech32.toWords(data);
  return bech32.encode("lnurl", words);
};

export const unixtime = () => {
  return Math.floor(Date.now() / 1000);
};

export const generateEventId = (event: UnsignedEvent) => {
  // https://github.com/nostr-protocol/nips/blob/master/01.md#events-and-signatures
  const { kind, pubkey, created_at, tags, content } = event;
  const message = JSON.stringify([0, pubkey, created_at, kind, tags, content]);
  return createHash().update(message).digest("hex");
};
