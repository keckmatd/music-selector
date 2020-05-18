import { Component, OnInit } from '@angular/core';
import {
  SiteHelper
} from '../utility/SiteHelper';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  title: string;

  constructor() { }

  ngOnInit(): void {
  }

}
