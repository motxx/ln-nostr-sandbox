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

export class NostrGetZapInfoError extends Error {
  constructor(metadata: any, details: Error) {
    super(
      `Failed to get zap info. metadata:${JSON.stringify(metadata)} details:${details}`
    );
  }
}

export class NostrGetZapEndpointCallbackUrlError extends Error {
  constructor(metadata: any, zapInfo: any) {
    super(
      `Failed to get zap endpoint callback url. metadata:${JSON.stringify(metadata)} zapInfo:${JSON.stringify(zapInfo)}`
    );
  }
}

export class NostrMinSendableConstraintError extends Error {
  constructor(amount: number, minSendable: number) {
    super(`Amount too small. amount:${amount} minSendable:${minSendable}`);
  }
}

export class NostrMaxSendableConstraintError extends Error {
  constructor(amount: number, maxSendable: number) {
    super(`Amount too large. amount:${amount} maxSendable:${maxSendable}`);
  }
}

export class NostrCallZapEndpointError extends Error {
  constructor(response: any) {
    super(`Failed to call zap endpoint. response:${JSON.stringify(response)}`);
  }
}

export class NostrInvoiceNotFoundError extends Error {
  constructor(response: any) {
    super(`Invoice not found. response:${JSON.stringify(response)}`);
  }
}
