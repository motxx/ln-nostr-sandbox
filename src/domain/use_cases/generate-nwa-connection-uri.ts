import { WalletService } from "../../services/wallet-service";

export class GenerateNWAConnectionURI {
  constructor(private readonly walletService: WalletService) {}

  async execute(zapAmount: number): Promise<string> {
    await this.walletService.connectNwa();
    const url = await this.walletService.generateNwaConnectionUri();
    console.log({ url });
    return url;
  }
}
