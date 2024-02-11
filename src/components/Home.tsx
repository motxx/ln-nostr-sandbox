import React from 'react';
import ImageGallery from "./ImageGallary";
import { User } from '../domain/entities/user';
import { Content } from '../domain/entities/content';
import { WalletService } from '../services/wallet-service';
import { UserService } from '../services/user-service';
import { ContentService } from '../services/content-service';

export interface HomeProps {
  user?: User;
  contents: Content[];
  contentService: ContentService;
  userService: UserService;
  walletService: WalletService;
}

const Home: React.FC<HomeProps> = (props) => {
  return (
    <div>
      <ImageGallery
        contents={props.contents}
        contentService={props.contentService}
        userService={props.userService}
        walletService={props.walletService}
      />
    </div>
  );
};

export default Home;
