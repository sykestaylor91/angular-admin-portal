import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ReaderPerformanceService} from './reader-performance.service';
import {ReaderPerformanceComponent} from './reader-performance.component';
import {ReaderPerformanceResponseDetailsComponent} from './response-details/response-details.component';
import {BrowserModule} from '@angular/platform-browser';
import {SharedModule} from '../../shared/shared.module';
import {TableModule} from 'primeng/table';
import {MaterialModule} from '../../shared/material.module';
import {ReaderPerformanceSearchUserComponent} from './search-user/search-user.component';
import {ReaderPerformanceResultsComponent} from './results/results.component';
import {ReaderPerformanceSummaryComponent} from './summary/summary.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    TableModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    ReaderPerformanceComponent,
    ReaderPerformanceSearchUserComponent,
    ReaderPerformanceResultsComponent,
    ReaderPerformanceResponseDetailsComponent,
    ReaderPerformanceSummaryComponent,
  ],
  providers: [
    ReaderPerformanceService
  ]
})
export class ReaderPerformanceModule {

}
