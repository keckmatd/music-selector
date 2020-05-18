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

  constructor(private songsService: SongsService) {
    this.service = songsService;
    if (environment.useLocalDB) {
      this.localDb = this.LoadJSON('/assets/music-selections.json');
    }

    // hope you know what you're doing if you uncomment this
    // this.resetDB();

    console.log('current song list from DB', this.songList);
  }

  // TODO: Externalize somewhere else
  isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  // LoadSongList() {
  //   const rawCollection = this.service.getFullSongEntries();
  //   rawCollection.forEach( (element) => {
  //     console.log(element.docs.map( doc => doc.data()));
  //     element.docs.map( doc => {
  //       doc.data().forEach( song => {
  //         this.songs.push(song as Song);
  //       });
  //     });
  //   });
  // }

  LoadJSON(url: string): Song[] {
    const request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    const jsonObj = JSON.parse(request.responseText);
    console.log('loading site json');
    console.log(jsonObj);

    const songs = [];
    jsonObj.forEach((element) => {
      // console.log(Song);
      songs.push(element);
    });

    return songs;
  }

  resetDB() {
    const songs = this.LoadJSON('/assets/music-selections.json');

    songs.forEach((element: Song) => {
      console.log('processing song: ', element);
      if (element.id === '5/18/2020') {
        this.service.deleteSongEntry(element);
        this.service.createSongEntry(element);
      }
    });
  }

  async getSongAtDate(date: string) {
    console.log('retrieving song at date: ', date);
    let returnVal: Song;
    if (environment.useLocalDB) {
      returnVal = this.localDb.filter(
        (element: Song) => element.id === date
      )[0];
      console.log(returnVal);
      return returnVal;
    } else {
      await this.songsService.getSongAtDate(date).then((result) => {
        returnVal = result;
      });
    }

    console.log('Song retrieved: ', returnVal);
    return returnVal;
  }

  updateSongAtDate(song: Song) {
    console.log('updating song: ', song);
    if (environment.useLocalDB) {
      const updateItem = this.localDb.find((item) => item.id === song.id);
      const index = this.localDb.indexOf(updateItem);

      this.localDb[index] = song;
    } else {
      this.songsService.updateSongEntry(song).then((value) => {
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
    console.log(prevMonday);
    return this.getFormattedDateString(new Date(prevMonday));
  }
}
