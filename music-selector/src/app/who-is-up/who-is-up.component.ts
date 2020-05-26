import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SongsService } from '../utility/songs.service';
import { SiteHelper } from '../utility/SiteHelper';

import { Song } from '../song.model';
import { NGXLogger } from 'ngx-logger';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-who-is-up',
  templateUrl: './who-is-up.component.html',
  styleUrls: ['./who-is-up.component.scss'],
})
export class WhoIsUpComponent implements OnInit, AfterViewInit {
  date = '';
  genre = '';
  selector = '';
  song = '';
  today = new Date();
  todayMonday = false;
  siteHelper: SiteHelper;

  activeSong: Song;

  list = [];
  pageSize = 25;
  simpleSongList = [];
  startIndex = 0;
  todayAsString: string;

  editGenre: boolean;
  edittingGenre: boolean;
  genrePlaceholder = '';

  editSong: boolean;
  edittingSong: boolean;
  songPlaceholder = '';

  startDate = '4/20/2020';
  daysToGenerate = 1826;
  breakpoint = 5;

  constructor(
    private songsService: SongsService,
    private logger: NGXLogger,
    private cookieService: CookieService
  ) {
    this.logger.trace('in WhoIsUpComponent constructor');
    this.siteHelper = new SiteHelper(songsService, logger);
    this.todayAsString = this.siteHelper.getFormattedDateString(this.today);
    this.activeSong = new Song();
    // this.setActiveSong(this.todayAsString);
    this.edittingGenre = false;
    this.edittingSong = false;

    const dateIterator = new Date(this.startDate);
    for (let idx = 0; idx < this.daysToGenerate; ++idx) {
      this.logger.trace('adding entry to paginator ', idx);
      if (dateIterator.getDay() > 0 && dateIterator.getDay() < 6) {
        this.list.push({
          title: this.siteHelper.getFormattedDateString(dateIterator),
        });
      }
      dateIterator.setDate(dateIterator.getDate() + 1);
    }

    // - get offset from start of time
    this.logger.trace(this.list);
    const start = new Date(this.list[0].title);
    const end = new Date(this.siteHelper.getFormattedDateString(this.today));
    this.logger.trace('after date pulls');

    // To calculate the time difference of two dates
    const diffInTime = end.getTime() - start.getTime();

    // To calculate the no. of days between two dates
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    // To display the final no. of days (result)
    const block = (this.pageSize + (Math.trunc(this.pageSize / this.breakpoint) * 2));
    this.startIndex = Math.max(Math.trunc(diffInDays / block), 0);
    this.logger.debug('Initial starting paginator index: ', this.startIndex, ' diffInDays: ', diffInDays, ' block: ', block);

    // - set the pagination to the current date to start with
    this.onPageChange({ pageIndex: this.startIndex, pageSize: this.pageSize });

    // this.simpleSongList = this.list.slice(this.startIndex, this.pageSize);
  }

  ngOnInit(): void {
    this.logger.trace('in ngOnInit');
    // if (window.innerWidth <= 400) {
    //   this.breakpoint = 1;
    //   this.pageSize = 1;
    // } else {
    //   this.breakpoint = 5;
    //   this.pageSize = 25;
    // }

    this.setActiveSong(this.todayAsString);
  }

  ngAfterViewInit() {
    this.logger.trace('in ngAfterViewInit');
    this.logger.trace(
      'current song link: ',
      document.getElementById('songLink')
    );
  }

  setActiveSong(date: string) {
    this.logger.trace('in setActiveSong ', date);

    this.siteHelper.getSongAtDate(date).then((result) => {
      this.logger.debug(result);
      this.activeSong = result;
      // (document.getElementById(
      //   'songLink'
      // ) as HTMLLinkElement).href = this.activeSong.song;

      this.activeSong.thumbsUp = this.siteHelper.isEmptyOrSpaces(
        this.activeSong.thumbsUp
      )
        ? '0'
        : this.activeSong.thumbsUp;
      this.activeSong.thumbsDowm = this.siteHelper.isEmptyOrSpaces(
        this.activeSong.thumbsDowm
      )
        ? '0'
        : this.activeSong.thumbsDowm;
    });

    this.editGenre = false;
    this.edittingGenre = false;
    if (new Date(date).getDay() === 1) {
      this.editGenre = true;
    } else {
      this.siteHelper
        .getSongAtDate(this.siteHelper.getNearestMonday(date))
        .then((result) => {
          this.activeSong.genre = result.genre;
        });
    }
  }

  onPageChange(e) {
    this.logger.trace('changing page: ', e);
    this.logger.debug('Set paginator => (index) ', e.pageIndex, ' (pageSize) ', e.pageSize);
    this.simpleSongList = this.list.slice(
      e.pageIndex * e.pageSize,
      (e.pageIndex + 1) * e.pageSize
    );
  }

  changeActiveCard(e) {
    this.logger.trace('changing active card ', e);

    this.setActiveSong(e.target.innerText);
  }

  onEditGenre(e) {
    this.logger.trace('in edit genre ', e);
    this.edittingGenre = true;
  }

  onEdittingGenreSave(e) {
    this.logger.trace(
      'in onEdittingGenreSave: ',
      (document.getElementById('newGenre') as HTMLInputElement).value,
      this.activeSong
    );
    this.edittingGenre = false;

    const newData = JSON.parse(JSON.stringify(this.activeSong));
    newData.genre = (document.getElementById(
      'newGenre'
    ) as HTMLInputElement).value;
    this.siteHelper.updateSongAtDate(newData);
    this.activeSong = newData;
  }

  onEdittingGenreCancel(e) {
    this.logger.trace('in onEdittingGenreCancel', e);
    this.edittingGenre = false;
  }

  onEditSong(e) {
    this.logger.trace('in onEditSong', e);
    this.edittingSong = true;
  }

  onEdittingSongSave(e) {
    const newSong = document.getElementById('newSong') as HTMLInputElement;
    this.logger.trace('in song save: ', newSong.value, this.activeSong);
    this.edittingSong = false;

    const newData = JSON.parse(JSON.stringify(this.activeSong));
    newData.song = newSong.value;
    this.siteHelper.updateSongAtDate(newData);
    this.activeSong = newData;
    newSong.value = '';
  }

  onEdittingSongCancel(e) {
    this.logger.trace('in onEdittingSongCancel', e);
    this.edittingSong = false;
  }

  onResize(event) {
    this.logger.trace('in onResize', event);
    // if (event.target.innerWidth <= 400) {
    //   this.breakpoint = 1;
    //   this.pageSize = 1;
    // } else {
    //   this.breakpoint = 5;
    //   this.pageSize = 25;
    // }
  }

  onThumbsUp(event) {
    this.logger.trace('In Thumbs Up Event ', event);
    const cookieString = this.activeSong.id + '_' + 'UpVoted';

    if (
      this.cookieService.get(cookieString) === '0' ||
      this.cookieService.get(cookieString) === ''
    ) {
      this.logger.debug('Toggle Vote Up - Up');

      const newData = JSON.parse(JSON.stringify(this.activeSong));
      newData.thumbsUp = (+newData.thumbsUp + 1).toString();

      this.siteHelper.updateSongAtDate(newData);
      this.activeSong = newData;

      this.cookieService.set(cookieString, '1');
    } else {
      this.logger.debug('Toggle Vote Up - Down');

      this.cookieService.set(cookieString, '0');

      const newData = JSON.parse(JSON.stringify(this.activeSong));
      newData.thumbsUp = (+newData.thumbsUp - 1).toString();

      this.siteHelper.updateSongAtDate(newData);
      this.activeSong = newData;
    }
  }

  onThumbsDown(event) {
    this.logger.trace('In Thumbs Down Event ', event);
    const cookieString = this.activeSong.id + '_' + 'DownVoted';

    if (
      this.cookieService.get(cookieString) === '0' ||
      this.cookieService.get(cookieString) === ''
    ) {
      this.logger.debug('Toggle Vote Down - Up');

      const newData = JSON.parse(JSON.stringify(this.activeSong));
      newData.thumbsDowm = (+newData.thumbsDowm + 1).toString();

      this.siteHelper.updateSongAtDate(newData);
      this.activeSong = newData;

      this.cookieService.set(cookieString, '1');
    } else {
      this.logger.debug('Toggle Vote Down - Down');

      this.cookieService.set(cookieString, '0');

      const newData = JSON.parse(JSON.stringify(this.activeSong));
      newData.thumbsDowm = (+newData.thumbsDowm - 1).toString();

      this.siteHelper.updateSongAtDate(newData);
      this.activeSong = newData;
    }
  }

  onResetVotes(event) {
    this.logger.trace('In reset ', event);

    let cookieString = this.activeSong.id + '_' + 'DownVoted';
    this.cookieService.set(cookieString, '0');
    cookieString = this.activeSong.id + '_' + 'UpVoted';
    this.cookieService.set(cookieString, '0');

    const newData = JSON.parse(JSON.stringify(this.activeSong));
    newData.thumbsUp = '0'; // reset
    newData.thumbsDowm = '0'; // reset
    this.siteHelper.updateSongAtDate(newData);
    this.activeSong = newData;
  }
}
