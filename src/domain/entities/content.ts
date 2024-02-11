export class Content {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly imageUrl: string,
    public readonly totalZappedAmount: number
  ) {}

  static copyWithZap(content: Content, addedZap: number): Content {
    return new Content(
      content.id,
      content.title,
      content.description,
      content.imageUrl,
      content.totalZappedAmount + addedZap
    );
  }
}

export interface ContentRepository {
  fetchContents(userNpub: string): Promise<Content[]>;
  updateContents(userNpub: string, contents: Content[]): Promise<Content[]>;
}
