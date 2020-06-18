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

  private availableNames = [
    'Payne',
    'Todd',
    'Allipuram',
    'Daly',
    'Keck',
    'Zielinski',
    'Parvaresh',
  ];

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
    // this.fixDBIndex();

    // add a new user (uncomment if you want to do it)
    // this.addNewUser('6/22/2020', '10/28/2020');

    logger.debug('current song list from DB', this.songList);
  }

  isEmptyOrSpaces(str) {
    return !str || /^\s*$/.test(str);
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

  async addNewUser(startDate: string, endDate: string) {
    let dateIterator = new Date(startDate);
    const endIterator = new Date(endDate);
    const nameSize = this.availableNames.length;
    let iterator = 0;
    let selected = new Song();
    this.logger.warn('endIterator: ', endIterator);
    this.logger.warn('dateIterator.getDate(): ', dateIterator.getDate(),
    'endIterator.getDate(): ', endIterator.getDate());
    while (this.getFormattedDateString(dateIterator) !== this.getFormattedDateString(endIterator)) {
      // try {
      const result = await this.getSongAtDate(this.getFormattedDateString(dateIterator));

      this.logger.debug(result);
      selected = result as Song;

      selected.person = this.availableNames[iterator];
      selected.id = this.getFormattedDateString(dateIterator);

      if (environment.useLocalDB) {
        const updateItem = this.localDb.find((item) => item.id === selected.id);
        const index = this.localDb.indexOf(updateItem);

        // this.logger.debug('Name update: ', selected.person);
        this.localDb[index] = selected;
      } else {
        await this.songsService.updateSongEntry(selected).then((value) => {
          // this.logger.debug('Name update: ', value);
        });
      }

      this.logger.warn(
        'On Date: ',
        dateIterator,
        ' day of the week: ',
        new Date(dateIterator).getDay(),
        ' name: ',
        this.availableNames[iterator]
      );

      iterator++;
      iterator %= nameSize;
      // } catch (error) {
      //   this.logger.error(error);
      // } finally {

      dateIterator.setDate(dateIterator.getDate() + 1);
      while (
        new Date(dateIterator).getDay() === 0 ||
        new Date(dateIterator).getDay() >= 6
      ) {
        dateIterator.setDate(dateIterator.getDate() + 1);
        this.logger.warn(
          'Next Date: ',
          dateIterator,
          ' date: ',
          new Date(dateIterator),
          ' name: ',
          this.availableNames[iterator]
        );
      }
      // }
    }
  }

  deleteUser(startDate: string, name: string) { }

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

  getNextMonday(date: string): string {
    const d = new Date();
    d.setDate(d.getDate() + ((((7 - d.getDay()) % 7) + 1) % 7));

    return this.getFormattedDateString(d);
  }

  getNearestMonday(date: string): string {
    const prevMonday = new Date(date);
    prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
    this.logger.debug(prevMonday);
    return this.getFormattedDateString(new Date(prevMonday));
  }
}
