import {Router} from '@angular/router';
import {ExamService} from '../../../shared/services/exam.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {QuestionService} from '../../../shared/services/question.service';
import {Component, Inject, OnInit} from '@angular/core';
import {Question} from '../../../shared/models/question';
import {Column, ColumnType} from '../../../shared/models/column';

@Component({
  selector: 'app-add-remove-evaluation-dialog',
  templateUrl: 'add-remove-evaluation-dialog.component.html'
})
export class AddRemoveEvaluationDialogComponent implements OnInit {
  showSpinner: boolean = false;
  selectedItems: Question[] = [];
  createNew: boolean = false;
  questions: Question[] = [];
  columns: Column[] = [{
      type: ColumnType.FirstNWordsStripTags,
      field: 'question',
      width: '70%',
      title: 'Text',
      limit: 30
    },
    {
      type: ColumnType.Date,
      field: 'dateCreated',
      width: '20%',
      title: 'Date created'
    },
    {
      type: ColumnType.AddRemoveButton,
      width: '10%'
    }
  ];

  constructor(public examService: ExamService,
              public questionService: QuestionService,
              public router: Router,
              public dialogRef: MatDialogRef<AddRemoveEvaluationDialogComponent>,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
      this.selectedItems = data.selectedItems || [];
  }

  onResponseClick(response) {
    this.dialogRef.close(response);
  }

  closeDialog() {
    this.dialogRef.close({ list: this.selectedItems });
  }

  ngOnInit() {
    this.showSpinner = true;
    this.questionService.query(false).subscribe(data => {
      if (data && data.length > 0) {
        data.forEach((question: Question) => {
          if (question.type === 'evaluation') {
            this.questions.push(question);
          }
        });
      }
      this.showSpinner = false;
    });
  }

  questionInCourse(question) {
    let questionInCourse = false;
    this.selectedItems.forEach((courseQuestion) => {
      if (courseQuestion.id === question.id) {
        questionInCourse = true;
      }
    });
    return questionInCourse;
  }

  addToCourseClickHandler(question: Question) {
    this.selectedItems.push(question);
  }

  removeCourseClickHandler(question) {
    for (let i = this.selectedItems?.length - 1; i >= 0; i--) {
      if (this.selectedItems[i].id === question.id) {
        this.selectedItems.splice(i, 1);
      }
    }
  }

  onSaveQuestion(question) {
    alert(JSON.stringify(question));
    this.selectedItems.push(question);
    this.questions.push(question);
    this.createNew = false;
  }

  createNewQuestion() {
    this.createNew = true;
  }
}
