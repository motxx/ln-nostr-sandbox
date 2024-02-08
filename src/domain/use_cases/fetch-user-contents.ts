import { Content, ContentRepository } from "../entities/content";

export class FetchUserContents {
  constructor(private contentRepository: ContentRepository) {}

  async execute(userNpub: string): Promise<Content[]> {
    return this.contentRepository.fetchContents(userNpub);
  }
}
