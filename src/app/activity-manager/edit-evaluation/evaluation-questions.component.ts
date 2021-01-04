import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {Location} from '@angular/common';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {EvaluationService} from '../../shared/services/evaluation.service';
import {SessionService} from '../../shared/services/session.service';
import {Evaluation} from '../../shared/models/evaluation';
import {NotificationsService} from 'angular2-notifications';
import {ActivityStatus} from '../../shared/models/activity-status';
import {ExamType} from '../../shared/models/exam-type';

@Component({
  selector: 'app-evaluation-questions',
  templateUrl: 'evaluation-questions.component.html'
})
export class EvaluationQuestionsComponent implements OnInit, OnDestroy {
  showSpinner: boolean;
  ptitle: string = 'Create post-activity evaluation';
  title: FormControl;
  evaluationSubtitle: FormControl;
  evaluationIntroduction: FormControl;
  selectedEvaluation: Evaluation = new Evaluation();
  courseQuestions: any[];
  comments: any;
  form: FormGroup;

  constructor(private evaluationService: EvaluationService,
              private sessionService: SessionService,
              private notificationsService: NotificationsService,
              private router: Router,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private location: Location) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.ptitle = 'Edit post activity evaluation';
        this.evaluationService.findById(id).subscribe(selectedEvaluation => {
          this.selectedEvaluation = selectedEvaluation;
          if (this.selectedEvaluation.questions) {
            this.courseQuestions = this.selectedEvaluation.questions;
          }
          this.createForm(this.selectedEvaluation);
        });
      } else {
        this.createForm(this.selectedEvaluation);
      }
    });
  }

  createForm(selectedEvaluation: Evaluation) {
    this.title = new FormControl(selectedEvaluation.title, [Validators.required]);
    this.evaluationSubtitle = new FormControl(selectedEvaluation.subtitle, [Validators.required]);
    this.evaluationIntroduction = new FormControl(selectedEvaluation.introduction, [Validators.required]);

    this.form = this.formBuilder.group({
      title: this.title,
      evaluationSubtitle: this.evaluationSubtitle,
      evaluationIntroduction: this.evaluationIntroduction
    });
  }

  ngOnDestroy() {
    this.selectedEvaluation = null;
    this.courseQuestions = [];
  }

  removeCourseClickHandler(question) {
    for (let i = this.courseQuestions.length - 1; i >= 0; i--) {
      if (this.courseQuestions[i].id === question) {
        this.courseQuestions.splice(i, 1);
      }
    }
  }

  saveClickHandler() {
    const newEvaluation = new Evaluation();
    newEvaluation.questions = this.courseQuestions;
    newEvaluation.title = this.title.value;
    newEvaluation.subtitle = this.evaluationSubtitle.value;
    newEvaluation.userId = this.sessionService.loggedInUser.id;
    newEvaluation.type = ExamType.PostActivity;
    newEvaluation.introduction = this.evaluationIntroduction.value;
    newEvaluation.comments = this.selectedEvaluation.comments;
    if (this.selectedEvaluation) {
      newEvaluation.id = this.selectedEvaluation.id;
    }
    this.evaluationService.save(newEvaluation).subscribe(data => {
      this.notificationsService.success('Success', 'Post-activity evaluation saved successfully');
      history.replaceState('NowCE', 'nowce.com', `activity-manager/evaluation/edit/${data.id}`);
    });
  }

  cancelClickHandler() {
    this.location.back();
  }
}
