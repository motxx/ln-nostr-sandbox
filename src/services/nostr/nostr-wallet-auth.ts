import { UserFailedToLoginError } from "../error";
import { SendPaymentResponse } from "../wallet-service";
import { NostrClient } from "./nostr-client";

export class NostrWalletAuth {
  #nostrClient: NostrClient;

  private constructor(nostrClient: NostrClient) {
    this.#nostrClient = nostrClient;
  }

  static async connect(): Promise<NostrWalletAuth> {
    const nostrClient = await NostrClient.connect().catch((error) => {
      throw new UserFailedToLoginError(error);
    });
    return new NostrWalletAuth(nostrClient);
  }

  async generateConnectionUri() {
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
        "pay_invoice"
        /*
        ["pay_invoice", "pay_keysend", "make_invoice", "lookup_invoice"].join(
          " "
        )
        */
      )
    );
    // not supported yet
    // url.searchParams.append("optional_commands", "list_transactions");
    url.searchParams.append("budget", "10000/daily");
    const connectionUri = url.toString().replace(/%2520/g, "%20");
    console.log({ connectionUri });
    return connectionUri;
  }

  async sendPayment(bolt11Invoice: string): Promise<SendPaymentResponse> {
    //    const response = await this.nwa.sendPayment(bolt11Invoice);
    return { preimage: "" };
  }
}
