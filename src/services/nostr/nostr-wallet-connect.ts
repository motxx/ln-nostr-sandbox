import { webln } from "@getalby/sdk";
import { SendPaymentResponse } from "../wallet-service";

export class NostrWalletConnect {
  private constructor(private nwc: webln.NostrWebLNProvider) {}

  /**
   * Connect to the wallet service which supports NostrWalletConnect
   * @param connectionUri nostr+walletconnect://<pubkey>?relay=<relay-url>&secret=<secret>[&lud16=<lud16>]
   * @returns Promise<NostrWalletConnect>
   */
  static async connect(connectionUri: string): Promise<NostrWalletConnect> {
    const nwc = new webln.NostrWebLNProvider({
      nostrWalletConnectUrl: connectionUri,
    });
    await nwc.enable();
    return new NostrWalletConnect(nwc);
  }

  disconnect() {
    this.nwc.close();
  }

  /**
   * Send payment to the invoice
   * @param invoice
   * @returns Promise<SendPaymentResponse>
   */
  async sendPayment(invoice: string): Promise<SendPaymentResponse> {
    const response = await this.nwc.sendPayment(invoice);
    return { preimage: response.preimage };
  }
}
