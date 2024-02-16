import { NostrClient } from "./nostr/nostr-client";
import { NostrWalletConnect } from "./nostr/nostr-wallet-connect";
import { UserFailedToLoginError, WalletNotInitializedError } from "./error";
import { NostrWalletAuth } from "./nostr/nostr-wallet-auth";

export interface SendPaymentResponse {
  preimage: string;
}

export class WalletService {
  #nwc?: NostrWalletConnect;
  #nwa?: NostrWalletAuth;

  async connect(connectionUri: string) {
    if (this.#nwc) {
      return;
    }
    const nwc = await NostrWalletConnect.connect(connectionUri);
    this.#nwc = nwc;
  }

  async connectNwa() {
    if (this.#nwa) {
      return;
    }
    const nwa = await NostrWalletAuth.connect();
    this.#nwa = nwa;
  }

  async generateNwaConnectionUri() {
    if (this.#nwa) {
      return this.#nwa.generateConnectionUri();
    }
    throw new WalletNotInitializedError();
  }

  async sendPayment(bolt11Invoice: string): Promise<SendPaymentResponse> {
    if (this.#nwc) {
      return this.#nwc.sendPayment(bolt11Invoice);
    } else if (this.#nwa) {
      return this.#nwa.sendPayment(bolt11Invoice);
    }
    throw new WalletNotInitializedError();
  }
}
