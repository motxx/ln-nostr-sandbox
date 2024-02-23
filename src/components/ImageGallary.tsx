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
      <div className="columns-2 md:columns-3 lg:columns-4">
        {props.notes.map((note) => (
          <div className="mb-4">
            <ImageCard
              key={note.id}
              noteId={note.id}
              text={note.text}
              imageUrl={note.imageUrl}
              noteService={props.noteService}
              userService={props.userService}
              walletService={props.walletService}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
