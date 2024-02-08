import { Content, ContentRepository } from "../domain/entities/content";
import { ContentStore } from "../infrastructure/storage/content-store";
import { ContentFailedToGetError, ContentFailedToUpdateError } from "./error";

export class ContentService implements ContentRepository {
  #contentStore: ContentStore;

  async fetchContents(userNpub: string): Promise<Content[]> {
    let contents: Content[] = [];
    try {
      const cs = this.#contentStore.get(userNpub);
      if (cs.length) {
        contents = cs as Content[];
      }
    } catch (error) {
      const contents = [
        new Content(
          "id1",
          "Image 1",
          "Example Description",
          "https://via.placeholder.com/150",
          0
        ),
        new Content(
          "id2",
          "Image 2",
          "Example Description",
          "https://via.placeholder.com/150",
          0
        ),
        new Content(
          "id3",
          "Image 3",
          "Example Description",
          "https://via.placeholder.com/150",
          0
        ),
      ];
      return contents;
      // throw new ContentFailedToGetError(error);
    }
    return contents;
  }

  async updateContents(
    userNpub: string,
    contents: Content[]
  ): Promise<Content[]> {
    try {
      this.#contentStore.set(userNpub, contents);
    } catch (error) {
      throw new ContentFailedToUpdateError(error);
    }
    return contents;
  }
}
