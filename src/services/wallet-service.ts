import { NostrWalletConnect } from "../infrastructure/network/nostr/nostr-wallet-connect";
import { WalletNotInitializedError } from "./error";

export class WalletService {
  #nwc?: NostrWalletConnect;

  async connect(connectionUri: string) {
    const nwc = await NostrWalletConnect.connect(connectionUri);
    this.#nwc = nwc;
  }

  async sendPayment(bolt11Invoice: string) {
    if (!this.#nwc) {
      throw new WalletNotInitializedError();
    }
    return this.#nwc.sendPayment(bolt11Invoice);
  }

  async zap(amount: number) {
    if (!this.#nwc) {
      throw new WalletNotInitializedError();
    }
    this.#nwc;
    return this.#nwc.sendPayment("");
  }
}
