import { UnsignedEvent, nip57 } from "nostr-tools";
//import { kinds } from "nostr-tools";
import NDK, {
  NDKZap,
  NDKUser,
  NDKNip07Signer,
  NostrEvent,
} from "@nostr-dev-kit/ndk";
import { bech32 } from "bech32";
import { toLnurlPayStaticEndpoint, toLnurlPayUrl, unixtime } from "./utils";
import { NostrUnknownUserError } from "./error";

export class NostrClient {
  #ndk: NDK;
  #user: NDKUser;
  #relays: string[];

  private constructor(
    ndk: NDK,
    signer: NDKNip07Signer,
    user: NDKUser,
    relays: string[]
  ) {
    this.#ndk = ndk;
    this.#user = user;
    this.#relays = relays;
  }

  static async connect(): Promise<NostrClient> {
    const signer = new NDKNip07Signer();
    const user = await signer.blockUntilReady();
    const relays = [
      // "wss://localhost:7000",
      "wss://pablof7z.nostr1.com",
      "wss://offchain.pub",
      "wss://relay.f7z.io",
      "wss://relay.damus.io",
      "wss://relay.snort.social",
      "wss://offchain.pub/",
      "wss://nostr.mom",
      "wss://nostr-pub.wellorder.net",
      "wss://purplepag.es",
      "wss://brb.io/",
    ];
    const ndk = new NDK({
      explicitRelayUrls: relays,
      signer,
    });
    ndk.assertSigner();
    return new NostrClient(ndk, signer, user, relays);
  }

  async getPublicKey() {
    return this.#user.pubkey;
  }

  async getNpub() {
    return this.#user.npub;
  }

  async getZapEndpoint(lud16: string) {
    console.log("LUD16", lud16);

    // https://scrapbox.io/nostr/NIP-05%E8%AA%8D%E8%A8%BC%E3%83%90%E3%83%83%E3%82%B8%E3%81%AE%E4%BB%98%E3%81%91%E6%96%B9
    // moti@getalby.com => https://getalby.com/.well-known/nostr.json?name=moti
    // => {"names":{"moti":"ab867038393aacff2b72bb5070498fbd876e311c76243f5f6ea32718c74b445a"}}
    const ndkUser = await NDKUser.fromNip05(lud16, this.#ndk);
    console.log("NDK User", ndkUser);

    const ndkZap = new NDKZap({
      ndk: this.#ndk,
      zappedUser: ndkUser,
    });
    console.log("NDK Zap", ndkZap);

    const endpoint = await ndkZap.getZapEndpoint();
    console.log("Endpoint", endpoint ? endpoint : "undefined");
    /*
    const req = nip57.makeZapRequest({
      profile: "profile",
      event: "event",
      amount: 100,
      relays: ["relay1", "relay2"],
      comment: "comment",
    });
    const metadata: NostrEvent = buildEvent({
      kind: 0,
      content: JSON.stringify({ lud16 }),
    });
    await nip57.getZapEndpoint(metadata);
    */
    return endpoint;
  }

  async makeZapRequest(nip05Id: string, msat: number): Promise<UnsignedEvent> {
    const to = await NDKUser.fromNip05(nip05Id, this.#ndk);
    if (!to) {
      throw new NostrUnknownUserError(nip05Id);
    }

    // https://scrapbox.io/nostr/NIP-57
    return {
      kind: 9734, //kinds.ZapRequest,
      pubkey: this.#user.pubkey,
      created_at: unixtime(),
      tags: [
        ["relays", ...this.#relays],
        ["amount", msat.toString()],
        ["lnurl", toLnurlPayUrl(toLnurlPayStaticEndpoint(nip05Id)!)],
        ["p", to.pubkey],
      ],
      content: "zap request",
    };
  }

  async zap(nip05Id: string, msat: number) {
    const unsignedEvent = await this.makeZapRequest(nip05Id, msat);
    const sig = await this.#ndk.signer!.sign(unsignedEvent);
    const zapEndpoint = await nip57.getZapEndpoint({
      ...unsignedEvent,
      kind: 0,
      sig,
    });
    return zapRequest;
  }
}
