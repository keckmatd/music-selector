import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { AngularFireModule } from '@angular/fire';
import { Song } from '../song.model';
import { environment } from '../../environments/environment';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class SongsService {

  private collection = 'songs';
  constructor(private firestore: AngularFirestore, private logger: NGXLogger) {
    if (environment.useTestDB) {
      this.collection = 'songsTest';
    }
  }

  createSongEntry(data) {
    this.logger.trace('DB => create song: ', data);
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection(this.collection)
        .doc(data.id)
        .set(data)
        .then(
          (res) => {
            this.logger.debug(res);
            this.logger.debug('added song: ', data);
          },
          (err) => this.logger.error(err)
        );
    });
  }

  async updateSongEntry(data) {
    this.logger.trace('DB => update song: ', data);
    await this.firestore.collection(this.collection).doc(data.id)
      .set(data, { merge: true })
      .then(
        (res) => {
          this.logger.debug(res);
          this.logger.debug('updated song: ', data);
        },
        (err) => this.logger.error(err)
      );
  }

  getSongEntries() {
    this.logger.trace('DB => get all songs');
    return this.firestore.collection(this.collection).snapshotChanges();
  }

  async getSongAtDate(date: string) {
    this.logger.trace('DB => get song on date: ', date);
    let result = null;
    await this.firestore.collection(this.collection).doc(date).ref.get().then((doc) => {
      if (doc.exists) {
        this.logger.debug('Document data:', doc.data());
        result = doc.data();
      } else {
        this.logger.warn('No such document on date: ', date);
      }
    }).catch((error) => {
      this.logger.error('Error getting document:', error);
    });

    return result;
  }

  getFullSongEntries() {
    return this.firestore.collection(this.collection).get();
  }

  deleteSongEntry(data) {
    return this.firestore
      .collection(this.collection)
      .doc(data.id)
      .delete()
      .then(
        (res) => {
          this.logger.trace('deleted song: ', data);
        },
        (err) => this.logger.error(err)
      );
  }
}
