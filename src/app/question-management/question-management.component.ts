import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap';
import {NotificationsService} from 'angular2-notifications';
import {QuestionService} from '../shared/services/question.service';
import {ExamService} from '../shared/services/exam.service';
import {UserService} from '../shared/services/user.service';
import {Question, ResolvedQuestion} from '../shared/models/question';
import {User} from '../shared/models/user';
import {QuestionManagerService} from '../shared/services/question-manager.service';
import {DialogActionsComponent} from '../shared/dialog/dialog-actions/dialog-actions.component';
import DialogConfig from '../shared/models/dialog-config';
import { MatDialog } from '@angular/material/dialog';
import {ActionType} from '../shared/models/action-type';
import Utilities from '../shared/utilities';
import {cloneDeep} from 'lodash';
import {SpinnerManagement} from '../shared/models/spinner-management';
import {zip} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {RoutesRp} from '../shared/models/routes-rp';
import {Column, ColumnType} from '../shared/models/column';
import {ContextMenuItems} from '../shared/models/context-menu-items';
type OrderBy = 'newToOld' | 'oldToNew';

@Component({
  selector: 'app-question-management',
  templateUrl: './question-management.component.html'
})
export class QuestionManagementComponent extends SpinnerManagement implements OnInit {
  title = 'Question Library';
  user: User;
  questions: Question[] = [];
  columns: Column[] = [{
    type: ColumnType.FirstNWordsStripTags,
    field: 'question',
    width: '45%',
    title: 'Question text',
    limit: 10
  },
  {
    type: ColumnType.Tags,
    field: 'tags',
    width: '35%',
    title: 'Tags',
    limit: 10
  },
  {
    type: ColumnType.Date,
    field: 'dateCreated',
    width: '20%',
    title: 'Date created'
  }];
  contextMenuItems: string[] = [ContextMenuItems.Edit, ContextMenuItems.Delete, ContextMenuItems.UseAsTemplate, ContextMenuItems.Preview];

  filterTerm: string;
  currentOrder: OrderBy = 'newToOld';

  @ViewChild('modal') private modal: ModalDirective;

  constructor(public questionService: QuestionService,
              public examService: ExamService,
              public router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private dialog: MatDialog,
              private notificationsService: NotificationsService,
              private questionManagerService: QuestionManagerService) {
    super();
  }

  ngOnInit() {
    this.route.data
      .subscribe((data: { resolvedQuestion?: ResolvedQuestion }) => {
        this.showSpinner = true;
        this.initializePage(data.resolvedQuestion);
      });
  }

  initializePage(resolvedQuestion: ResolvedQuestion) {
    this.user = resolvedQuestion.sessionUser;
    this.questions = [];

    if (resolvedQuestion.uniqueUserIds && resolvedQuestion.uniqueUserIds.length > 0) {
      this.userService.findByIdArray(resolvedQuestion.uniqueUserIds)  // Should be in resolver
        .pipe(finalize(() => this.showSpinner = false))
        .subscribe(users => {
          users.forEach(user => {
            // this should at the very least be done in the backend
            resolvedQuestion.questions.filter(question => question.userId === user.id)
              .forEach(question => question.author === User.fullName(user.firstName, user.lastName));
          });

          this.questions = resolvedQuestion.questions;
        });
    } else {
      this.showSpinner = false;
    }
  }

  editQuestionClickHandler(question) {
    if (question.type === 'serial' || (question.serialQuestions && question.serialQuestions.length > 0) ) {
      this.router.navigate(['/serial-question/form', question.id]);
    } else {
      this.router.navigate(['/question-form', question.id]);
    }
  }

  useAsTemplateClickHandler(question) {
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm Action',
        content: `Are you sure you wish to use the following question as a blueprint: <span class="bold">${question.title}</span>`,
        actions: [ActionType.Confirmation]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      if (result === ActionType.Confirmation) {
        this.showSpinner = true;
        if (question.type === 'serial' || (question.serialQuestions && question.serialQuestions.length > 0) ) {
          this.router.navigate(['/serial-question/form/template', question.id]);
        } else {
          this.questionManagerService.formConfig = question;
          this.router.navigate(['/question-form/template', question.id]);
        }
      }
      ref.close();
    });
  }

  updateFilteredItems(array) {
    this.questions = array.sort(Utilities.dateSorter('dateCreated', this.currentOrder === 'newToOld' ? 'desc' : 'asc'));
  }

  confirmActionClickHandler(question) {
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this question?',
        actions: [ActionType.Confirmation]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      this.deleteQuestion(question);
      ref.close();
    });
  }

  deleteQuestion(deleteQuestion: Question) {
    this.showSpinner = true;
    this.questionService.remove(deleteQuestion)
      .pipe(finalize(() => this.showSpinner = false))
      .subscribe(data => {
        this.removeQuestionFromCourses(deleteQuestion);
        this.questions = cloneDeep(this.deleteFromArray(this.questions, deleteQuestion.id));
        this.notificationsService.success('Success', 'Question deleted successfully');
      }, err => {
        this.notificationsService.error('Error occurred during deletion');
        console.error(err);
      });
  }

  deleteFromArray(questions: Question[], id): Question[] {
    const idx = questions.findIndex(question => question.id === id);
    questions.splice(idx, 1);
    return questions;
  }

  removeQuestionFromCourses(deleteQuestion: Question) {
    // TODO: should be handled in the backend not here in the frontend...
    const examObs = [];
    this.examService.getExams()
      .subscribe(exams => {
        exams.forEach(exam => {
          const foundIdx = exam.questions.findIndex(questionId => questionId === deleteQuestion.id);
          if (foundIdx > -1) {
            exam.questions.splice(foundIdx, 1);
            examObs.push(this.examService.save(exam));
          }
        });
      });
    zip(...examObs).subscribe(() => {
    }, err => console.error(err));
  }

  newQuestionClickHandler(type) {
    if (type === 'serial') {
        this.router.navigate(['/serial-question/form']);
    } else {
      this.questionManagerService.formConfig = type;
      this.router.navigate(['/question-form']);
    }
  }

  onPreviewClicked(question: Question) {
    console.log('onPreviewClicked', question);
    this.router.navigate([RoutesRp.ActivityQuestionPreview, question.id]);
  }

}
