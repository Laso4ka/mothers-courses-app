import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // For HTTP calls

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {environment} from './environments/environment'; // We'll create this file next

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Provide routes
    provideHttpClient(withInterceptorsFromDi()), // Provide HttpClient if you'll fetch data
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ]
})
  .catch(err => console.error(err));
