import {Component, Output, EventEmitter, OnInit} from '@angular/core';

import {ExamService} from '../../../shared/services/exam.service';
import {CoursePerformanceService} from '../course-performance.service';
import {ActivityStatus} from '../../../shared/models/activity-status';
import {Exam} from '../../../shared/models/exam';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-search-contributors',
  templateUrl: './search-contributors.component.html'
})
export class CoursePerformanceSearchContributorsComponent implements OnInit {
  title: string = 'Search';
  exams: Exam[];
  selectedCourse: string;
  searchTerm: string;
  searchCourseId: string;

  @Output() setSummary = new EventEmitter();

  constructor(private examService: ExamService,
              private notificationsService: NotificationsService,
              private coursePerformanceService: CoursePerformanceService,
              private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getExams();
    if (this.route.snapshot.paramMap.get('activityId')) {
      this.searchCourseId = this.route.snapshot.paramMap.get('activityId');
      this.submitQuery();
    }
  }

  getExams() {
    this.examService.getExams().subscribe((data: Exam[]) => {
      this.exams = data.filter(e => e.status === ActivityStatus.Published);
    });
  }

  submitQuery() {
    this.coursePerformanceService.userExam = null;
    // TODO: onclick make question-response and evaluation-report components set all saved values to null
    if (this.selectedCourse) {
      this.examService.findById(this.selectedCourse).subscribe(data => {
        this.coursePerformanceService.setSelectedExam(data);
        this.setSummary.emit(null);
      });
    } else if (this.searchTerm) {
      this.examService.findByExamTitleSubtitle(this.searchTerm).subscribe(data => {
        this.coursePerformanceService.setSelectedExam(data);
        this.setSummary.emit(null);
      });
    } else if (this.searchCourseId) {
      this.examService.findById(this.searchCourseId).subscribe(data => {
        this.coursePerformanceService.setSelectedExam(data);
        this.setSummary.emit(null);
      });
    } else {
      this.notificationsService.error('No search term', 'Please enter a search term and try again');
    }
  }
}
