import React from 'react';
import ImageCard from './ImageCard';
import { Note } from '../domain/entities/note';
import { NoteService } from '../services/note-service';
import { UserService } from '../services/user-service';
import { WalletService } from '../services/wallet-service';

export interface ImageGalleryProps {
  notes: Note[];
  noteService: NoteService;
  userService: UserService;
  walletService: WalletService;
}

const ImageGallery: React.FC<ImageGalleryProps> = (props) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {props.notes.map((note) => (
          <ImageCard
            key={note.id}
            noteId={note.id}
            text={note.text}
            imageUrl={note.imageUrl}
            noteService={props.noteService}
            userService={props.userService}
            walletService={props.walletService}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
