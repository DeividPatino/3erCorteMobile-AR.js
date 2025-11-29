import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Initialize Firebase once at app startup from environment
const app = initializeApp(environment.firebase as any);

// Initialize Analytics only in supported browser environments
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    })
    .catch(() => {
      /* ignore analytics init errors in unsupported contexts */
    });
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
