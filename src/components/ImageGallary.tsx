import React from 'react';
import Masonry from 'react-masonry-css'
import ImageCard from './ImageCard';
import { Note } from '../domain/entities/note';
import { NoteService } from '../services/note-service';
import { UserService } from '../services/user-service';
import { WalletService } from '../services/wallet-service';
import './masonry.scss';

export interface ImageGalleryProps {
  notes: Note[];
  noteService: NoteService;
  userService: UserService;
  walletService: WalletService;
}

const ImageGallery: React.FC<ImageGalleryProps> = (props) => {
  const breakpointCols = {
    default: 4,
    1350: 3,
    1048: 2,
    576: 1,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Masonry
        breakpointCols={breakpointCols}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {props.notes.map((note) => (
          <div className="image-card">
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
      </Masonry>
    </div>
  );
};

export default ImageGallery;
