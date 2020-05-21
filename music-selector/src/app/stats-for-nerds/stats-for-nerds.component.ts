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
  thumbsDownAward = new Award('\"Most Down-Voted!\" - \"Stop Picking Screaming Songs, Matt\" Award');
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
      
      if (result) {
        this.thumbsUpAward.songs.push(result);
      }
    });
    this.songsService.getAward(3, ['thumbsDown']).then( result => {
      this.logger.debug('thumbs Down Award Data ', result);
      this.thumbsDownAward.songs = [];
      
      if (result) {
      this.thumbsDownAward.songs.push(result);
      }
    });
    this.songsService.getAward(3, ['thumbsUp', 'thumbsDown']).then( result => {
      this.logger.debug('Controversy Award Data ', result);
      this.controversyAward.songs = [];

      if (result) {
        this.controversyAward.songs.push(result);
      }
    });
  }

}
