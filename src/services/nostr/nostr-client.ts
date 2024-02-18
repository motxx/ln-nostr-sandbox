import { Event, UnsignedEvent } from "nostr-tools";
import NDK, {
  NDKUser,
  NDKNip07Signer,
  NDKKind,
  NDKRelaySet,
  NDKRelay,
} from "@nostr-dev-kit/ndk";
import {
  generateEventId,
  toLnurlPayStaticEndpoint,
  toLnurlPayUrl,
  unixtime,
} from "./utils";
import {
  NostrCallZapEndpointError,
  NostrGetZapEndpointCallbackUrlError,
  NostrInvoiceNotFoundError,
  NostrMaxSendableConstraintError,
  NostrMinSendableConstraintError,
  NostrRequestLnurlPayError,
  NostrUnknownUserError,
} from "./error";
import axios from "axios";
import { SendZapRequestResponse } from "../user-service";
import { CommonRelays } from "./common-relays";

export type LnurlPay = {
  allowsNostr?: boolean;
  nostrPubkey?: string;
  callback?: string;
  minSendable?: number;
  maxSendable?: number;
  [key: string]: any;
};

export class NostrClient {
  #ndk: NDK;
  #user: NDKUser;

  private constructor(ndk: NDK, user: NDKUser) {
    this.#ndk = ndk;
    this.#user = user;
  }

  static readonly LoginTimeoutMSec = 60000;
  static readonly Relays = CommonRelays.Iris;

  static async connect(): Promise<NostrClient> {
    const signer = new NDKNip07Signer(NostrClient.LoginTimeoutMSec);
    const user = await signer.blockUntilReady();
    const ndk = new NDK({
      explicitRelayUrls: NostrClient.Relays,
      signer,
    });
    ndk.assertSigner();

    await ndk.connect().catch((e) => {
      console.log("Failed to connect to relay", e);
    });

    //const bitcoinMagazine = "npub1jfn4ghffz7uq7urllk6y4rle0yvz26800w4qfmn4dv0sr48rdz9qyzt047";
    const relaySet = new NDKRelaySet(new Set(), ndk);
    for (const relay of NostrClient.Relays) {
      relaySet.addRelay(new NDKRelay(relay));
    }

    const subscription = ndk.subscribe(
      {
        kinds: [
          0,
          1,
          4,
          NDKKind.Zap,
          NDKKind.ZapRequest,
          NDKKind.NWCInfoEvent,
          NDKKind.NWCRequest,
          NDKKind.NWCResponse,
        ],
        authors: [user.pubkey],
      },
      { closeOnEose: true },
      relaySet,
      true
    );
    subscription.on("request", (event) => {
      console.log(`request: ${event.id}`);
    });
    subscription.on("event", (event) => {
      console.log("event", event);
    });
    subscription.on("eose", () => console.log(`eose`));
    return new NostrClient(ndk, user);
  }

  async getPublicKey() {
    return this.#user.pubkey;
  }

  async getNpub() {
    return this.#user.npub;
  }

  /**
   * Query zap invoice from NIP-05 identifier
   * NIP-57 Lightning Zaps: https://scrapbox.io/nostr/NIP-57
   * @param nip05Id
   * @param sat
   * @returns SendZapRequestResponse
   */
  async sendZapRequest(
    nip05Id: string,
    sat: number
  ): Promise<SendZapRequestResponse> {
    const millisats = sat * 1000;
    const unsignedEvent = await this.#makeZapRequest(nip05Id, millisats);
    const sig = await this.#ndk.signer!.sign(unsignedEvent);

    const zapEndpoint = await this.#getZapEndpointWithParams(
      unsignedEvent,
      sig,
      nip05Id
    );

    // Do not publish. Send the request to zap endpoint.
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

  async #requestLnurlPay(metadata: Event): Promise<LnurlPay> {
    const { lud16 } = JSON.parse(metadata.content);
    const lnurl = toLnurlPayStaticEndpoint(lud16);
    const res = await axios.get(lnurl);
    const body: LnurlPay = await res.data;
    if (!body.allowsNostr || !body.nostrPubkey) {
      throw new Error(`${lud16} doesn't support Nostr. body: ${body}`);
    }
    return body;
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
    const lnurlPay = await this.#requestLnurlPay(metadata).catch((e) => {
      throw new NostrRequestLnurlPayError(metadata, e);
    });
    const callbackUrl = lnurlPay.callback;
    if (!callbackUrl) {
      throw new NostrGetZapEndpointCallbackUrlError(metadata, lnurlPay);
    }
    const nostr = encodeURI(JSON.stringify(unsignedEvent));
    const amount = +unsignedEvent.tags[1][1];
    if (lnurlPay.minSendable && amount < lnurlPay.minSendable) {
      throw new NostrMinSendableConstraintError(amount, lnurlPay.minSendable);
    }
    if (lnurlPay.maxSendable && amount > lnurlPay.maxSendable) {
      throw new NostrMaxSendableConstraintError(amount, lnurlPay.maxSendable);
    }
    const lnurl = unsignedEvent.tags[2][1];
    const zapEndpoint = new URL(callbackUrl);
    zapEndpoint.searchParams.append("amount", amount.toString());
    zapEndpoint.searchParams.append("nostr", nostr);
    zapEndpoint.searchParams.append("lnurl", lnurl);
    return zapEndpoint.toString();
  }

  async #makeZapRequest(nip05Id: string, msat: number): Promise<UnsignedEvent> {
    const to = await NDKUser.fromNip05(nip05Id, this.#ndk);
    if (!to) {
      throw new NostrUnknownUserError(nip05Id);
    }

    const unsignedEvent: UnsignedEvent = {
      kind: NDKKind.ZapRequest,
      pubkey: this.#user.pubkey,
      created_at: unixtime(),
      tags: [
        ["relays", ...NostrClient.Relays],
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
