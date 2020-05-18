import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { AngularFireModule } from '@angular/fire';
import { Song } from '../song.model';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  constructor(private firestore: AngularFirestore) { }

  createSongEntry(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('songs')
        .doc(data.id)
        .set(data)
        .then(
          (res) => {
            console.log('added song: ', data);
          },
          (err) => reject(err)
        );
    });
  }

  async updateSongEntry(data) {
    console.log('DB => update song: ', data);
    await this.firestore.collection('songs').doc(data.id)
      .set(data, { merge: true })
      .then(
        (res) => {
          console.log(res);
          console.log('updated song: ', data);
        },
        (err) => console.log(err)
      );
  }

  getSongEntries() {
    console.log('DB => get all songs');
    return this.firestore.collection('songs').snapshotChanges();
  }

  async getSongAtDate(date: string) {
    console.log('DB => get song on date: ', date);
    let result = null;
    await this.firestore.collection('songs').doc(date).ref.get().then((doc) => {
      if (doc.exists) {
        console.log('Document data:', doc.data());
        result = doc.data();
      } else {
        console.log('No such document on date: ', date);
      }
    }).catch((error) => {
      console.log('Error getting document:', error);
    });

    return result;
  }

  getFullSongEntries() {
    return this.firestore.collection('songs').get();
  }

  deleteSongEntry(data) {
    return this.firestore
      .collection('songs')
      .doc(data.id)
      .delete()
      .then(
        (res) => {
          console.log('deleted song: ', data);
        },
        (err) => console.log(err)
      );
  }
}
