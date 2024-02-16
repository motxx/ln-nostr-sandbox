import { Event, UnsignedEvent, kinds } from "nostr-tools";
import NDK, { NDKUser, NDKNip07Signer } from "@nostr-dev-kit/ndk";
import {
  generateEventId,
  toLnurlPayStaticEndpoint,
  toLnurlPayUrl,
  unixtime,
} from "./utils";
import {
  NostrCallZapEndpointError,
  NostrGetZapEndpointCallbackUrlError,
  NostrGetZapInfoError,
  NostrInvoiceNotFoundError,
  NostrMaxSendableConstraintError,
  NostrMinSendableConstraintError,
  NostrUnknownUserError,
} from "./error";
import axios from "axios";
import { GetZapInvoiceResponse } from "../user-service";

export class NostrClient {
  #ndk: NDK;
  #user: NDKUser;
  #relays: string[];

  private constructor(ndk: NDK, user: NDKUser, relays: string[]) {
    this.#ndk = ndk;
    this.#user = user;
    this.#relays = relays;
  }

  static readonly RELAYS = [
    "wss://relay.nostr.wirednet.jp",
    "wss://relay-jp.nostr.wirednet.jp",
    "wss://ipv6.nostr.wirednet.jp",
    "wss://nostr.holybea.com",
    "wss://nostr.fediverse.jp",
    "wss://yabu.me",
    "wss://nostr-relay.nokotaro.com",
    "wss://nrelay.c-stellar.net",
    "wss://nrelay-jp.c-stellar.ne",
    "wss://relay.yozora.world",
    "wss://r.kojira.io",
  ];

  static async connect(): Promise<NostrClient> {
    const signer = new NDKNip07Signer();
    const user = await signer.blockUntilReady();
    const ndk = new NDK({
      explicitRelayUrls: NostrClient.RELAYS,
      signer,
    });
    ndk.assertSigner();
    return new NostrClient(ndk, user, NostrClient.RELAYS);
  }

  async getPublicKey() {
    return this.#user.pubkey;
  }

  async getNpub() {
    return this.#user.npub;
  }

  // NIP-57 Lightning Zaps: https://scrapbox.io/nostr/NIP-57
  async signAndGetZapInvoice(
    nip05Id: string,
    sat: number
  ): Promise<GetZapInvoiceResponse> {
    const millisats = sat * 1000;
    const unsignedEvent = await this.#makeZapRequest(nip05Id, millisats);
    const sig = await this.#ndk.signer!.sign(unsignedEvent);
    const zapEndpoint = await this.#getZapEndpointWithParams(
      unsignedEvent,
      sig,
      nip05Id
    );

    /*
    Example response from zap endpoint
    {
        "status": "OK",
        "successAction": {
            "tag": "message",
            "message": "Thanks, sats received!"
        },
        "verify": "https://getalby.com/lnurlp/moti/verify/mJstG5LqRvPjPJVCeBmjvfNQ",
        "routes": [],
        "pr": "lnbc10n1pju3356pp59dzs5xedvq3yv96n90hlrlf26g8uagsrhsw9h6ccymhhuu90chrshp5cezvxddw0lgesz3xpr67q7v8tux7uv5h5vdwukrlgg3m22ce6dcscqzzsxqyz5vqsp5ju3nx8d7ahzn7mzl5nplxq7w7x6pggr7p9s6nytzg2rcexf9vu6q9qyyssqje96szu2umwqjuzcxccwradqga9fuu3g9gnm8ssrfmz2ql9wxhen32fxqzpnu8nshqemz4dlwss2gkyfl5y76zc8d2u9q7rzy6uwr9spfjxhc5"
    }
    */
    const response = await axios.get(zapEndpoint);
    if (!response.data || response.data.status !== "OK") {
      throw new NostrCallZapEndpointError(response);
    }

    const { pr, verify, successAction } = response.data;
    if (!pr) {
      throw new NostrInvoiceNotFoundError(response);
    }

    return {
      pr,
      verify,
      successAction,
    };
  }

  async #getZapInfo(metadata: Event) {
    let lnurl = "";
    let { lud16 } = JSON.parse(metadata.content);
    if (lud16) {
      let [name, domain] = lud16.split("@");
      lnurl = new URL(
        `/.well-known/lnurlp/${name}`,
        `https://${domain}`
      ).toString();
    } else {
      return null;
    }
    let res = await axios.get(lnurl);
    let body = await res.data;
    if (body.allowsNostr && body.nostrPubkey) {
      return body;
    }
  }

  async #getZapEndpointWithParams(
    unsignedEvent: UnsignedEvent,
    sig: string,
    lud16: string
  ) {
    const metadata: Event = {
      ...unsignedEvent,
      id: unsignedEvent.tags[4][1],
      kind: 0,
      sig,
      content: JSON.stringify({ lud16 }),
    };
    const zapInfo = await this.#getZapInfo(metadata).catch((e) => {
      throw new NostrGetZapInfoError(metadata, e);
    });
    const zapEndpoint = zapInfo.callback;
    if (!zapEndpoint) {
      throw new NostrGetZapEndpointCallbackUrlError(metadata, zapInfo);
    }
    const nostr = encodeURI(JSON.stringify(unsignedEvent));
    const amount = unsignedEvent.tags[1][1];
    if (zapEndpoint.minSendable && amount < zapEndpoint.minSendable) {
      throw new NostrMinSendableConstraintError(
        +amount,
        zapEndpoint.minSendable
      );
    }
    if (zapEndpoint.maxSendable && amount > zapEndpoint.maxSendable) {
      throw new NostrMaxSendableConstraintError(
        +amount,
        zapEndpoint.maxSendable
      );
    }
    const lnurl = unsignedEvent.tags[2][1];
    const url = new URL(zapEndpoint);
    url.searchParams.append("amount", amount);
    url.searchParams.append("nostr", nostr);
    url.searchParams.append("lnurl", lnurl);
    return url.toString();
  }

  async #makeZapRequest(nip05Id: string, msat: number): Promise<UnsignedEvent> {
    const to = await NDKUser.fromNip05(nip05Id, this.#ndk);
    if (!to) {
      throw new NostrUnknownUserError(nip05Id);
    }

    const unsignedEvent: UnsignedEvent = {
      kind: kinds.ZapRequest,
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
    const eventId = generateEventId(unsignedEvent);
    unsignedEvent.tags.push(["e", eventId]);
    return unsignedEvent;
  }
}
