import { NostrWalletConnect } from "../infrastructure/network/nostr/nostr-wallet-connect";
import { WalletNotInitializedError } from "./error";

export interface SendPaymentResponse {
  preimage: string;
}

export class WalletService {
  #nwc?: NostrWalletConnect;

  async connect(connectionUri: string) {
    if (this.#nwc) {
      return;
    }
    const nwc = await NostrWalletConnect.connect(connectionUri);
    this.#nwc = nwc;
  }

  async sendPayment(bolt11Invoice: string): Promise<SendPaymentResponse> {
    if (!this.#nwc) {
      throw new WalletNotInitializedError();
    }
    return this.#nwc.sendPayment(bolt11Invoice);
  }
}
