import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import { AvatarModule } from 'ngx-avatar';


import {AppComponent} from './app.component';
// CLARIFY - is this the best way to bring in env
import {environment} from '../environments/environment';
import {AppRoutes} from './app.routes';
import {CoreModule} from './core/core.module';

import {AppRoleGuardService} from './app-role-guard.service';
import {CanDeactivateGuard} from './can-deactivate-guard.service';
import {ContributorModule} from './contributor/contributor.module';
import {ReaderModule} from './reader/reader.module';
import {GettingStartedComponent} from './getting-started/getting-started.component';
import {ThemeComponent} from './theme/theme.component';
import {ThemingService} from './theme/theming.service';
import {HomeModule} from './home/home.module';
import {MaterialModule} from './shared/material.module';
import {Notfound404Component} from './notfound404/notfound404.component';
import {ReaderPerformanceModule} from './reports/reader-performance/reader-performance.module';
import {SharedModule} from './shared/shared.module';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {SimpleRegistrationComponent} from './simple-registration/simple-registration.component';
import {UserMessageComponent} from './user-message/user-message.component';

import {CitationLookupComponent} from './citation-lookup/citation-lookup.component';
import {CitationsModule} from './citations/citations.module';
import {CoursePerformanceModule} from './reports/course-performance/course-performance.module';
import {LoggingService} from './shared/services/logging.service';
import { ClinicalExamListModule } from './clinical-exam-list/clinical-exam-list.module';

import { ClinicalExamModule } from './clinical-exam/clinical-exam.module';

import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { DndModule } from 'ng2-dnd';
import { DeviceDetectorModule } from 'ngx-device-detector';
import {EventTrackingService} from './shared/services/event-tracking.service';
import {ChatService} from './shared/services/chat.service';
// import { QuestionPerformanceComponent } from './reports/question-performance/question-performance.component';

environment.version = '0.92.006';

LoggingService.log('env: ', JSON.stringify(environment));

const dbConfig: any = {
  name: 'NowceDb',
  version: 1,
  objectStoresMeta: [{
    store: 'userExamData',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'name', keypath: 'name', options: { unique: false } },
      { name: 'email', keypath: 'email', options: { unique: false } }
    ]
  }]
};

@NgModule({
  imports: [
    AppRoutes,
    BrowserAnimationsModule,
    BrowserModule,
    CitationsModule,
    ContributorModule,
    ReaderModule,
    CoreModule,
    CoursePerformanceModule,
    FormsModule,   // <- list.component
    HomeModule,
    HttpClientModule,
    MaterialModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    DndModule.forRoot(),
    ReactiveFormsModule,
    ReaderPerformanceModule,
    SharedModule,
    SimpleNotificationsModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    ClinicalExamListModule,
    ClinicalExamModule,
    AvatarModule
  ],
  declarations: [
    AppComponent,
    CitationLookupComponent,
    GettingStartedComponent,
    ThemeComponent,
    Notfound404Component,
    SimpleRegistrationComponent,
    UserMessageComponent // ,
   // QuestionPerformanceComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    AppRoleGuardService,
    ThemingService,
    CanDeactivateGuard,
    ChatService
  ]
})
export class AppModule {
}
