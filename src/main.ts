import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // For HTTP calls

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import {provideAnimations} from '@angular/platform-browser/animations'; // We'll create this file next

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Provide routes
    provideHttpClient(withInterceptorsFromDi()), // Provide HttpClient if you'll fetch data
    provideAnimations()
  ]
})
  .catch(err => console.error(err));
