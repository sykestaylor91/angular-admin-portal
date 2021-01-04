import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {QuestionService} from '../shared/services/question.service';
import { MatDialog } from '@angular/material/dialog';
import {AddRemoveDialogComponent} from '../add-remove-dialog/add-remove-dialog.component';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import {Question} from '../shared/models/question';
import {PermissionService} from '../shared/services/permission.service';
import {SessionService} from '../shared/services/session.service';
import {InputType} from '../shared/models/input-type';
import {RevealAnswerType} from '../shared/models/reveal-answer-type';
import {finalize} from 'rxjs/operators';
import Utilities from '../shared/utilities';
import {NotificationsService} from 'angular2-notifications';
import {EditQuestionDialogComponent} from '../shared/edit-question-dialog/edit-question-dialog.component';


import {ActivatedRoute, Router} from '@angular/router';
import {RoutesRp} from '../shared/models/routes-rp';


@Component({
  selector: 'app-serial-question-form',
  templateUrl: './serial-question-form.component.html'
})
export class SerialQuestionFormComponent implements OnInit {
  @Input() subComponent: boolean = false;
  @Input() editQuestion: Question;
  @Output() questionSave: EventEmitter<any> = new EventEmitter();
  stitle: string = 'Create SAQ question';
  cryptoKey: string;
  dataType: any;
  reviewDate: FormControl;
  notes: any;
  type: any;
  public question: FormControl;
  serialQuestions: any[] = [];
  serialQuestionsFormGroup: FormGroup;
  InputType = InputType;
  RevealAnswerType = RevealAnswerType;
  form: any;
  public userRef: FormControl;
  public title: FormControl;
  public intro: FormControl;
  public discussion: FormControl;
  public keywords: FormControl;
  hideNever = false;
  hideStudy = false;
  showSpinner = false;

  formSubmitted: Boolean = false;
  selectedQuestion: Question;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private questionService: QuestionService,
              private permissionService: PermissionService,
              private notificationsService: NotificationsService,
              private dialog: MatDialog,
              private sessionService: SessionService) {

    this.cryptoKey = Utilities.cryptoKey;
  }

  ngOnInit() {

    this.route.data.subscribe((data: { question?: Question }) => {
      this.questionService.selectedQuestion = data.question || new Question();
      this.selectedQuestion = this.questionService.selectedQuestion;
      if (data.question && data.question.id) {
        this.stitle = 'Edit nested question';
      }
      this.getSerialQuestions(this.selectedQuestion.serialQuestions);
    });

    // this.question = this.selectedQuestion || new Question();

    this.initializeForm();
    // this.getSerialQuestions(this.serialQuestions);

  }

  initializeForm() {
    this.serialQuestionsFormGroup = new FormGroup({
      questions: new FormControl(this.serialQuestions),
      question: new FormControl(this.selectedQuestion.question, [
        Validators.required
      ]),
      userRef: new FormControl(this.selectedQuestion.userRef),
      title: new FormControl(this.selectedQuestion.title),
      discussion: new FormControl(this.selectedQuestion.discussion),
      intro: new FormControl(this.selectedQuestion.intro),
      keywords: new FormControl(this.selectedQuestion.keywords),
      reviewDate: new FormControl(this.selectedQuestion.reviewDate)
    });
  }

  onDropSuccess(question) {
    this.serialQuestionsFormGroup.get('questions').setValue(this.serialQuestions.map(q => q.id));
  }

  saveChanges() {
    console.log('saveChanges called');
    this.formSubmitted = true;
    if (this.serialQuestionsFormGroup.valid) {
        this.questionService.save(this.constructQuestion()).subscribe(data => {
          if (this.questionService)  {
            this.questionService.selectedQuestion = null;
          }
          this.finaliseSave(data);
        });
    } else {
      this.errorMessage(this.serialQuestionsFormGroup.controls);
    }
  }

  finaliseSave(data) {
    this.selectedQuestion = data;
    this.formSubmitted = false;
    this.notificationsService.success('Success', 'Question saved successfully');
    if (this.stitle === 'Create group question') {
      this.stitle = 'Edit group question';
      if ( !this.subComponent) {
        history.replaceState('NowCE Admin Portal', 'nowce.com', `serial-question/form/${this.selectedQuestion.id}`);
      }
    }
  }

  errorMessage(controls) {
    let errors = '';
    if (controls.question.value === '') {
      errors = errors + 'Question text is required. ';
    }
    if (errors === '') {
      errors =  errors + 'Please check all required fields have been entered.';
    }
    this.notificationsService.error('Form Invalid', errors);
  }

  constructQuestion() {
    const newQuestion = new Question();
    if (this.selectedQuestion) {
      newQuestion.id = this.selectedQuestion.id;
    }
    newQuestion.title = this.serialQuestionsFormGroup.controls.title.value;
    newQuestion.question = this.serialQuestionsFormGroup.controls.question.value;
    newQuestion.keywords = this.serialQuestionsFormGroup.controls.keywords.value;

    // newQuestion.levelOfDifficulty = this.levelOfDifficulty.value;
    // newQuestion.citation = this.citation.value;
    // newQuestion.discussion = this.discussion.value;
    newQuestion.serialQuestions = this.formIdArray(this.serialQuestions);
    newQuestion.status = 'draft'; // TODO: get value from form input - released yes/no
    newQuestion.userId = this.selectedQuestion.userId || this.sessionService.loggedInUser.id; // TODO: first part doesnt look right ...
    newQuestion.userRef = this.serialQuestionsFormGroup.controls.userRef.value;
    newQuestion.dataType = this.dataType;
    newQuestion.reviewDate = this.serialQuestionsFormGroup.controls.reviewDate.value;
    newQuestion.intro = this.serialQuestionsFormGroup.controls.intro.value;
    newQuestion.discussion = this.serialQuestionsFormGroup.controls.discussion.value;
    newQuestion.notes = this.notes;
    newQuestion.type = 'serial';
    newQuestion.comments = this.selectedQuestion.comments;
    return newQuestion;
  }

  formIdArray(serialQuestions) {
    const idArray = [];
    serialQuestions.forEach(sq => {
      idArray.push(sq.id);
    });
    return idArray;
  }

  openAddRemoveDialog() {
    const dialogRef = this.dialog.open(AddRemoveDialogComponent, {
      height: '80%',
      width: '80%',
      data: {
        courseQuestions: this.serialQuestions || [],
        type: 'serialQuestion'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      this.serialQuestionsFormGroup.get('questions').setValue(this.serialQuestions.map(question => question.id));
    });
  }

  openPreviewQuestion(qId) {
    window.open(`${RoutesRp.ActivityQuestionPreview}/${qId}`);
  }

  openQuestionNewWindow(question) {
    window.open(`/question-form/${question.id}`);
  }

  previewQuestionClickHandler() {
    if (this.serialQuestionsFormGroup.valid) {
        this.questionService.save(this.constructQuestion()).subscribe(data => {

          if (this.subComponent) {
            this.selectedQuestion = data;
            this.formSubmitted = false;
            window.open(`${RoutesRp.ActivityQuestionPreview}/${this.selectedQuestion.id}`);
          } else {
            this.finaliseSave(data);
            this.router.navigate([RoutesRp.ActivityQuestionPreview, this.selectedQuestion.id]);
          }
        });
    } else {
      this.errorMessage(this.serialQuestionsFormGroup.controls);
    }
  }

  openEditQuestionDialog(question) {
    const dialogRef = this.dialog.open(EditQuestionDialogComponent, {
      height: '80%',
      width: '80%',
      data: {
        question: question,
        serialQuestions: this.serialQuestions
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result && result.questionSaved) {
        this.notificationsService.success('Success' , 'Question successfully saved.');
      }
    });
  }

  getSerialQuestions(questions) {
    if (questions && questions.length > 0) {
      this.showSpinner = true;
      // TODO: remove this timing and fetch the questions in the correct order using query with an array of values
      const interval = 200; // how much time should the delay between two iterations be (in milliseconds)?
      questions.forEach((question, index) => {
        this.questionService.findById(question)
          .pipe(finalize(() => this.showSpinner = false))
          .subscribe(questionData => {
            const that = this;
            setTimeout(function () {
              that.serialQuestions.push(questionData);
            }, index * interval);
          });
      });
    }
  }

  removeQuestionClickHandler(question) {
    for (let i = this.serialQuestions.length - 1; i >= 0; i--) {
      if (this.serialQuestions[i].id === question) {
        this.serialQuestions.splice(i, 1);
      }
    }

    this.serialQuestionsFormGroup.get('questions').setValue(this.serialQuestions.map(q => q.id));
  }
}
