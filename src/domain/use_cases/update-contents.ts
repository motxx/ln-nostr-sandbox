import { Content, ContentRepository } from "../entities/content";

export class UpdateContents {
  constructor(private contentRepository: ContentRepository) {}

  async execute(userNpub: string, contents: Content[]): Promise<Content[]> {
    return this.contentRepository.updateContents(userNpub, contents);
  }
}
