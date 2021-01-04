import {Component, OnDestroy, ViewChild} from '@angular/core';

import {CoursePerformanceService} from './course-performance.service';
import {CoursePerformanceSummaryComponent} from './summary/course-performance-summary.component';
import {CoursePerformanceQuestionResponseComponent} from './question-response/question-response.component';
import {CoursePerformanceEvaluationReportComponent} from './evaluation-report/evaluation-report.component';

@Component({
  selector: 'app-course-performance',
  templateUrl: 'course-performance.component.html'
})
export class CoursePerformanceComponent implements OnDestroy {
  title: string = 'Activity metrics';


  @ViewChild(CoursePerformanceSummaryComponent) childSummaryComponent: CoursePerformanceSummaryComponent;
  @ViewChild(CoursePerformanceQuestionResponseComponent) childQuestionResponsesComponent: CoursePerformanceQuestionResponseComponent;
  @ViewChild(CoursePerformanceEvaluationReportComponent) childEvaluationReportComponent: CoursePerformanceEvaluationReportComponent;

  constructor(private coursePerformanceService: CoursePerformanceService) {
  }

  ngOnDestroy() {
    this.coursePerformanceService.userExam = null;
    this.coursePerformanceService.questionStatistics = [];
    this.coursePerformanceService.evaluationReport = [];
  }

  setSummary(event) {
    this.childSummaryComponent.getSummaryData();
  }

  loadQuestionResponses(event) {
    this.childQuestionResponsesComponent.getQuestionResponses();
    this.childEvaluationReportComponent.constructEvaluationReport();
  }

}
