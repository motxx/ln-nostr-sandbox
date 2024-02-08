import { webln } from "@getalby/sdk";

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

  async sendPayment(bolt11Invoice: string) {
    const response = await this.nwc.sendPayment(bolt11Invoice);
    return response.preimage;
  }
}
