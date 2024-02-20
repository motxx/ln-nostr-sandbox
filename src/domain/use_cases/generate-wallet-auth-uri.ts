import { WalletService } from "../../services/wallet-service";

export class GenerateWalletAuthUri {
  constructor(private readonly walletService: WalletService) {}

  async execute(zapAmount: number): Promise<string> {
    await this.walletService.connectNwa();
    const uri = await this.walletService.generateAuthUri();
    console.log({ uri });
    return uri;
  }
}
