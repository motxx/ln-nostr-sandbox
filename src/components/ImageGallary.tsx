import React from 'react';
import ImageCard from './ImageCard';
import { Content } from '../domain/entities/content';
import { ContentService } from '../services/content-service';
import { UserService } from '../services/user-service';
import { WalletService } from '../services/wallet-service';

export interface ImageGalleryProps {
  contents: Content[];
  contentService: ContentService;
  userService: UserService;
  walletService: WalletService;
}

const ImageGallery: React.FC<ImageGalleryProps> = (props) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {props.contents.map((content) => (
          <ImageCard
            key={content.id}
            contentId={content.id}
            title={content.title}
            imageUrl={content.imageUrl}
            contentService={props.contentService}
            userService={props.userService}
            walletService={props.walletService}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
