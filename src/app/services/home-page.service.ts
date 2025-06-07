import { Injectable } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HomePageContent } from '../models/home-page-content.model';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {
  private contentDocPath = 'homePageContent/main'; // Один документ з усіма даними

  constructor(private firestore: Firestore) { }

  getHomePageContent(): Observable<HomePageContent | undefined> {
    const contentDocRef = doc(this.firestore, this.contentDocPath);
    return docData(contentDocRef, { idField: 'id' }) as Observable<HomePageContent | undefined>;
  }
}
