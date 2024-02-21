import React from 'react';
import ImageGallery from "./ImageGallary";
import { User } from '../domain/entities/user';
import { Note } from '../domain/entities/note';
import { WalletService } from '../services/wallet-service';
import { UserService } from '../services/user-service';
import { NoteService } from '../services/note-service';

export interface HomeProps {
  user?: User;
  notes: Note[];
  noteService: NoteService;
  userService: UserService;
  walletService: WalletService;
}

const Home: React.FC<HomeProps> = (props) => {
  return (
    <div>
      <ImageGallery
        notes={props.notes}
        noteService={props.noteService}
        userService={props.userService}
        walletService={props.walletService}
      />
    </div>
  );
};

export default Home;
