import { User, UserRepository } from "../entities/user";

export class LoginMyUser {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User> {
    const user = await this.userRepository.login();
    const settings = await this.userRepository.fetchUserSettings(user.npub);
    return new User(
      user.npub,
      user.pubkey,
      user.username,
      user.image,
      settings
    );
  }
}
