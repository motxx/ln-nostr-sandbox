import React, { useState } from 'react';
import { ContentService } from '../services/content-service';
import { UserService } from '../services/user-service';
import { WalletService } from '../services/wallet-service';
import { SendZap } from '../domain/use_cases/send-zap';
import { FetchUserContents } from '../domain/use_cases/fetch-user-contents';
import { UpdateContents } from '../domain/use_cases/update-contents';
import { Content } from '../domain/entities/content';

export interface ImageCardProps {
  contentId: string;
  title: string;
  imageUrl: string;
  userService: UserService;
  contentService: ContentService;
  walletService: WalletService;
}

const ImageCard: React.FC<ImageCardProps> = (props) => {
  const [zaps, setZaps] = useState(0);

  const handleZap = async () => {
    const user = await props.userService.fetch();
    const zapAmount = user.settings.zapAmount;
    const sendZapResponse = await new SendZap(props.walletService).execute("", zapAmount);
    const userNpub = user.npub; // temporarily send zap to me
    const contents = (await new FetchUserContents(props.contentService).execute(userNpub));
    const target = contents.find(content => content.id === props.contentId)!.cloneWithZap(zapAmount);
    const newContents = contents.map(content => content.id === props.contentId ? target : content);
    await new UpdateContents(props.contentService).execute(userNpub, newContents);
    setZaps(target.totalZappedAmount);
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-lg bg-white transition duration-300 transform hover:scale-105">
      <img src={props.imageUrl} alt={props.title} className="w-full h-auto rounded-t-lg" />
      <div className="p-4">
        <div className="font-bold text-lg mb-2">{props.title}</div>
        <button
          className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded shadow"
          onClick={handleZap}
        >
          <span className="text-xl mr-2">⚡</span>
          Zap {zaps}
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
