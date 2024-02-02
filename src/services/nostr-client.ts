import { NostrEvent } from "./nostr";

export type NostrClient = {
  signEvent: () => Promise<NostrEvent>;
};

export const connectNostr = async (): Promise<NostrClient> => {
  if (!window.nostr) {
    throw new Error("window.nostr is not defined.");
  }

  const nostr = window.nostr;
  const pk = await nostr.getPublicKey();
  console.log("Public Key: ", pk);

  return {
    signEvent: async () => {
      console.log("Signing event");
      const data = {
        kind: 0,
        tags: [],
        pubkey: pk,
        content: "Hello, Nostr!",
        created_at: Date.now(),
      };
      const event = await nostr.signEvent(data);
      console.log("Event: ", event);
      return event;
    },
  };
};
