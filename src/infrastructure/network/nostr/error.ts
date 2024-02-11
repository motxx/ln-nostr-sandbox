export class NostrNoWindowNostrError extends Error {
  constructor() {
    super("No window.nostr(NIP-07) found.");
  }
}

export class NostrNWCNotInitializedError extends Error {
  constructor() {
    super("nwc is not initialized.");
  }
}

export class NostrUnknownUserError extends Error {
  constructor(userAddress: string) {
    super(`Unknown user. userAddress:${userAddress}`);
  }
}
