import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'music-selector';

  constructor(private firestore: AngularFirestore, private logger: NGXLogger) {
    logger.debug('configuring firestore');
    firestore.firestore.settings({ experimentalForceLongPolling: true });
  }
}
