import { NostrNoWindowNostrError } from "./error";
import { NostrAPI } from "./nostr";
import { pubkeyToNpub } from "./utils";

export class NostrClient {
  #nostr: NostrAPI;

  private constructor(nostr: NostrAPI) {
    this.#nostr = nostr;
  }

  static async connect(): Promise<NostrClient> {
    if (!window.nostr) {
      throw new NostrNoWindowNostrError();
    }
    return new NostrClient(window.nostr!);
  }

  async getPublicKey() {
    return this.#nostr.getPublicKey();
  }

  async getNpub() {
    return pubkeyToNpub(await this.getPublicKey());
  }
}
