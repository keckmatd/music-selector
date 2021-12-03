import { Component } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'music-selector';

  constructor(private firestore: Firestore, private logger: NGXLogger) {
    logger.debug('configuring firestore');
    // firestore.app.options.({ experimentalForceLongPolling: true });
  }
}
