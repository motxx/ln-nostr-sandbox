import React, { useEffect, useState } from 'react';
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
    const zapTargetAddress = "moti@getalby.com";
    const sendZapResponse = await new SendZap(props.walletService, props.userService).execute(zapTargetAddress, zapAmount);
    console.log(sendZapResponse);
    const userNpub = user.npub; // TODO: 一旦自分のコンテンツにZapしたものとしてUIに反映
    const contents = (await new FetchUserContents(props.contentService).execute(userNpub));
    const content = contents.find(content => content.id === props.contentId);
    if (!content) {
      throw new Error("Content not found");
    }
    const newContent = Content.copyWithZap(content, zapAmount);
    const newContents = contents.map(content => content.id === props.contentId ? newContent : content);
    await new UpdateContents(props.contentService).execute(userNpub, newContents);
    setZaps(newContent.totalZappedAmount);
  };

  useEffect(() => {
    // TODO: コンテンツを配列で引く仕組みが酷いので改善する
    (async () => {
      const user = await props.userService.fetch();
      const userNpub = user.npub;
      const contents = (await new FetchUserContents(props.contentService).execute(userNpub));
      const content = contents.find(content => content.id === props.contentId);
      if (!content) {
        throw new Error("Content not found");
      }
      setZaps(content.totalZappedAmount);
    })();
  }, [props]);

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
