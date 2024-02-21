import React, { useEffect, useState } from 'react';
import { NoteService } from '../services/note-service';
import { UserService } from '../services/user-service';
import { WalletService } from '../services/wallet-service';
import { SendZap } from '../domain/use_cases/send-zap';

export interface ImageCardProps {
  noteId: string;
  text: string;
  imageUrl: string;
  userService: UserService;
  noteService: NoteService;
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
    // Update zaps
  };

  useEffect(() => {
    // Update zaps
  }, [props]);

  return (
    <div className="overflow-hidden rounded-lg shadow-lg bg-white transition duration-300 transform hover:scale-105">
      <img src={props.imageUrl} alt={props.text} className="w-full h-auto rounded-t-lg" />
      <div className="p-4">
        <div className="font-bold text-lg mb-2">{props.text}</div>
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
