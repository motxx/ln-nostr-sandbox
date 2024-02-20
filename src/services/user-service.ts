import {
  User,
  UserRepository,
  UserSettings,
  UserSettingsRepository,
} from "../domain/entities/user";
import { UserStore } from "../infrastructure/storage/user-store";
import { NostrClient } from "./nostr/nostr-client";
import {
  UserFailedToGetSettingsError,
  UserFailedToLoginError,
  UserFailedToUpdateSettingsError,
} from "./error";

export interface SendZapRequestResponse {
  pr: string;
  verify: string;
  successAction?: {
    tag: string;
    message?: string;
  };
}

export class UserService implements UserRepository, UserSettingsRepository {
  #nostrClient: NostrClient;
  #userStore: UserStore;

  async login(): Promise<User> {
    this.#nostrClient = await NostrClient.connect().catch((error) => {
      throw new UserFailedToLoginError(error);
    });
    const npub = await this.#nostrClient.getNpub();
    const pubkey = await this.#nostrClient.getPublicKey();
    this.#userStore = new UserStore(npub);
    const settings = await this.fetchUserSettings(npub);
    return new User(npub, pubkey, "nostr", settings);
  }

  async fetch(): Promise<User> {
    const npub = await this.#nostrClient.getNpub();
    const pubkey = await this.#nostrClient.getPublicKey();
    const settings = await this.fetchUserSettings(npub);
    return new User(npub, pubkey, "nostr", settings);
  }

  async fetchUserSettings(npub: string): Promise<UserSettings> {
    let settings = new UserSettings("", "", 1);
    try {
      const s = this.#userStore.get(npub);
      if (s !== null) {
        settings = s as UserSettings;
      }
    } catch (error) {
      throw new UserFailedToGetSettingsError(error);
    }
    return settings;
  }

  async updateSettings(
    npub: string,
    settings: UserSettings
  ): Promise<UserSettings> {
    try {
      this.#userStore.set(npub, settings);
    } catch (error) {
      throw new UserFailedToUpdateSettingsError(error);
    }
    return settings;
  }

  async sendZapRequest(
    nip05Id: string,
    sats: number
  ): Promise<SendZapRequestResponse> {
    return this.#nostrClient.sendZapRequest(nip05Id, sats);
  }
}
