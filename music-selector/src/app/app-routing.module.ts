import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {WhoIsUpComponent} from './who-is-up/who-is-up.component';
import {PastPicksComponent} from './past-picks/past-picks.component';
import {StatsForNerdsComponent} from './stats-for-nerds/stats-for-nerds.component';


const routes: Routes = [
  { path: '', redirectTo: '/who-is-up', pathMatch: 'full' },
  { path: 'who-is-up', component: WhoIsUpComponent },
  { path: 'past-picks', component: PastPicksComponent },
  { path: 'stats-for-nerds', component: StatsForNerdsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
