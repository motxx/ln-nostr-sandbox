import {
  Note,
  NoteRepository,
  SubscribeTimelineOptions,
} from "../entities/note";

export class SubscribeTimeline {
  constructor(private noteRepository: NoteRepository) {}

  async execute(
    onNote: (note: Note) => void,
    options?: SubscribeTimelineOptions
  ) {
    this.noteRepository.subscribeTimeline(onNote, options);
  }
}
