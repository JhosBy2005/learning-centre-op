import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {routes} from './app.routes';
import {environment} from '../environments/environment';

/**
 * Application providers: router, HttpClient and i18n.
 *
 * @author José Santana
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideHttpClient(),
    provideRouter(routes),
    provideTranslateService({
      loader: provideTranslateHttpLoader({prefix: environment.i18nPathPrefix, suffix: '.json'}),
      fallbackLang: 'en',
      lang: 'en'
    })
  ]
};
