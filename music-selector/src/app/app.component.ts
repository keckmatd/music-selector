import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'music-selector';

  constructor(private firestore: AngularFirestore) {
    console.log('configuring firestore');
    firestore.firestore.settings({ experimentalForceLongPolling: true });
  }
}
