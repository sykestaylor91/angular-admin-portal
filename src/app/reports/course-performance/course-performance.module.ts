import {NgModule} from '@angular/core';


import {CoursePerformanceComponent} from './course-performance.component';
import {CoursePerformanceSearchContributorsComponent} from './search-contributors/search-contributors.component';
import {CoursePerformanceQuestionResponseComponent} from './question-response/question-response.component';
import {CoursePerformanceEvaluationReportComponent} from './evaluation-report/evaluation-report.component';
import {CoursePerformanceSummaryComponent} from './summary/course-performance-summary.component';
import {CoursePerformanceService} from './course-performance.service';
import {BrowserModule} from '@angular/platform-browser';
import {SharedModule} from '../../shared/shared.module';
import {ChartModule} from 'primeng/chart';
import {TableModule} from 'primeng/table';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule} from '@angular/forms';


@NgModule({
  imports: [
    BrowserModule,
    ChartModule,
    TableModule,
    FormsModule,
    MaterialModule,
    SharedModule,
  ],
  declarations: [
    CoursePerformanceComponent,
    CoursePerformanceSearchContributorsComponent,
    CoursePerformanceQuestionResponseComponent,
    CoursePerformanceEvaluationReportComponent,
    CoursePerformanceSummaryComponent
  ],
  providers: [
    CoursePerformanceService
  ]
})
export class CoursePerformanceModule {

}
