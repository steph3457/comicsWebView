import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonToggleModule, MatInputModule, MatButtonModule, MatCardModule, MatTableModule, MatToolbarModule, MatBadgeModule, MatSortModule, MatIconModule, MatSelectModule, MatExpansionModule, MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { EnvironmentService } from './environment.service';

import { ComicDetailsComponent } from './comic-details/comic-details.component';
import { ReaderComponent } from "./reader/reader.component";
import { LibraryComponent } from "./library/library.component";
import { ConfigComponent } from "./config/config.component";

import { LibraryService } from "./library.service";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


const appInitializerFn = (environement: EnvironmentService) => {
  return () => {
    return environement.loadAppEnvironment();
  }
};

@NgModule({
  declarations: [
    AppComponent,
    ReaderComponent,
    LibraryComponent,
    ComicDetailsComponent,
    ConfigComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatToolbarModule,
    MatBadgeModule,
    MatSortModule,
    MatIconModule,
    MatSelectModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    LibraryService,
    EnvironmentService, {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [EnvironmentService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
