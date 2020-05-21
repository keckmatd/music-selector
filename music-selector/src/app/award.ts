import { Song } from './song.model';

export class Award {

    constructor(title: string) {
        this.songs = [({
            id: '',
            person: '',
            isNewGenreDay: '',
            genre: '',
            song: '',
            thumbsUp: '',
            thumbsDowm: ''
        })];
        this.title = title;
    }
    title: string;
    songs: Song[];
}
