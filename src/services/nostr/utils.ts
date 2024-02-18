import { UnsignedEvent } from "nostr-tools";
import { createHash } from "sha256-uint8array";

export const unixtime = () => {
  return Math.floor(Date.now() / 1000);
};

/**
 * Generate event id from unsigned event according to NIP-01
 * @param event UnsignedEvent
 * @returns string
 */
export const generateEventId = (event: UnsignedEvent) => {
  // https://github.com/nostr-protocol/nips/blob/master/01.md#events-and-signatures
  const { kind, pubkey, created_at, tags, content } = event;
  const message = JSON.stringify([0, pubkey, created_at, kind, tags, content]);
  return createHash().update(message).digest("hex");
};
