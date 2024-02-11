import { webln } from "@getalby/sdk";
import { SendPaymentResponse } from "../../../services/wallet-service";

export class NostrWalletConnect {
  private constructor(private nwc: webln.NostrWebLNProvider) {}

  static async connect(walletConnectUrl: string): Promise<NostrWalletConnect> {
    const nwc = new webln.NostrWebLNProvider({
      nostrWalletConnectUrl: walletConnectUrl, // nostr+walletconnect://<pubkey>?relay=<relay-url>&secret=<secret>[&lud16=<lud16>]
    });
    await nwc.enable();
    return new NostrWalletConnect(nwc);
  }

  disconnect() {
    this.nwc.close();
  }

  async sendPayment(bolt11Invoice: string): Promise<SendPaymentResponse> {
    const response = await this.nwc.sendPayment(bolt11Invoice);
    return { preimage: response.preimage };
  }
}
