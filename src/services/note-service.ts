import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import {
  Note,
  NoteRepository,
  SubscribeTimelineOptions,
} from "../domain/entities/note";
import { unixtimeOf } from "./nostr/utils";
import { NostrClient } from "./nostr/nostr-client";

export class NoteService implements NoteRepository {
  #nostrClient: NostrClient;

  async connect() {
    if (!this.#nostrClient) {
      this.#nostrClient = await NostrClient.connect();
    }
  }

  async postNote(note: Note): Promise<void> {
    if (!this.#nostrClient) {
      await this.connect();
    }

    throw new Error("Method not implemented.");
  }

  async subscribeTimeline(
    onNote: (note: Note) => void,
    options?: SubscribeTimelineOptions
  ) {
    if (!this.#nostrClient) {
      await this.connect();
    }

    const user = await this.#nostrClient.getUser();
    const follows = await user.follows();
    await this.#nostrClient.subscribeEvents(
      {
        kinds: [NDKKind.Text],
        authors: Array.from(follows.values()).map((a) => a.pubkey),
        since: options?.since ? unixtimeOf(options.since!) : undefined,
        limit: options?.limit ?? 20,
        // NIP-50: Search Capability - https://scrapbox.io/nostr/NIP-50
        // search文字列の仕様はRelayer依存
        search: "https?.+\\.png",
      },
      (event: NDKEvent) => {
        const imageUrls = event.content.match(/(https?.+\.png)/);
        onNote(
          new Note(
            event.id,
            event.content,
            imageUrls ? imageUrls[0] : "https://via.placeholder.com/150",
            0
          )
        );
      }
    );
  }

  async subscribeZaps(onZapEvent: (event: NDKEvent) => void) {
    if (!this.#nostrClient) {
      await this.connect();
    }

    throw new Error("Method not implemented.");
  }
}
