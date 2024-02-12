import { WalletService } from "../../services/wallet-service";

export class GenerateNWAConnectionURI {
  constructor(private readonly walletService: WalletService) {}

  async execute(zapAmount: number): Promise<string> {
    const url = await this.walletService.connectNwa(zapAmount);
    console.log({ url });
    return url;
  }
}
