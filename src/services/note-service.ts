import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import {
  Note,
  NoteRepository,
  SubscribeTimelineOptions,
} from "../domain/entities/note";
import { unixtime, unixtimeOf, yesterday } from "./nostr/utils";
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
        since: unixtimeOf(options?.since ?? yesterday()),
      },
      (event: NDKEvent) =>
        onNote(
          new Note(
            event.id,
            event.content,
            "https://via.placeholder.com/150",
            0
          )
        )
    );
  }

  async subscribeZaps(onEvent: (event: NDKEvent) => void) {
    if (!this.#nostrClient) {
      await this.connect();
    }

    await this.#nostrClient.subscribeEvents(
      {
        kinds: [NDKKind.Zap],
        since: unixtime(),
      },
      onEvent
    );
  }
}
