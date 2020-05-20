/* generate new JSON interfaces if you update site-links.json at => http://json2ts.com/ */
import * as linkifyHtml from 'linkifyjs/html';

import { AngularFireModule } from '@angular/fire';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/firestore';

import { SongsService } from '../utility/songs.service';
import { Song } from '../song.model';
import { environment } from '../../environments/environment';
import { NGXLogger } from 'ngx-logger';

/* don't blow away this class if updating */
export class SiteHelper {
  // private songs: Song[];
  private service: SongsService;
  private localDb: Song[];

  songList;

  // getSongEntries = () =>
  //   this.service
  //     .getSongEntries()
  //     .subscribe(res => (this.songList = res))

  // deleteSong = data => this.service.deleteSongEntry(data);

  // markCompleted = data => this.service.updateSongEntry(data);

  constructor(private songsService: SongsService, private logger: NGXLogger) {
    this.service = songsService;
    if (environment.useLocalDB) {
      this.localDb = this.LoadJSON('/assets/music-selections.json');
    }

    // hope you know what you're doing if you uncomment this
    // this.resetDB();

    logger.debug('current song list from DB', this.songList);
  }

  isEmptyOrSpaces(str) {
    return (!str || /^\s*$/.test(str));
  }

  LoadJSON(url: string): Song[] {
    const request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    const jsonObj = JSON.parse(request.responseText);
    this.logger.debug('loading site json');
    this.logger.debug(jsonObj);

    const songs = [];
    jsonObj.forEach((element) => {
      this.logger.trace(Song);
      songs.push(element);
    });

    return songs;
  }

  resetDB() {
    const songs = this.LoadJSON('/assets/music-selections.json');

    songs.forEach((element: Song) => {
      this.logger.debug('processing song: ', element);
      this.service.deleteSongEntry(element);
      this.service.createSongEntry(element);
    });
  }

  async getSongAtDate(date: string) {
    this.logger.trace('retrieving song at date: ', date);
    let returnVal: Song;
    if (environment.useLocalDB) {
      returnVal = this.localDb.filter(
        (element: Song) => element.id === date
      )[0];
      this.logger.debug(returnVal);
      return returnVal;
    } else {
      await this.songsService.getSongAtDate(date).then((result) => {
        returnVal = result;
        this.logger.debug('Song retrieved: ', returnVal);
      });
    }
    return returnVal;
  }

  updateSongAtDate(song: Song) {
    this.logger.trace('updating song: ', song);
    if (environment.useLocalDB) {
      const updateItem = this.localDb.find((item) => item.id === song.id);
      const index = this.localDb.indexOf(updateItem);

      this.logger.debug('Song update: ', song);
      this.localDb[index] = song;
    } else {
      this.songsService.updateSongEntry(song).then((value) => {
        this.logger.debug('Song update: ', value);
        return value;
      });
    }
  }

  getFormattedDateString(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  getNearestMonday(date: string): string {
    const prevMonday = new Date(date);
    prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
    this.logger.debug(prevMonday);
    return this.getFormattedDateString(new Date(prevMonday));
  }
}
