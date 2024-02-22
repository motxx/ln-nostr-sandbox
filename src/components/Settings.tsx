import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { User } from '../domain/entities/user';
import { BudgetPeriod, GenerateWalletAuthUri } from '../domain/use_cases/generate-wallet-auth-uri';
import { UpdateMyUserSettings } from '../domain/use_cases/update-my-user-settings';
import { UserService } from '../services/user-service';
import { WalletService } from '../services/wallet-service';
import { SubscribeNWARequest } from '../domain/use_cases/subscribe-nwa-request';
import BudgetPeriodSelector from './BudgetPeriodSelector';

interface SettingsProps {
  user?: User;
  userService: UserService;
  walletService: WalletService,
  handleSettingsApplied: (user: User) => void;
}

const Settings: React.FC<SettingsProps> = (props) => {
  const [connectionUri, setConnectionUri] = useState(props.user?.settings.connectionUri || '');
  const [walletAuthUri, setWalletAuthUri] = useState(props.user?.settings.walletAuthUri || '');
  const [budget, setBudget] = useState(100);
  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod>('daily');
  const [zapAmount, setZapAmount] = useState(props.user?.settings.zapAmount || 1);
  const navigate = useNavigate();

  useEffect(() => {
    new SubscribeNWARequest(props.userService).execute((connectionUri) => {
      setConnectionUri(connectionUri);
    });
  });

  const handleSelectPeriod = (period: BudgetPeriod) => {
    setSelectedPeriod(period);
  };

  const handleGenerateWalletAuthUri = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uri = await new GenerateWalletAuthUri(props.walletService).execute(budget, selectedPeriod);
    setWalletAuthUri(uri);
  };

  const handleSubmitConnectionUri = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = props.user!;
    const newSettings = await new UpdateMyUserSettings(props.userService, props.userService).execute({
      ...user.settings,
      connectionUri,
      zapAmount,
    });
    props.handleSettingsApplied(new User(user.npub, user.pubkey, user.username, newSettings));
    navigate('/'); // Redirect to home or another page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Settings</h1>
      {props.user ? (
        <div>
          <form onSubmit={handleGenerateWalletAuthUri} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nostr Wallet Auth
              </label>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget">
                  Budget
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="budget"
                  type="number"
                  placeholder="100"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                />
                <BudgetPeriodSelector selectedPeriod={selectedPeriod} onSelectPeriod={handleSelectPeriod} />
              </div>
              <div className="mb-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
                  type="submit">
                  Generate NWA QR code
                </button>
              </div>
              {walletAuthUri && (
                <QRCodeSVG value={walletAuthUri} size={300}/>
              )}
            </div>
          </form>
          <form onSubmit={handleSubmitConnectionUri} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="uri">
                Nostr Wallet Connect - Connection URI
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="uri"
                type="text"
                placeholder="nostr+walletconnect://"
                value={connectionUri}
                onChange={(e) => setConnectionUri(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zap-amount">
                Default Zap Amount
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="zap-amount"
                type="number"
                placeholder="39"
                value={zapAmount}
                onChange={(e) => setZapAmount(parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit">
                Apply
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p>Please login to access settings</p>
      )}
    </div>
  );
};

export default Settings;
