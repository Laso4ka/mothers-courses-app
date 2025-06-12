import { Injectable } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

// Модель для налаштувань (може бути частиною HomePageContent або окремою)
export interface SiteSettings {
  telegramLink?: string;
  // ... інші глобальні налаштування ...
}

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {
  private settingsDocPath = 'homePageContent/main'; // Шлях до документа
  public globalTelegramLink$: Observable<string | undefined>;

  constructor(private firestore: Firestore) { // Інжекція Firestore
    const contentDocRef = doc(this.firestore, this.settingsDocPath);
    this.globalTelegramLink$ = (docData(contentDocRef) as Observable<any>).pipe(
      map(content => {
        if (content && content.heroSection && content.heroSection.telegramLink) {
          return content.heroSection.telegramLink;
        } else if (content && content.globalTelegramLink) {
          return content.globalTelegramLink;
        }
        return undefined;
      }),
      shareReplay(1)
    );
  }
}
