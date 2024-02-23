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
  const [renotes, setRenotes] = useState(0);
  const [likes, setLikes] = useState(0);
  const [zaps, setZaps] = useState(0);

  const handleRenotes = async () => {
    console.log('handle renotes');
  }

  const handleLikes = async () => {
    console.log('handle likes');
  };

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
      <div className="bg-gray-100">
        <div className="p-4 font-rounded mb-2">
          <span>{props.text}</span>
        </div>
        <div className="flex justify-end p-2">
          <div>
            <button
              className="renote flex items-center justify-center py-2 px-4 text-gray-700 hover:text-pink-500 transition duration-300 ease-in-out"
              onClick={handleRenotes}
            >
              <div className="group">
                <svg className="w-6 h-6 text-gray-500 group-hover:hidden" fill="currentColor" stroke="currentColor" width="1200pt" height="1200pt" version="1.1" viewBox="100 100 1200 1200" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path d="m669.25 749.82c-2.7109-3.3203-6.4844-4.9766-11.305-4.9766h-260.72v-173.82h86.898c7.8438 0 14.641-2.8672 20.367-8.6016 5.7344-5.7344 8.6016-12.523 8.6016-20.371 0-7.2383-2.2656-13.43-6.7891-18.555l-144.84-173.81c-5.7344-6.6328-13.129-9.957-22.18-9.957-9.0547 0-16.445 3.3164-22.18 9.957l-144.84 173.81c-4.5352 5.1289-6.793 11.316-6.793 18.555 0 7.8516 2.8711 14.641 8.6016 20.371 5.7344 5.7344 12.527 8.6016 20.371 8.6016h86.906v271.59c0 0.90625 0.14844 2.6445 0.44922 5.2109 0.30469 2.5664 0.76172 4.3008 1.3594 5.207 0.60156 0.91016 1.4336 2.1172 2.4883 3.6211 1.0508 1.5039 2.4102 2.5664 4.0664 3.168 1.6602 0.60156 3.6992 0.89844 6.1172 0.89844h434.53c3.918 0 7.3125-1.4297 10.18-4.293 2.8672-2.8672 4.293-6.2617 4.293-10.184 0-3.0234-1.0508-6.1836-3.1602-9.5117z"/>
                    <path d="m1025.9 637.57c-5.7266-5.7227-12.523-8.5938-20.367-8.5938h-86.906v-271.58c0-0.90625-0.14844-2.6406-0.45703-5.2109-0.30469-2.5664-0.76172-4.3008-1.3555-5.207-0.60156-0.90625-1.4336-2.1172-2.4883-3.6211-1.0547-1.5039-2.418-2.5625-4.0703-3.168-1.6602-0.60156-3.6875-0.90625-6.1094-0.90625l-434.53 0.003906c-3.9219 0-7.3125 1.4336-10.184 4.3008-2.8594 2.8672-4.293 6.2617-4.293 10.184 0 3.3164 1.0508 6.332 3.168 9.0508l72.418 86.906c2.7148 3.6211 6.4883 5.4336 11.316 5.4336l260.71-0.003906v173.81h-86.906c-7.8438 0-14.641 2.8672-20.367 8.5938-5.7344 5.7383-8.6055 12.535-8.6055 20.371 0 7.2461 2.2734 13.43 6.8008 18.562l144.84 173.8c6.0352 6.9453 13.422 10.41 22.18 10.41 8.7461 0 16.133-3.4648 22.172-10.41l144.84-173.8c4.5234-5.1328 6.793-11.316 6.793-18.562 0.003906-7.832-2.8672-14.629-8.6016-20.363z"/>
                  </g>
                </svg>
                <svg className="w-6 h-6 text-green-500 hidden group-hover:block" fill="currentColor" stroke="currentColor" width="1200pt" height="1200pt" version="1.1" viewBox="100 100 1200 1200" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path d="m669.25 749.82c-2.7109-3.3203-6.4844-4.9766-11.305-4.9766h-260.72v-173.82h86.898c7.8438 0 14.641-2.8672 20.367-8.6016 5.7344-5.7344 8.6016-12.523 8.6016-20.371 0-7.2383-2.2656-13.43-6.7891-18.555l-144.84-173.81c-5.7344-6.6328-13.129-9.957-22.18-9.957-9.0547 0-16.445 3.3164-22.18 9.957l-144.84 173.81c-4.5352 5.1289-6.793 11.316-6.793 18.555 0 7.8516 2.8711 14.641 8.6016 20.371 5.7344 5.7344 12.527 8.6016 20.371 8.6016h86.906v271.59c0 0.90625 0.14844 2.6445 0.44922 5.2109 0.30469 2.5664 0.76172 4.3008 1.3594 5.207 0.60156 0.91016 1.4336 2.1172 2.4883 3.6211 1.0508 1.5039 2.4102 2.5664 4.0664 3.168 1.6602 0.60156 3.6992 0.89844 6.1172 0.89844h434.53c3.918 0 7.3125-1.4297 10.18-4.293 2.8672-2.8672 4.293-6.2617 4.293-10.184 0-3.0234-1.0508-6.1836-3.1602-9.5117z"/>
                    <path d="m1025.9 637.57c-5.7266-5.7227-12.523-8.5938-20.367-8.5938h-86.906v-271.58c0-0.90625-0.14844-2.6406-0.45703-5.2109-0.30469-2.5664-0.76172-4.3008-1.3555-5.207-0.60156-0.90625-1.4336-2.1172-2.4883-3.6211-1.0547-1.5039-2.418-2.5625-4.0703-3.168-1.6602-0.60156-3.6875-0.90625-6.1094-0.90625l-434.53 0.003906c-3.9219 0-7.3125 1.4336-10.184 4.3008-2.8594 2.8672-4.293 6.2617-4.293 10.184 0 3.3164 1.0508 6.332 3.168 9.0508l72.418 86.906c2.7148 3.6211 6.4883 5.4336 11.316 5.4336l260.71-0.003906v173.81h-86.906c-7.8438 0-14.641 2.8672-20.367 8.5938-5.7344 5.7383-8.6055 12.535-8.6055 20.371 0 7.2461 2.2734 13.43 6.8008 18.562l144.84 173.8c6.0352 6.9453 13.422 10.41 22.18 10.41 8.7461 0 16.133-3.4648 22.172-10.41l144.84-173.8c4.5234-5.1328 6.793-11.316 6.793-18.562 0.003906-7.832-2.8672-14.629-8.6016-20.363z"/>
                  </g>
                </svg>
              </div>
              {renotes > 0 && (<span>{renotes}</span>)}
            </button>
          </div>
          <div>
            <button
              className="flex items-center justify-center py-2 px-4 text-gray-700 hover:text-pink-500 transition duration-300 ease-in-out"
              onClick={handleLikes}
            >
              <div className="group">
                <svg className="w-5 h-5 text-gray-500 group-hover:hidden" fill="currentColor" stroke="currentColor" width="1200pt" height="1200pt" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
                  <path d="m600 332.4c-22.855-30.148-52.449-54.531-86.41-71.203-33.965-16.668-71.359-25.16-109.19-24.797-65.332 0.066406-127.98 26.012-174.21 72.164-46.242 46.152-72.312 108.75-72.504 174.08 0 237.36 418.32 470.16 436.56 480 3.7148 2.1445 8.2891 2.1445 12 0 76.09-43.312 148.49-92.797 216.48-147.96 145.8-118.68 219.6-230.88 219.6-332.04-0.0625-65.414-26.078-128.13-72.332-174.39-46.258-46.258-108.97-72.27-174.39-72.332-37.875-0.32031-75.297 8.2422-109.27 24.996-33.969 16.754-63.535 41.238-86.336 71.48z"/>
                </svg>
                <svg className="w-5 h-5 text-pink-500 hidden group-hover:block" fill="currentColor" stroke="currentColor" width="1200pt" height="1200pt" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
                  <path d="m600 332.4c-22.855-30.148-52.449-54.531-86.41-71.203-33.965-16.668-71.359-25.16-109.19-24.797-65.332 0.066406-127.98 26.012-174.21 72.164-46.242 46.152-72.312 108.75-72.504 174.08 0 237.36 418.32 470.16 436.56 480 3.7148 2.1445 8.2891 2.1445 12 0 76.09-43.312 148.49-92.797 216.48-147.96 145.8-118.68 219.6-230.88 219.6-332.04-0.0625-65.414-26.078-128.13-72.332-174.39-46.258-46.258-108.97-72.27-174.39-72.332-37.875-0.32031-75.297 8.2422-109.27 24.996-33.969 16.754-63.535 41.238-86.336 71.48z"/>
                </svg>
              </div>
              {likes > 0 && (<span>{likes}</span>)}
            </button>
          </div>
          <div>
            <button
              className="flex items-center justify-center py-2 px-4 text-gray-700 hover:text-orange-500 transition duration-300 ease-in-out"
              onClick={handleZap}
            >
              <div className="group">
                <svg className="w-5 h-5 text-gray-500 group-hover:hidden" fill="currentColor" stroke="currentColor" width="1200pt" height="1200pt" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
                  <path d="m901.2 480h-250.8l22.801-277.2c0.73047-10.426-3.1016-20.652-10.508-28.027-7.4023-7.3711-17.645-11.164-28.066-10.395-10.418 0.77344-19.988 6.0352-26.227 14.422l-339.6 478.8c-5.0039 7.2734-7.1602 16.133-6.0586 24.891 1.1016 8.7578 5.3828 16.809 12.031 22.617 6.6484 5.8086 15.199 8.9727 24.027 8.8906h256.8l-26.402 283.2c-0.71484 7.9883 1.2578 15.988 5.6055 22.727 4.3477 6.7383 10.824 11.832 18.395 14.473l12 2.3984v0.003906c12.203-0.15625 23.492-6.4805 30-16.801l336-483.6c5.0039-7.2734 7.1602-16.133 6.0586-24.891-1.1016-8.7578-5.3828-16.809-12.031-22.617-6.6484-5.8086-15.199-8.9727-24.027-8.8906z"/>
                </svg>
                <svg className="w-5 h-5 text-orange-500 hidden group-hover:block" fill="currentColor" stroke="currentColor" width="1200pt" height="1200pt" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
                  <path d="m901.2 480h-250.8l22.801-277.2c0.73047-10.426-3.1016-20.652-10.508-28.027-7.4023-7.3711-17.645-11.164-28.066-10.395-10.418 0.77344-19.988 6.0352-26.227 14.422l-339.6 478.8c-5.0039 7.2734-7.1602 16.133-6.0586 24.891 1.1016 8.7578 5.3828 16.809 12.031 22.617 6.6484 5.8086 15.199 8.9727 24.027 8.8906h256.8l-26.402 283.2c-0.71484 7.9883 1.2578 15.988 5.6055 22.727 4.3477 6.7383 10.824 11.832 18.395 14.473l12 2.3984v0.003906c12.203-0.15625 23.492-6.4805 30-16.801l336-483.6c5.0039-7.2734 7.1602-16.133 6.0586-24.891-1.1016-8.7578-5.3828-16.809-12.031-22.617-6.6484-5.8086-15.199-8.9727-24.027-8.8906z"/>
                </svg>
              </div>
              {zaps > 0 && (<span>{zaps}</span>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
