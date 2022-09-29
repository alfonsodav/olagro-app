import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import localeEs from '@angular/common/locales/es-HN';


registerLocaleData(localeEs);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    HttpClientModule, ReactiveFormsModule, FormsModule, CommonModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy},  { provide: LOCALE_ID, useValue: 'es-HN' }],
  bootstrap: [AppComponent],
})
export class AppModule {
}
