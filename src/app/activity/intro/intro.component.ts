import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {PreActivityInformationContentComponent} from '../../shared/pre-activity-information/pre-activity-information-content.component';
import DialogConfig from '../../shared/models/dialog-config';
import { MatDialog } from '@angular/material/dialog';
import {UserExamService} from '../../shared/services/user-exam.service';
import {QuestionService} from '../../shared/services/question.service';
import {ExamMode, ResolvedUserExam, UserExam} from '../../shared/models/user-exam';
import {Question} from '../../shared/models/question';
import {RoutesRp} from '../../shared/models/routes-rp';
import {NotificationsService} from 'angular2-notifications';
import {Exam} from '../../shared/models/exam';

@Component({
  selector: 'app-activity-preview',
  templateUrl: 'intro.component.html',
})
export class IntroComponent implements OnInit {
  showLoading: boolean = false;
  selectedExam: Exam;
  userExam: UserExam;
  questions: Question[] = [];
  examModeLabel: ExamMode = ExamMode.Normal;

  STUDY_MODE = 'study';
  EXAM_MODE = 'exam';


  get previewMode()  {
  // true if preview requested in activity editor through preview route
    return (this.examModeLabel === ExamMode.Preview);
  }

  get resumeMode(): boolean {
    return (this.examModeLabel === ExamMode.Resume);
  }

  get getExamRestartLabel(): string {
    switch (this.examModeLabel) {
      case ExamMode.Normal:
        return 'Take activity';
      case ExamMode.Retake:
        return 'Retake activity';
      case ExamMode.Resume:
        return 'Resume activity';
    }
    return 'Take activity';
  }

  constructor(private dialog: MatDialog
    , private notificationsService: NotificationsService
    , private route: ActivatedRoute
    , private location: Location
    , private router: Router
    , private userExamService: UserExamService
    , private questionService: QuestionService
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { resolvedUserExam?: ResolvedUserExam }) => {

      this.selectedExam = data.resolvedUserExam.exam;
      this.userExam = data.resolvedUserExam.userExam;
      this.examModeLabel = data.resolvedUserExam.examModeLabel;

      this.getQuestions(this.userExam.questions);
    });
  }

  goBack() {
    this.location.back();
  }

  startExam( mode: string ) {
    if (this.examModeLabel === ExamMode.Preview) {
      return this.router.navigate([RoutesRp.ActivityQuestionsPreview, this.userExam.examId]);
    } else if (this.examModeLabel === ExamMode.Retake) {
      this.notificationsService.info('', `You have chosen to retake this activity. Please note that ` +
        `retaking this activity is only to satisfy a learning or revision need. Credits are not awarded for retaking ` +
        `an activity or a question from that activity.`);
    }

    let startResumeActivityObs;

    if (this.examModeLabel === ExamMode.Resume) {
      startResumeActivityObs = this.userExamService.resume(this.userExam);
    } else {
      if (mode === this.EXAM_MODE && this.selectedExam.examModeAllowed === true) {
        this.userExam.examMode = true;

      } else if (mode === this.EXAM_MODE && this.selectedExam.examModeAllowed === false) {
        throw new Error('Exam Mode is not available for selected activity');

      } else if (mode === this.STUDY_MODE && this.selectedExam.studyModeAllowed === true) {
        this.userExam.studyMode = true;

      } else if (mode === this.STUDY_MODE && this.selectedExam.studyModeAllowed === false) {
        throw new Error('Study Mode is not available for selected activity');
      } else {
        // TODO: this ignores if normalModeAllowed=false
        this.userExam.normalMode = true;
      }
      startResumeActivityObs = this.userExamService.startExam(this.userExam);
    }

    startResumeActivityObs.subscribe((userExam: UserExam) => {
      if (userExam && userExam.id) {
        this.router.navigate([RoutesRp.ActivityQuestions, userExam.id]);
      } else {
        this.notificationsService.error(`An error occurred trying ` +
          `to ${this.examModeLabel === ExamMode.Resume ? 'resume' : 'start'} this activity.`);
      }
    });
  }

  displayReadMoreClickHandler() {
    const dialogData = DialogConfig.largeDialogBaseConfig({
      content: this.selectedExam,
      title: 'About this activity',
      actions: []
    });
    this.dialog.open(PreActivityInformationContentComponent, dialogData);
  }

  getQuestions(questions) {
    const interval = 100; // how much time should the delay between two iterations be (in milliseconds)?
    this.questions = [];
    questions.forEach((question, index) => {
      this.questionService.findById(question)
        .subscribe(questionData => {
          this.questions.push(questionData);
        });
    });
  }

  get getFullQuestionCount(): number {
    let count = 0;
    this.questions.forEach(question => {
      if (question.serialQuestions && question.serialQuestions.length > 0) {
        count += question.serialQuestions.length;
      } else {
        count++;
      }
    });
    return count;
  }
}
