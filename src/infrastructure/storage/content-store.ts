export class ContentStore {
  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  set(userNpub: string, values: any[]) {
    this.storage.setItem(this.#getFullKey(userNpub), JSON.stringify(values));
  }

  get(userNpub: string) {
    const result = this.storage.getItem(this.#getFullKey(userNpub));
    return result ? (JSON.parse(result) as any[]) : [];
  }

  remove(userNpub: string, contentId: string) {
    this.storage.removeItem(this.#getFullKey(userNpub));
  }

  #getFullKey(userNpub: string) {
    return `contents:${userNpub}`;
  }
}
