import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {QuestionService} from '../../../shared/services/question.service';
import { MatDialog } from '@angular/material/dialog';
import {Exam} from '../../../shared/models/exam';
import {AddRemoveDialogComponent} from '../../../add-remove-dialog/add-remove-dialog.component';
import {FormsManagementDirective} from '../../../shared/helpers/forms.management.directive';
import {FormControl, FormGroup} from '@angular/forms';
import {Question} from '../../../shared/models/question';
import {PermissionService} from '../../../shared/services/permission.service';
import {InputType} from '../../../shared/models/input-type';
import {RevealAnswerType} from '../../../shared/models/reveal-answer-type';
import {ExamType} from '../../../shared/models/exam-type';
import {finalize} from 'rxjs/operators';
import Utilities from '../../../shared/utilities';
import { EditQuestionDialogComponent } from '../../../shared/edit-question-dialog/edit-question-dialog.component';
import {RoutesRp} from '../../../shared/models/routes-rp';

@Component({
  selector: 'app-course-questions',
  styleUrls: ['./course-questions.component.scss'],
  templateUrl: 'course-questions.component.html',
})
export class CourseQuestionsComponent extends FormsManagementDirective implements OnInit {
  @Input() selectedExam: Exam;
  @Output() questionsChanged = new EventEmitter<void>();

  cryptoKey: string;

  courseQuestions: Question[] = [];
  questionsFormGroup: FormGroup;
  InputType = InputType;
  RevealAnswerType = RevealAnswerType;

  hideRevealAnswers = false;
  hideNever = false;
  hideStudy = false;

  constructor(private questionService: QuestionService,
              private permissionService: PermissionService,
              private dialog: MatDialog,
              private router: Router) {
    super(permissionService);
    this.cryptoKey = Utilities.cryptoKey;
  }

  ngOnInit() {
    const questions: any = Array.isArray(this.selectedExam.questions) ? this.selectedExam.questions : [];
    this.initializeForm(questions);
    this.getExamQuestions(questions);
    this.updateFormRequirementsBasedOnType(this.selectedExam.type);
  }

  initializeForm(questions: Question[]) {
    this.questionsFormGroup = new FormGroup({
      revealAnswers: new FormControl(this.selectedExam.revealAnswers || RevealAnswerType.Never),
      questions: new FormControl(questions)
    });
    this.form.addControl('questions', this.questionsFormGroup);
  }

  onDropSuccess(question) {
    this.questionsFormGroup.get('questions').setValue(this.courseQuestions.map(q => q.id));
  }

  openAddRemoveDialog() {
    const dialogRef = this.dialog.open(AddRemoveDialogComponent, {
      height: '80%',
      width: '80%',
      data: {
        courseQuestions: this.courseQuestions,
        excludedQuestions: this.getExcludedQuestionList(),
        type: 'exam'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.questionsFormGroup.get('questions').setValue(this.courseQuestions.map(question => question.id));

     // if (result && result.questionSaved) {
        // this.questionsChanged.emit();
    //  }
    });
  }

  getExcludedQuestionList() {
    const list = [];
    this.courseQuestions.forEach(question => {
      if (question.serialQuestions && question.serialQuestions.length > 0) {
        question.serialQuestions.forEach(serialQuestion => {
          if (serialQuestion && serialQuestion.id) {
            list.push(serialQuestion.id);
          }
        });
      }
    });
    return list;
  }

  openPreviewQuestion(question) {
    window.open(`${RoutesRp.ActivityQuestionPreview}/${question.id}`);
  }

  openQuestionNewWindow(question) {
    window.open(`/question-form/${question.id}`);
  }

  openEditQuestionDialog(question) {
    if (question.serialQuestions && question.serialQuestions.length > 0 || question.type === 'serial') {
      window.open(`/serial-question/form/${question.id}`);
    } else {
      const dialogRef = this.dialog.open(EditQuestionDialogComponent, {
        height: '80%',
        width: '80%',
        data: {
          question: question,
          courseQuestions: this.courseQuestions
        }
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result && result.questionSaved) {
          const newQuestions: any = Array.isArray(this.selectedExam.questions) ? this.selectedExam.questions : [];
          this.courseQuestions.length = 0;
          this.getExamQuestions(newQuestions);

        }
      });
    }
  }

  getExamQuestions(questions) {
    this.showSpinner = questions && questions.length > 0;
    // TODO: remove this timing and fetch the questions in the correct order using query with an array of values
    const interval = 200; // how much time should the delay between two iterations be (in milliseconds)?
    questions.forEach((question, index) => {

        this.questionService.findById(question)
          .pipe(finalize(() => this.showSpinner = false))
          .subscribe(questionData => {
            const that = this;
            setTimeout(function () {
              that.courseQuestions.push(questionData);
            }, index * interval);
          });
    });
  }

  removeCourseClickHandler(question) {
    for (let i = this.courseQuestions.length - 1; i >= 0; i--) {
      if (this.courseQuestions[i].id === question) {
        this.courseQuestions.splice(i, 1);
      }
    }

    this.questionsFormGroup.get('questions').setValue(this.courseQuestions.map(q => q.id));

  }

  updateFormRequirementsBasedOnType(type: ExamType) {
    switch (decodeURI(type)) {
      case ExamType.Other:
        break;

      case ExamType.SelfAssessment:
        break;

      case ExamType.RevisionOrRefresher:
        if (this.questionsFormGroup.get('revealAnswers').value === RevealAnswerType.Never
          || this.questionsFormGroup.get('revealAnswers').value === RevealAnswerType.InStudyMode) {
          this.questionsFormGroup.get('revealAnswers').setValue(RevealAnswerType.AfterRightAnswer);
        }
        this.hideNever = true;
        this.hideStudy = true;
        break;

      case ExamType.ExamOrAssessment:
      case ExamType.PreActivity:
      case ExamType.PostActivity:
        this.questionsFormGroup.get('revealAnswers').setValue(RevealAnswerType.Never);
        this.hideRevealAnswers = true;
        break;

    }
  }
}
