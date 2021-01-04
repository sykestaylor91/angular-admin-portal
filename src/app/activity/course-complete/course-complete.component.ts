import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {Exam} from '../../shared/models/exam';
import {UserExamService} from '../../shared/services/user-exam.service';
import {UserExam} from '../../shared/models/user-exam';
import {UserExamStatus} from '../../shared/models/user-exam-status';
import {NotificationsService} from 'angular2-notifications';
import {RoutesRp} from '../../shared/models/routes-rp';
import {Router} from '@angular/router';
import { UserEvaluation } from '../../shared/models/user-evaluation';

@Component({
  selector: 'app-course-complete',
  templateUrl: 'course-complete.component.html'
})
export class CourseCompleteComponent implements OnInit {
  @Input() postCourseCompletedUserEvaluation: boolean = false;
  @Input() previewMode: boolean = false;
  @Input() showCertificate: boolean = false;
  @Input() selectedExam: Exam;
  @Input() userExam: UserExam;
  @Input() allAnsweredCorrectly: boolean = false;
  @Output() retakeCompletedCourse = new EventEmitter();

  title = 'End of Activity';
  disclosures: any = [];
  userExamSubmitted: boolean = false;
  userEvaluation: UserEvaluation = null;
  userEvaluationSubmitted: boolean = false;

  constructor(private notificationsService: NotificationsService
    , private userExamService: UserExamService
    , private router: Router) {
  }

  ngOnInit() {
    if (!this.userExam.retakeAttempts) {
      this.userExam.retakeAttempts = 0;
    }
  }

  tryMissedOrIncorrectAnswers() {
    this.userExam.retakeAttempts++;
    this.retakeCompletedCourse.emit();
  }

  submitUserExam() {
    this.userExam.status = UserExamStatus.Completed;
    this.userExamService.save(this.userExam)
      .subscribe(userExam => {
        this.notificationsService.success('Exam saved.');
        this.userExamSubmitted = true;

        if (!this.showPostEvaluation && !this.hasCertificate) {
          this.goToDashboard();
        }
      });
  }

  onPostCourseEvaluationSubmitted(userEvaluation: UserEvaluation) {
    this.userEvaluation = userEvaluation;
    this.userEvaluationSubmitted = true;

    this.userExam.userEvaluationId = userEvaluation.id;
    this.userExamService.save(this.userExam)
      .subscribe(userExam => {
        this.notificationsService.success('Exam saved.');
      });
  }

  goToDashboard() {
    this.router.navigate([RoutesRp.Home]);
  }

  get showPostEvaluation(): boolean {
    return (this.selectedExam.postActivityEvaluation !== null && this.userExam.isRetake === false);
  }

  get hasCertificate(): UserEvaluation {
    // userEvaluation also required by certificate component!
    return this.selectedExam.certificate && this.userEvaluation;
  }

  get retakeAvailable(): boolean {
    if (this.selectedExam && this.selectedExam.maxAnswerAttempts.toString() === 'Unlimited' && this.userExam.normalMode && !this.allAnsweredCorrectly) {
      return true;
    } else {
      return this.userExam && this.userExam.normalMode && (this.userExam.retakeAttempts < this.selectedExam.maxAnswerAttempts) && !this.allAnsweredCorrectly;
    }
  }
}
