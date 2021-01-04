import {NgModule} from '@angular/core';
import {HomeComponent} from './home.component';
import {BrowserModule} from '@angular/platform-browser';
import {MaterialModule} from '../shared/material.module';
import {NotificationsComponent} from './notifications/notifications.component';
import {PersonalCourseListComponent} from './personal-course-list/personal-course-list.component';
import {ReaderCatalogComponent} from '../reader/reader-dashboard/reader-catalog/reader-catalog.component';
import {SharedModule} from '../shared/shared.module';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {ReaderStatsComponent} from './reader-stats/reader-stats.component';
import {ReaderHomeComponent} from './reader-home/reader-home.component';
import {ReaderDashboardModule} from '../reader/reader-dashboard/reader-dashboard.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    TableModule,
    MaterialModule,
    SharedModule,
    ReaderDashboardModule
  ],
  declarations: [
    HomeComponent,
    PersonalCourseListComponent,
    ReaderCatalogComponent,
    ReaderHomeComponent,
    ReaderStatsComponent,
    NotificationsComponent,
  ],
  exports: [
    HomeComponent,
    PersonalCourseListComponent,
    ReaderCatalogComponent,
    ReaderHomeComponent,
    ReaderStatsComponent,
    NotificationsComponent,
  ]
})
export class HomeModule {
}
