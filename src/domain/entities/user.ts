export class User {
  constructor(
    public readonly npub: string,
    public readonly pubkey: string,
    public readonly username: string,
    public readonly settings: UserSettings
  ) {}
}

export class UserSettings {
  constructor(
    public readonly connectionUri: string,
    public readonly walletAuthUri: string,
    public zapAmount: number
  ) {}
}

export interface UserRepository {
  login(): Promise<User>;
  fetch(): Promise<User>;
  fetchUserSettings(userNpub: string): Promise<UserSettings>;
}

export interface UserSettingsRepository {
  updateSettings(npub: string, settings: UserSettings): Promise<UserSettings>;
}
