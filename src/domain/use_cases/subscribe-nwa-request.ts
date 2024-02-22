import { UserSettingsRepository } from "../entities/user";

export class SubscribeNWARequest {
  constructor(private userSettingsRepository: UserSettingsRepository) {}

  async execute(onNWARequest: (connectionUri: string) => void) {
    this.userSettingsRepository.subscribeNWARequest(onNWARequest);
  }
}
