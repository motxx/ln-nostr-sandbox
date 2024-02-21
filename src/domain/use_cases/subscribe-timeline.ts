import { Note, NoteRepository } from "../entities/note";

export class SubscribeTimeline {
  constructor(private noteRepository: NoteRepository) {}

  async execute(onNote: (note: Note) => void, options?: { since?: Date }) {
    this.noteRepository.subscribeTimeline(onNote, options);
  }
}
