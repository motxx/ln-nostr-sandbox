import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { User } from '../domain/entities/user';
import { GenerateWalletAuthUri } from '../domain/use_cases/generate-wallet-auth-uri';
import { UpdateMyUserSettings } from '../domain/use_cases/update-my-user-settings';
import { UserService } from '../services/user-service';
import { WalletService } from '../services/wallet-service';

interface SettingsProps {
  user?: User;
  userService: UserService;
  walletService: WalletService,
  handleSettingsApplied: (user: User) => void;
}

const Settings: React.FC<SettingsProps> = (props) => {
  const [connectionUri, setConnectionUri] = useState(props.user?.settings.connectionUri || '');
  const [walletAuthUri, setWalletAuthUri] = useState(props.user?.settings.walletAuthUri || '');
  const [zapAmount, setZapAmount] = useState(props.user?.settings.zapAmount || 1);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uri = await new GenerateWalletAuthUri(props.walletService).execute(zapAmount);
    setWalletAuthUri(uri);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Settings</h1>
      {props.user ? (
        <div>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="uri">
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
          <form onSubmit={handleGenerate} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="uri">
                Nostr Wallet Auth
              </label>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="uri">
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
              <div className="mb-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
                  type="submit">
                  Generate
                </button>
              </div>
              {walletAuthUri && (
                <QRCodeSVG value={walletAuthUri} size={300}/>
              )}
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
