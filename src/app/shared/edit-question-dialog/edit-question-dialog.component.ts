import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Question} from '../models/question';
@Component({
  selector: 'app-edit-question-dialog',
  styleUrls: ['./edit-question-dialog.component.scss'],
  templateUrl: 'edit-question-dialog.component.html'
})

// TODO: combine with other dialog components
export class EditQuestionDialogComponent implements OnInit {
  showSpinner: boolean = true;
  question: Question;
  courseQuestions: any[] = [];

  constructor(private dialogRef: MatDialogRef<EditQuestionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.question = data.question;
    this.courseQuestions = data.question;
  }

  ngOnInit() {
    this.showSpinner = false;
  }

  saveQuestion(event) {
    // TODO: replace this question's value in course questions array
    let index = 0;
    for (const q of this.courseQuestions) {
        if (q.id === this.question.id) {
            this.courseQuestions[index] = this.question;
            break;   // found and replaced, nothing more to do so break out of loop
        }
        index++;
    }
    this.closeDialog(true);
  }

  closeDialog(questionSaved: boolean) {
    this.dialogRef.close({ questions: this.courseQuestions, questionSaved: questionSaved });
  }
}
