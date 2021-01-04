import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {UserExamService} from '../../../shared/services/user-exam.service';
import {ExamService} from '../../../shared/services/exam.service';
import {ActionType} from '../../../shared/models/action-type';
import {EventTypes} from '../../../shared/models/event-types.enum';
import { MatDialog } from '@angular/material/dialog';
import {DialogActionsComponent} from '../../../shared/dialog/dialog-actions/dialog-actions.component';
import DialogConfig from '../../../shared/models/dialog-config';
import {Question} from '../../../shared/models/question';
import {UserExam} from '../../../shared/models/user-exam';
import {Exam} from '../../../shared/models/exam';
import {Response} from '../../../shared/models/response';
import {UserExamStatus} from '../../../shared/models/user-exam-status';
import {NotificationsService} from 'angular2-notifications';
import {EventTrackingService} from '../../../shared/services/event-tracking.service';

import {Location} from '@angular/common';
import {RoutesRp} from '../../../shared/models/routes-rp';
import {CourseTimerComponent} from './course-timer/course-timer.component';

@Component({
  selector: 'app-course-navigation',
  templateUrl: 'course-navigation.component.html',
  styleUrls: ['./course-navigation.component.scss']
})
export class CourseNavigationComponent implements OnInit, OnDestroy {
  @Input() responses: Response[];
  @Input() allQuestionsAnswered: boolean = false;
  @Input() allQuestionsAnsweredCorrectly: boolean = false;
  @Input() postCourseEvaluationMode: boolean = false;
  @Input() previewMode: boolean = false;
  @Input() answerSubmitted: boolean = false;
  @Input() question: Question;
  @Input() questions: Question[];
  @Input() questionIndex: number = 0;
  @Input() totalQuestionCount: number;
  @Input() userExam: UserExam;
  @Input() selectedExam: Exam;
  @Input() revisitList: string[];
  @Output() changeQuestion = new EventEmitter();
  @Output() timeUp = new EventEmitter();
  @Output() viewCompleteCourse = new EventEmitter();

  currentQuestionIndexDisplayValue: number = 1;
  timerRef: any;

  @ViewChild(CourseTimerComponent) private courseTimerComponent: CourseTimerComponent;

  get elapsedSeconds(): number {
    return this.courseTimerComponent.elapsedSeconds;
  }

  constructor(private userExamService: UserExamService,
              private examService: ExamService,
              private router: Router,
              private dialog: MatDialog,
              private location: Location,
              private notificationsService: NotificationsService,
              private eventTrackingService: EventTrackingService) {
  }

  ngOnInit() {
    if (!this.userExam) {
      this.userExam = new UserExam();
    }
    this.currentQuestionIndexDisplayValue = (this.userExam.questions) ? this.userExam.questions.findIndex(q => q === this.question.id) : 1;
    this.currentQuestionIndexDisplayValue += 1;
    this.startTheSaveTimer();
  }

  ngOnDestroy() {
    clearInterval(this.timerRef);
    this.timerRef = undefined;
  }

  pauseOrStartTimer() {
    if (this.timerRef) {
      this.showPauseOrAbandonModal();
    } else {
      this.resumeTimer();
    }
  }

  resumeTimer() {
    if (!this.allQuestionsAnswered) {
      this.courseTimerComponent.resumeTime();
      this.startTheSaveTimer();
    }
  }

  showPauseOrAbandonModal() {
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Select an action',
        content: 'Would you like to <span class="bold">pause</span> or <span class="bold">abandon</span> this course?',
        actions: [ActionType.Abandon, ActionType.Pause]
      }
    ));
    ref.componentInstance.dialogResult.subscribe((action: ActionType) => {
      if (action === ActionType.Pause) {
        this.pauseCourse();
      } else if (action === ActionType.Abandon) {
        this.abandonCourse();
      }
      ref.close();
    });
  }

  pauseCourse() {
    this.pauseTimer();
    this.userExam.status = UserExamStatus.Paused;
    this.userExamService.save(this.userExam).subscribe(userExam => {
      this.notificationsService.info('Activity Paused', 'Your activity has been paused. It can be resumed at any time.');
      this.router.navigate([RoutesRp.Home]);
    });
  }

  pauseTimer(): number {
    this.userExam.elapsedSeconds = this.courseTimerComponent.pauseTime();
    clearInterval(this.timerRef);
    this.timerRef = undefined;
    return this.userExam.elapsedSeconds;
  }

  startTheSaveTimer() {
    if (this.userExam.id && !this.previewMode && !this.timerRef && !this.allQuestionsAnswered) {
      this.timerRef = setInterval(this.saveUserExamTime.bind(this), 10000);
    }
  }

  // TODO: the timer should work based off of timestamps on the user exam. All this time ref stuff is nonsense
  saveUserExamTime() {
    if (this.allQuestionsAnswered) {
      clearInterval(this.timerRef);
      this.timerRef = undefined;

    } else {
      if (this.timerRef && this.courseTimerComponent) {
        if (isNaN(this.courseTimerComponent.elapsedSeconds)) {
          this.courseTimerComponent.elapsedSeconds = 0;
        }
        this.userExam.elapsedSeconds = this.courseTimerComponent.elapsedSeconds;
        this.userExamService.saveTime(this.userExam).subscribe(); // Just fire and forget
      }
    }
  }

  abandonCourse() {
    this.userExam.status = UserExamStatus.Abandoned;
    this.userExamService.save(this.userExam).subscribe(userExam => {
      this.notificationsService.success('Activity Abandoned', 'Activity successfully abandoned');
      this.router.navigate([RoutesRp.Home]);
    });
  }

  endStudyMode() {
    this.abandonCourse();
    this.router.navigate([RoutesRp.Home]);
  }

  onNavigate(questionId?: string) {
    if (questionId === 'back') {
      this.eventTrackingService.trackEvent(EventTypes.navigateBackward, {userId: this.userExam.userId, userExam: this.userExam.id});
    } else if (questionId === 'next') {
      this.eventTrackingService.trackEvent(EventTypes.navigateForward, {userId: this.userExam.userId, userExam: this.userExam.id});
    } else {
      this.eventTrackingService.trackEvent(EventTypes.navigateToQuestion, {userId: this.userExam.userId, questionId: questionId, userExam: this.userExam.id});
    }
    this.changeQuestion.emit(questionId);
  }

  endPreview() {

    // iif we opened preview in a new window the length will be 1 and we should close the tab
    if (history.length === 1) {
      window.close();
    } else {
      this.location.back();
    }
  }

  onTimeUp() {
    this.timeUp.emit();
  }

  onViewCompleteCourse() {
    this.viewCompleteCourse.emit();
  }

  get getUniqueQuestionIds(): number {
    const questionIdArray = [];
    this.responses.forEach(res => {
      if (res.answerGiven && res.answerGiven[0].questionId) {
        res.answerGiven.forEach( answerGiven => {
          if (questionIdArray.indexOf(answerGiven.questionId) < 0) {
            questionIdArray.push(answerGiven.questionId);
          }
        });
      } else if (questionIdArray.indexOf(res.questionId) < 0) {
        questionIdArray.push(res.questionId);
      }
    });
    return questionIdArray.length;
  }

}
