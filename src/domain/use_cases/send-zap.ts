import { UserService } from "../../services/user-service";
import { WalletService } from "../../services/wallet-service";

export interface SendZapResponse {}

export class SendZap {
  constructor(
    private readonly walletService: WalletService,
    private userService: UserService
  ) {}

  /**
   * Execute send zap
   * @param to NIP-05 identifier
   * @param amount amount to zap
   * @returns
   */
  async execute(to: string, amount: number): Promise<SendZapResponse> {
    await this.userService.zap(to, amount);
    return {};
  }
}
