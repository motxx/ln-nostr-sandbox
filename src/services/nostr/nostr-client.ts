import NDK, {
  NDKUser,
  NDKNip07Signer,
  NDKKind,
  NDKEvent,
  NDKRelaySet,
  NDKFilter,
  NostrEvent,
  NDKSigner,
} from "@nostr-dev-kit/ndk";
import { generateEventId, unixtime } from "./utils";
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
import { LnurlPay, toBech32EncodedLnurl, toLnurlPayUrl } from "./lnurl-pay";

export class NostrClient {
  #ndk: NDK;
  #user: NDKUser;
  #eventIdSet: Set<string>;
  #events: NDKEvent[] = [];

  private constructor(ndk: NDK, user: NDKUser) {
    this.#ndk = ndk;
    this.#user = user;
    this.#eventIdSet = new Set();
  }

  static readonly LoginTimeoutMSec = 60000;
  static readonly Relays = [
    ...CommonRelays.NIP50SearchCapabilityCompatibles,
    ...CommonRelays.JapaneseRelays,
    //...CommonRelays.Iris,
  ];
  static #nostrClient?: NostrClient;

  /**
   * Connect NostrClient by NIP-07 (window.nostr)
   * @returns singleton Promise<NostrClient>
   */
  static async connect(): Promise<NostrClient> {
    if (NostrClient.#nostrClient) {
      return NostrClient.#nostrClient;
    }

    const signer = new NDKNip07Signer(NostrClient.LoginTimeoutMSec);
    await signer.blockUntilReady();

    const ndk = new NDK({
      explicitRelayUrls: NostrClient.Relays,
      signer,
    });
    ndk.assertSigner();
    await ndk.connect(1);
    const user = await ndk.signer.user();
    NostrClient.#nostrClient = new NostrClient(ndk, user);
    return NostrClient.#nostrClient;
  }

  /**
   * Subscribe events specified by filters
   * @param onEvent listener of NDKEvent
   * @param filters NDKFilter
   */
  async subscribeEvents(
    filters: NDKFilter,
    onEvent: (event: NDKEvent) => void
  ) {
    const relaySet = NDKRelaySet.fromRelayUrls(NostrClient.Relays, this.#ndk);
    this.#ndk
      .subscribe(
        filters,
        {
          closeOnEose: false, // subscribe forever
        },
        relaySet,
        true
      )
      .on("event", (event: NDKEvent) => {
        if (this.#eventIdSet.has(event.id)) {
          return;
        }
        this.#eventIdSet.add(event.id);
        this.#events.push(event);
        this.#events.sort((a, b) => b.created_at - a.created_at);
        onEvent(event);
      });
  }

  /**
   * Get user
   * @returns NDKUser
   */
  async getUser() {
    return this.#user;
  }

  /**
   * Get user's hex pubkey
   * @returns pubkey
   */
  async getPublicKey() {
    return this.#user.pubkey;
  }

  /**
   * Get user's npub
   * @returns npub
   */
  async getNpub() {
    return this.#user.npub;
  }

  /**
   * Get user's lud16
   * @returns lud16 or undefined
   */
  async getLud16() {
    return this.#user.profile?.lud16;
  }

  async decryptEvent(event: NDKEvent) {
    await event.decrypt();
    return event;
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

  async #requestLnurlPay(metadata: NostrEvent): Promise<LnurlPay> {
    const { lud16 } = JSON.parse(metadata.content);
    const lnurlPayUrl = toLnurlPayUrl(lud16);
    const res = await axios.get(lnurlPayUrl);
    const body: LnurlPay = await res.data;
    if (!body.allowsNostr || !body.nostrPubkey) {
      throw new Error(`${lud16} doesn't support Nostr. body: ${body}`);
    }
    return body;
  }

  async #getZapEndpointWithParams(
    unsignedEvent: NostrEvent,
    sig: string,
    lud16: string
  ) {
    const metadata: NostrEvent = {
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

  async #makeZapRequest(nip05Id: string, msat: number): Promise<NostrEvent> {
    const to = await NDKUser.fromNip05(nip05Id, this.#ndk);
    if (!to) {
      throw new NostrUnknownUserError(nip05Id);
    }

    const unsignedEvent: NostrEvent = {
      kind: NDKKind.ZapRequest,
      pubkey: this.#user.pubkey,
      created_at: unixtime(),
      tags: [
        ["relays", ...NostrClient.Relays],
        ["amount", msat.toString()],
        ["lnurl", toBech32EncodedLnurl(toLnurlPayUrl(nip05Id)!)],
        ["p", to.pubkey],
      ],
      content: "zap request",
    };
    const eventId = generateEventId(unsignedEvent);
    unsignedEvent.tags.push(["e", eventId]);
    return unsignedEvent;
  }
}
