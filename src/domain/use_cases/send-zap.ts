import { WalletService } from "../../services/wallet-service";

export interface SendZapResponse {}

export class SendZap {
  constructor(private readonly walletService: WalletService) {}

  async execute(to: string, amount: number): Promise<SendZapResponse> {
    await this.walletService.sendPayment("");
    return {};
  }
}
