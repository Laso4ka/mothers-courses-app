import {inject, Injectable} from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import {Observable, BehaviorSubject, tap, distinctUntilChanged} from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

export interface HomePageDataForSettings {
  heroSection?: {
    telegramLink?: string;
  };
  telegramBotLink?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {
  private settingsDocPath = 'homePageContent/main'; // Шлях до документа
  public readonly globalTelegramLink$: Observable<string | undefined>;
  public readonly telegramBotLink$: Observable<string | undefined>;
  private firestore: Firestore = inject(Firestore);

  constructor() {
    const contentDocRef = doc(this.firestore, this.settingsDocPath);

    const siteSettings$ = (docData(contentDocRef) as Observable<HomePageDataForSettings | undefined>).pipe(
      shareReplay(1)
    );

    this.globalTelegramLink$ = siteSettings$.pipe(
      map(settings => settings?.heroSection?.telegramLink),
      distinctUntilChanged()
    );

    this.telegramBotLink$ = siteSettings$.pipe(
      map(settings => settings?.telegramBotLink),
      distinctUntilChanged()
    );
  }
}
