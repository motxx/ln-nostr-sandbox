export class Content {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly imageUrl: string,
    public readonly totalZappedAmount: number
  ) {}

  cloneWithZap(addedZap: number): Content {
    return new Content(
      this.id,
      this.title,
      this.description,
      this.imageUrl,
      this.totalZappedAmount + addedZap
    );
  }
}

export interface ContentRepository {
  fetchContents(userNpub: string): Promise<Content[]>;
  updateContents(userNpub: string, contents: Content[]): Promise<Content[]>;
}
