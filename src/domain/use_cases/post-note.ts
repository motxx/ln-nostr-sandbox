import { Note, NoteRepository } from "../entities/note";

export class PostNote {
  constructor(private noteRepository: NoteRepository) {}

  async execute(note: Note) {
    this.noteRepository.postNote(note);
  }
}
