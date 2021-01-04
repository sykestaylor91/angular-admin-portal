import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormArray,
  Validators, FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';
import { NotificationsService } from 'angular2-notifications';
import { Question } from '../shared/models/question';
import { SessionService } from '../shared/services/session.service';
import { QuestionService } from '../shared/services/question.service';
import { QuestionManagerService } from '../shared/services/question-manager.service';
import { FormUtilities } from '../shared/helpers/form-utilities';
import { FormsManagementDirective } from '../shared/helpers/forms.management.directive';
import { PermissionService } from '../shared/services/permission.service';
import Utilities from '../shared/utilities';
import { AnswerOption } from '../shared/models/answer-option';
import { RoutesRp } from '../shared/models/routes-rp';
import { InputType } from '../shared/models/input-type';
import * as questionTags from '../../assets/data/question-tags.json';
import { TagGroup } from '../../app/shared/models/question-tag';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html'
})
export class QuestionFormComponent extends FormsManagementDirective implements OnInit, OnDestroy {
  @Input() subComponent: boolean = false;
  @Input() editQuestion: Question;
  @Input() type: string;
  @Output() questionSave: EventEmitter<any> = new EventEmitter();

  stitle: string = (this.editQuestion) ? 'Edit question' : 'Create question';
  selectedQuestion: Question;

  comments: any;
  public myQuestionTags: TagGroup[] = (questionTags as any).default;
  tagSearchResults: string[] = [];
  InputType = InputType;

  public cryptoKey: string;
  public correctAnswer: any;

  // form
  public systemReference: FormControl;
  public userRef: FormControl;
  public title: FormControl;
  public questionFormat: FormControl;
  public intro: FormControl;
  public levelOfDifficulty: FormControl;
  public question: FormControl;
  public keywords: FormControl;
  public dataType: FormControl;
  public discussion: FormControl;
  public citation: FormControl;
  public notes: FormControl;
  public reviewDate: FormControl;
  public answers: FormArray;
  public answerRadio: FormControl;
  public availableMarks: FormControl;
  public tags: string[] = [];

  formSubmitted: Boolean = false;
  allExpanded: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private questionService: QuestionService,
    private formBuilder: FormBuilder,
    private questionManagerService: QuestionManagerService,
    private notificationsService: NotificationsService,
    private location: Location,
    private permissionService: PermissionService) {
    super(permissionService);
    this.cryptoKey = Utilities.cryptoKey;
  }

  async ngOnInit() {
    if (this.editQuestion) {
      this.selectedQuestion = this.editQuestion;
    } else {
      this.route.data.subscribe((mydata: { question?: Question }) => {
        this.questionService.selectedQuestion = mydata.question || new Question();
        this.selectedQuestion = this.questionService.selectedQuestion;
      });
    }
    if (!this.selectedQuestion.tags) {
      this.selectedQuestion.tags = [];
    }
    this.createForm(this.selectedQuestion);
    if (this.selectedQuestion) {
      if (this.selectedQuestion.id) {
        this.stitle = 'Edit question';
      }
      if (this.selectedQuestion.answers) {
        this.selectedQuestion.answers.forEach((answer) => {
          const answerOption: AnswerOption = Utilities.parseAnswerOption(answer);
          this.addAnswerOption(answerOption.text, answerOption.correct);
        });
      }
    }
    this.formConfig();
    this.showSpinner = false;
  }

  formConfig() {
    if ((this.questionManagerService.formConfig === 'normal' || this.selectedQuestion.type === 'normal') && this.type !== 'evaluation' ) {
      this.normalQuestionConfiguration();
    } else if (this.questionManagerService.formConfig === 'precourse') {
      this.preCourseQuestionConfiguration();
    } else {
      this.postCourseEvaluationConfiguration();
    }
  }

  // checkQuestionFormat() {
  //   if (!this.selectedQuestion.evidence && !this.selectedQuestion.levelOfDifficulty && !this.selectedQuestion.keywords
  //     && !this.selectedQuestion.discussion && !this.selectedQuestion.intro && !this.selectedQuestion.notes
  //     && !this.selectedQuestion.reviewDate) {
  //     this.postCourseEvaluationConfiguration();
  //   }
  // }

  ngOnDestroy() {
    this.selectedQuestion = undefined;
    this.questionService.selectedQuestion = new Question();
  }

  encryptAnswer(answer, cryptoKey) {
    return CryptoJS.AES.encrypt(answer, cryptoKey).toString();
  }

  createForm(question: Question) {
    this.systemReference = new FormControl({ value: question.id, disabled: true }, []);
    this.userRef = new FormControl(question.userRef, []);
    this.title = new FormControl(question.title, []);
    this.intro = new FormControl(question.intro, []);
    this.levelOfDifficulty = new FormControl(question.levelOfDifficulty, [FormUtilities.selectValidator, Validators.required]);
    this.question = new FormControl(question.question, [
      Validators.required
    ]);
    this.keywords = new FormControl(question.keywords, []);
    this.dataType = new FormControl(question.dataType, []);
    this.discussion = new FormControl(question.discussion, []);
    this.citation = new FormControl(question.citation, []);
    this.notes = new FormControl(question.notes, []);
    this.reviewDate = new FormControl(question.reviewDate, []);
    this.answers = this.formBuilder.array([]);
    this.comments = new FormControl(question.comments);
    this.availableMarks = new FormControl(question.availableMarks, Validators.min(1));
    this.tags = question.tags;

    this.form = this.formBuilder.group({
      systemReference: this.systemReference,
      userRef: this.userRef,
      title: this.title,
      questionFormat: this.questionFormat,
      intro: this.intro,
      levelOfDifficulty: this.levelOfDifficulty,
      question: this.question,
      keywords: this.keywords,
      dataType: this.dataType,
      discussion: this.discussion,
      citation: this.citation,
      notes: this.notes,
      reviewDate: this.reviewDate,
      answers: this.answers,
      comments: question.comments,
      answerRadio: this.answerRadio,
      availableMarks: this.availableMarks
    });
  }

  correctControlChangeHandler(e, control) {
    if (this.dataType.value === 'singleChoice') {
      this.correctAnswer = e;
    }
  }

  createAnswer(text: string, correct: boolean, id) {
    const control = <FormArray>this.form.controls['answers'];
    const correctControl = new FormControl(correct, []);
    if (this.dataType.value === 'singleChoice' && correct) {
      this.correctAnswer = id;
    }

    correctControl.valueChanges.subscribe((e) => {
      this.correctControlChangeHandler(e, correctControl);
    });

    return new FormGroup({
      id: new FormControl([id]),
      text: new FormControl(text, [Validators.required]),
      correct: correctControl,
      index: new FormControl(control.value.length)
    });

  }

  addAnswerOption(text = '', correct = false, id?) {
    const control = this.answers;
    control.push(this.createAnswer(text, correct, control.value.length));
    if (control.value.length > 0) {
      this.dataType.disable();
    }

  }

  removeAnswer(i: number) {
    const control = <FormArray>this.form.controls['answers'];
    control.removeAt(i);
    // if the answer options length is 0, display the radio button again for type
    if (control.value.length === 0) {
      this.dataType.enable();
    }
  }

  saveChanges() {
    this.formSubmitted = true;
    if (this.form.valid) {
      this.formSubmitted = false;
      this.questionService.save(this.constructQuestion()).subscribe(mydata => {
        // TODO: remove this
        if (this.selectedQuestion) {
          this.questionService.selectedQuestion = null;
        }
        this.finaliseSave(mydata);
        //          if (!this.subComponent && !this.editQuestion) {
        //            this.navigateBack();
        //          }
      }, err => {
        this.notificationsService.error(err);
        console.error(err);
      });
    } else {
      this.errorMessage(this.form.controls);
    }
  }

  finaliseSave(mydata) {
    this.selectedQuestion = mydata;
    this.notificationsService.success('Success', 'Question saved successfully');
    this.questionSave.emit(mydata); // This emits the saved question to a parent component
    if (this.stitle === 'Create question') {
      this.stitle = 'Edit question';
      if (!this.subComponent) {
        history.replaceState('NowCE Admin Portal', 'nowce.com', `question-form/${this.selectedQuestion.id}`);
      }
    }
  }

  navigateBack() {
    const type = this.selectedQuestion.type || this.questionManagerService.formConfig;
    switch (type) {
      case 'normal':
        this.router.navigate(['/question-manager/list/activity']);
        break;
      case 'precourse':
        this.router.navigate(['/question-manager/list/pre-activity']);
        break;
      case 'evaluation':
        this.router.navigate(['/question-manager/list/post-activity']);
        break;
      default:
        this.location.back();
    }
  }

  constructQuestion() {
    const newQuestion = new Question();
    if (this.selectedQuestion && this.selectedQuestion.id) {
      newQuestion.id = this.selectedQuestion.id;
    }
    newQuestion.title = this.title.value;
    newQuestion.question = this.question.value;
    newQuestion.keywords = this.keywords.value;
    newQuestion.levelOfDifficulty = this.levelOfDifficulty.value;
    newQuestion.citation = this.citation.value;
    newQuestion.discussion = this.discussion.value;
    newQuestion.answers = this.constructAnswers();
    newQuestion.status = 'draft'; // TODO: get value from form input - released yes/no
    newQuestion.userId = this.selectedQuestion.userId || this.sessionService.loggedInUser.id; // TODO: first part doesnt look right ...
    newQuestion.userRef = this.userRef.value;
    newQuestion.dataType = this.dataType.value;
    newQuestion.reviewDate = this.reviewDate.value;
    newQuestion.intro = this.intro.value;
    newQuestion.notes = this.notes.value;
    newQuestion.type = this.type || 'normal';
    newQuestion.comments = this.selectedQuestion.comments;
    newQuestion.availableMarks = this.availableMarks.value;
    newQuestion.tags = this.tags;
    return newQuestion;
  }

  constructAnswers() {
    const questionAnswers = [];
    const encryptAnswer = this.encryptAnswer;
    const cryptoKey = this.cryptoKey;
    if (this.dataType.value === 'singleChoice') {
      this.form.controls.answers.value.forEach((answer) => {
        answer.correct = (parseInt(answer.index, 10) === parseInt(this.correctAnswer, 10));
        questionAnswers.push(encryptAnswer(JSON.stringify(answer), cryptoKey));
      });
    } else {
      this.form.controls.answers.value.forEach((answer) => {
        questionAnswers.push(encryptAnswer(JSON.stringify(answer), cryptoKey));
      });
    }
    return questionAnswers;
  }

  errorMessage(controls) {
    let errors = '';
    if (controls.question.value === '') {
      errors = errors + 'Question text is required. ';
    }
    if (controls.levelOfDifficulty.value === 'pleaseSelect') {
      errors = errors + 'Level of difficulty is required';
    }
    if (errors === '') {
      errors = errors + 'Please check all required fields have been entered.';
    }
    this.notificationsService.error('Form Invalid', errors);
  }

  preCourseQuestionConfiguration() {
    this.type = 'precourse';
    this.form.controls['levelOfDifficulty'].setValidators([]);
    this.form.controls['levelOfDifficulty'].updateValueAndValidity();
  }

  postCourseEvaluationConfiguration() {
    console.log('***** set as evaluation...');
    this.type = 'evaluation';
    this.form.controls['levelOfDifficulty'].setValidators([]);
    this.form.controls['levelOfDifficulty'].updateValueAndValidity();
  }

  normalQuestionConfiguration() {
    this.type = 'normal';
    this.form.controls['levelOfDifficulty'].setValidators([]);
    this.form.controls['levelOfDifficulty'].updateValueAndValidity();
  }

  previewQuestionClickHandler() {
    // what is this todo?
    // TODO Property 'answers' does not exist on type '{ [key: string]: AbstractControl; }'.
    this.questionService.save(this.constructQuestion()).subscribe(mydata => {
      this.selectedQuestion = mydata;
      this.questionSave.emit(mydata); // This emits the saved question to a parent component
      if (this.subComponent) {
        window.open(`${RoutesRp.ActivityQuestionPreview}/${this.selectedQuestion.id}`);
      } else {
        this.router.navigate([RoutesRp.ActivityQuestionPreview, this.selectedQuestion.id]);
      }
    });
  }

  listOptionChange(tag: string) {
    if (this.tags.indexOf(tag) > -1) {
      this.removeTag(tag);
    } else {
      this.tags.push(tag);
    }
  }

  removeTag(tag: string) {
    if (this.tags.indexOf(tag) > -1) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    }
  }

  toggleExpandCollapseAll() {
    this.allExpanded = !this.allExpanded;
    this.myQuestionTags.forEach(group => {
      group.open = this.allExpanded;
      if (group.SubGroups) {
        group.SubGroups.forEach(subGroup => {
          subGroup.open = this.allExpanded;
        });
      }
    });
  }

  // TODO sanitise inputted data
  updateTagSearchResults(event) {
    this.tagSearchResults = [];
    if (!event.target.value) {
      return;
    }
    this.myQuestionTags.forEach(group => {
    if (group.Tags) {
      this.tagSearchResults = this.tagSearchResults.concat(group.Tags.filter(tag => tag.toLowerCase().includes(event.target.value.toLowerCase())));
    }
    if (group.SubGroups) {
      group.SubGroups.forEach(subGroup => {
        this.tagSearchResults = this.tagSearchResults.concat(subGroup.Tags.filter(tag => tag.toLowerCase().includes(event.target.value.toLowerCase())));
      });
    }
    });
  }
}
