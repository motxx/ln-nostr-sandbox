import { NostrClient } from "./nostr/nostr-client";
import { NostrWalletConnect } from "./nostr/nostr-wallet-connect";
import { UserFailedToLoginError, WalletNotInitializedError } from "./error";

export interface SendPaymentResponse {
  preimage: string;
}

export class WalletService {
  #nostrClient?: NostrClient;
  #nwc?: NostrWalletConnect;

  async connect(connectionUri: string) {
    if (this.#nwc) {
      return;
    }
    const nwc = await NostrWalletConnect.connect(connectionUri);
    this.#nwc = nwc;
  }

  async connectNwa(zapAmount: number): Promise<string> {
    this.#nostrClient = await NostrClient.connect().catch((error) => {
      throw new UserFailedToLoginError(error);
    });
    const pubkey = await this.#nostrClient.getPublicKey();
    const url = new URL(`nostr+walletauth://${pubkey}`);
    //for (const relay of NostrClient.RELAYS) {
    //  url.searchParams.append("relay", relay);
    //}
    url.searchParams.append("relay", NostrClient.RELAYS[0]);
    const genRndHex = (size: number) =>
      [...Array(size)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
    url.searchParams.append("secret", genRndHex(32));
    url.searchParams.append(
      "required_commands",
      encodeURIComponent(
        ["pay_invoice", "pay_keysend", "make_invoice", "lookup_invoice"].join(
          " "
        )
      )
    );
    url.searchParams.append("optional_commands", "list_transactions");
    url.searchParams.append("budget", "10000/daily");
    return url.toString().replace(/%2520/g, "%20");
  }

  async sendPayment(bolt11Invoice: string): Promise<SendPaymentResponse> {
    if (!this.#nwc) {
      throw new WalletNotInitializedError();
    }
    return this.#nwc.sendPayment(bolt11Invoice);
  }
}
