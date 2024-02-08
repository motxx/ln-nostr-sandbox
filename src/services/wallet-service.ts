import { NostrWalletConnect } from "../infrastructure/network/nostr/nostr-wallet-connect";
import { WalletNotConnectedError } from "./error";

export class WalletService {
  #walletConnect?: NostrWalletConnect;

  async connect(connectionUri: string) {
    const nwc = await NostrWalletConnect.connect(connectionUri);
    this.#walletConnect = nwc;
  }

  async sendPayment(bolt11Invoice: string) {
    if (!this.#walletConnect) {
      throw new WalletNotConnectedError();
    }
    return this.#walletConnect.sendPayment(bolt11Invoice);
  }
}
