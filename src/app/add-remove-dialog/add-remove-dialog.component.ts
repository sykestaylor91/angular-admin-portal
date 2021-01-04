import { QuestionService } from '../shared/services/question.service';
import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Question } from '../shared/models/question';
import Utilities from '../shared/utilities';
import { finalize } from 'rxjs/operators';
import { Column, ColumnType } from '../shared/models/column';


@Component({
  selector: 'app-add-remove-dialog',
  templateUrl: 'add-remove-dialog.component.html'
})
export class AddRemoveDialogComponent implements OnInit {
  @Output() questionsChanged = new EventEmitter<void>();

  showSpinner: boolean = true;
  courseQuestions: any[] = [];
  excludedQuestions: any[] = [];
  type: string = '';
  filteredQuestions: Question[] = [];
  filterTerm: string;
  filterTimeout: any;
  createNew: boolean = false;
  private filterDelay: number = 300;
  private questions: Question[] = [];
  addedOrRemoved: boolean = false;
  columns: Column[];
  selectedItems: any[] = [];



  constructor(private questionService: QuestionService,
    private dialogRef: MatDialogRef<AddRemoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.courseQuestions = data.courseQuestions;
    this.type = data.type;
    this.excludedQuestions = data.excludedQuestions || [];
    this.selectedItems = this.courseQuestions;
  }

  ngOnInit() {
    this.showSpinner = true;
    this.questionService.query(false)
      .pipe(finalize(() => this.showSpinner = false))
      .subscribe(data => {
        // TODO: what other filtering of questions do we need to do?
        this.questions = this.removePostCourseQuestions(data);
        this.filterQuestions();
      });
    if (!this.selectedItems) {
      this.selectedItems = [];
    }
    this.columns = [{
      type: ColumnType.Text,
      field: 'title',
      width: '30%',
      title: 'Question title',
      limit: 10
    },
    {
      type: ColumnType.StripTags,
      field: 'question',
      width: '60%',
      title: 'Question text'
    },
    {
      type: ColumnType.Date,
      field: 'dateCreated',
      width: '20%',
      title: 'Date created'
    },
    {
      type: ColumnType.Date,
      field: 'lastUpdated',
      width: '20%',
      title: 'Date updated'
    },
    {
      type: ColumnType.AddRemoveButton,
      width: '20%'
    }
    ];
  }

  removePostCourseQuestions(array) {
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i].type === 'evaluation') {
        array.splice(i, 1);
      }
    }
    return array;
  }

  stripHtmlFromQuestions(questions) {
    questions.forEach(question => {
      question.strippedQuestion = Utilities.getTextFromHtml(question.question);
    });
  }

  onSaveQuestion(question) {
    this.courseQuestions.push(question);
    this.questions.push(question);
    this.filteredQuestions.push(question);
    this.createNew = false;

    // this.closeDialog(true);
  }

  closeDialog(questionSaved: boolean) {

    this.dialogRef.close({ questions: this.courseQuestions, questionSaved: questionSaved || this.addedOrRemoved });
  }

  onFilterKeyUp() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filterQuestions();
      this.filterTimeout = null;
    }, this.filterDelay);
  }

  filterQuestions() {
    this.filteredQuestions = [];
    if (!this.filterTerm || (typeof this.filterTerm === 'string' && this.filterTerm.trim() === '')) {
      // this.filteredQuestions = this.questions;
      for (let i = 0; i < this.questions.length; i++) {
        if (!this.questionInExcludedList(this.questions[i])) {

          this.filteredQuestions.push(this.questions[i]);
        }
      }
      return;
    }
    for (let i = 0; i < this.questions.length; i++) {
      if (this.contains(this.questions[i].question + this.questions[i].title, this.filterTerm) && !this.questionInExcludedList(this.questions[i])) {

        this.filteredQuestions.push(this.questions[i]);
      }
    }
  }

  contains(value, filter): boolean {
    if (value === undefined || value === null) {
      return false;
    }
    return value.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
  }

  questionInCourse(question) {
    let questionInCourse = false;
    this.courseQuestions.forEach((courseQuestion) => {
      if (courseQuestion.id === question.id) {
        questionInCourse = true;
      }
    });
    return questionInCourse;
  }

  questionInExcludedList(question) {
    let questionInList = false;
    if (!question) {
      return false;
    } else if (!this.excludedQuestions) {
      return false;
    } else if (this.type === 'serialQuestion' && question.serialQuestions && question.serialQuestions.length > 0) {
      return true;
    } else if (this.type === 'exam') {
      if (question.serialQuestions && question.serialQuestions.length > 0) {
        question.serialQuestions.forEach(serialQ => {
          this.courseQuestions.forEach(courseQ => {
            if (courseQ.id === serialQ.id) {
              questionInList = true;
            }
          });
        });
      }
    } else {
      this.excludedQuestions.forEach(excludedQuestion => {
        if (excludedQuestion.id === question.id || excludedQuestion === question.id) {
          questionInList = true;
        }
      });
    }
    return questionInList;
  }

  addToExcludedList(question) {
    this.excludedQuestions.push(question);
  }

  removeFromExcludedList(question) {
    for (let i = this.excludedQuestions.length - 1; i >= 0; i--) {
      if (this.excludedQuestions[i].id === question.id || this.excludedQuestions[i] === question.id) {
        this.excludedQuestions.splice(i, 1);
      }
    }
  }

  addToCourseClickHandler(question) {
    this.courseQuestions.push(question);
    this.addedOrRemoved = true;
    if (this.type === 'exam') {

      if (question.serialQuestions && question.serialQuestions.length > 0) {
        question.serialQuestions.forEach((excludeQuestion) => {
          this.addToExcludedList(excludeQuestion);
        });
      }
    }
    this.filterQuestions();
  }

  removeFromCourseClickHandler(question) {
    // YG
    const questionLocation = this.courseQuestions.indexOf(question.id);
    if (questionLocation === -1) {
      // thandle the error
      return;
    }
    this.courseQuestions.splice(questionLocation, 1);
    this.addedOrRemoved = true;
    if (this.type === 'exam' && question.serialQuestions && question.serialQuestions.length > 0) {
      question.serialQuestions.forEach((excludeQuestion) => {
        this.removeFromExcludedList(excludeQuestion);
      });
      this.filterQuestions();
      // for (let i = this.courseQuestions.length - 1; i >= 0; i--) {
      //   if (this.courseQuestions[i].id === question.id) {
      //     this.courseQuestions.splice(i, 1);
      //     this.addedOrRemoved = true;
      //     if (this.type === 'exam'  &&  question.serialQuestions && question.serialQuestions.length > 0) {
      //       question.serialQuestions.forEach((excludeQuestion) => {
      //       this.removeFromExcludedList(excludeQuestion);
      //   });
      // }
      //   }
      // }
      // this.filterQuestions();
    }
  }
}
