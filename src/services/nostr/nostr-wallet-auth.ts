import { UserFailedToLoginError } from "../error";
import { NostrClient } from "./nostr-client";

/*
 * NIP-67: Nostr Wallet Auth
 * Generates connectionURI for NIP-47 Nostr Wallet Connect.
 */
export class NostrWalletAuth {
  #nostrClient: NostrClient;

  static readonly CLIENT_PROFILE_NPUB =
    import.meta.env.VITE_NOSTR_CLIENT_PROFILE_NPUB || "";

  private constructor(nostrClient: NostrClient) {
    this.#nostrClient = nostrClient;
  }

  static async connect(): Promise<NostrWalletAuth> {
    const nostrClient = await NostrClient.connect().catch((error) => {
      throw new UserFailedToLoginError(error);
    });
    return new NostrWalletAuth(nostrClient);
  }

  async generateAuthUri() {
    const pubkey = await this.#nostrClient.getPublicKey();
    const url = new URL(`nostr+walletauth://${pubkey}`);
    for (const relay of NostrClient.RELAYS) {
      url.searchParams.append("relay", relay);
    }
    const genRndHex = (size: number) =>
      [...Array(size)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
    url.searchParams.append("secret", genRndHex(32));
    url.searchParams.append(
      "required_commands",
      encodeURIComponent(
        "pay_invoice"
        // not supported yet
        // ["pay_invoice", "pay_keysend", "make_invoice", "lookup_invoice"].join(" ")
      )
    );
    // not supported yet
    // url.searchParams.append("optional_commands", "list_transactions");
    url.searchParams.append("budget", "10000/daily");
    url.searchParams.append("identity", NostrWalletAuth.CLIENT_PROFILE_NPUB);
    const connectionUri = url.toString().replace(/%2520/g, "%20");
    console.log({ connectionUri });
    return connectionUri;
  }
}
