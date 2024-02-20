import { NostrWalletConnect } from "./nostr/nostr-wallet-connect";
import { WalletNotInitializedError } from "./error";
import { NostrWalletAuth } from "./nostr/nostr-wallet-auth";

export interface SendPaymentResponse {
  preimage: string;
}

export class WalletService {
  #nwa?: NostrWalletAuth;
  #nwc?: NostrWalletConnect;

  async connectNwa() {
    if (this.#nwa) {
      return;
    }
    const nwa = await NostrWalletAuth.connect();
    this.#nwa = nwa;
  }

  async generateAuthUri() {
    if (this.#nwa) {
      return this.#nwa.generateAuthUri();
    }
    throw new WalletNotInitializedError();
  }

  async connectNwc(connectionUri: string) {
    if (this.#nwc) {
      return;
    }
    const nwc = await NostrWalletConnect.connect(connectionUri);
    this.#nwc = nwc;
  }

  async sendPayment(invoice: string): Promise<SendPaymentResponse> {
    if (!this.#nwc) {
      throw new WalletNotInitializedError();
    }
    return this.#nwc.sendPayment(invoice);
  }
}
