import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SongsService } from '../utility/songs.service';
import { SiteHelper } from '../utility/SiteHelper';

import { Song } from '../song.model';
import { NGXLogger } from 'ngx-logger';
import { CookieService } from 'ngx-cookie-service';
import { Award } from '../award';

@Component({
  selector: 'app-stats-for-nerds',
  templateUrl: './stats-for-nerds.component.html',
  styleUrls: ['./stats-for-nerds.component.scss']
})
export class StatsForNerdsComponent implements OnInit {

  thumbsUpAward = new Award('\"Most Up-Voted!\" - The Todd Liked it Award');
  thumbsDownAward = new Award('\"Most Down-Voted!\" - \"Stop Picking Songs with Screaming, Matt\" Award');
  controversyAward = new Award('\"Most Controversial!\" - The Joe Daly Award');

  constructor(
    private songsService: SongsService,
    private logger: NGXLogger,
    private cookieService: CookieService) {
      logger.trace('constructor Stats for Nerds');
  }

  ngOnInit(): void {
    this.songsService.getAward(3, ['thumbsUp']).then( result => {
      this.logger.debug('thumbs Up Award Data ', result);

      this.thumbsUpAward.songs = [];
      result.forEach( entry => {
        if (entry.thumbsUp !== '') {
          this.thumbsUpAward.songs.push(entry);
        }
      });
      this.logger.debug('thumbs Up Award Award Pushed: ', this.thumbsUpAward);
    });
    this.songsService.getAward(3, ['thumbsDowm']).then( result => {
      this.logger.debug('thumbs Down Award Data ', result);

      this.thumbsDownAward.songs = [];
      result.forEach( entry => {
        if (entry.thumbsDowm !== '') {
          this.thumbsDownAward.songs.push(entry);
        }
      });
      this.logger.debug('thumbs Down Award Award Pushed: ', this.thumbsDownAward);
    });
    this.songsService.getAward(3, ['thumbsUp', 'thumbsDowm']).then( result => {
      this.logger.debug('Controversy Award Data ', result);

      this.controversyAward.songs = [];
      result.forEach( entry => {
        if (entry.thumbsUp !== '' && entry.thumbsDowm !== '') {
          this.controversyAward.songs.push(entry);
        }
      });
      this.logger.debug('Controversy Award Award Pushed: ', this.controversyAward);
    });
  }

}
