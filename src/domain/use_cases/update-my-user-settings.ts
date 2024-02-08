import {
  UserRepository,
  UserSettings,
  UserSettingsRepository,
} from "../entities/user";

export class UpdateMyUserSettings {
  constructor(
    private userRepository: UserRepository,
    private userSettingsRepository: UserSettingsRepository
  ) {}

  async execute(settings: UserSettings): Promise<UserSettings> {
    const user = await this.userRepository.fetch();
    return this.userSettingsRepository.updateSettings(user.npub, settings);
  }
}
