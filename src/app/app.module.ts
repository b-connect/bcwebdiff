import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { AppComponent } from './app.component';
import { HomeComponent, ErrorDialog } from './components/home/home.component';

import { FlexLayoutModule } from "@angular/flex-layout";

import { DataUrlService } from './services/data-url.service';
import { DiffService } from './services/diff.service';
import { PuppeterService } from './services/puppeter.service';

import { HistoryService } from './services/history.service';
import { SettingsService } from './services/settings.service';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatDialogModule,
  MatListModule,
  MatSidenavModule
} from '@angular/material';
import {MATERIAL_SANITY_CHECKS} from '@angular/material/core';
import { HistoryComponent } from './components/history/history.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorDialog,
    HistoryComponent
  ],
  entryComponents: [
    ErrorDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDialogModule,
    MatListModule,
    MatSidenavModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],

  providers: [ElectronService,{
      provide: MATERIAL_SANITY_CHECKS,
      useValue: false
    },
    DataUrlService,
    SettingsService,
    PuppeterService,
    HistoryService,
    DiffService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
