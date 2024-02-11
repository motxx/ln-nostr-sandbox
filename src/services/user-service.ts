import {
  User,
  UserRepository,
  UserSettings,
  UserSettingsRepository,
} from "../domain/entities/user";
import { NostrClient } from "../infrastructure/network/nostr/nostr-client";
import { UserStore } from "../infrastructure/storage/user-store";
import {
  UserFailedToGetSettingsError,
  UserFailedToLoginError,
  UserFailedToUpdateSettingsError,
} from "./error";

export interface GetZapInvoiceResponse {
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
    this.#userStore = new UserStore(npub);
    const settings = await this.fetchUserSettings(npub);
    return new User(npub, "nostr", settings);
  }

  async fetch(): Promise<User> {
    const npub = await this.#nostrClient.getNpub();
    const settings = await this.fetchUserSettings(npub);
    return new User(npub, "nostr", settings);
  }

  async fetchUserSettings(npub: string): Promise<UserSettings> {
    let settings = new UserSettings("", 1);
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

  async getZapInvoice(
    nip05Id: string,
    sats: number
  ): Promise<GetZapInvoiceResponse> {
    return this.#nostrClient.signAndGetZapInvoice(nip05Id, sats);
  }
}
