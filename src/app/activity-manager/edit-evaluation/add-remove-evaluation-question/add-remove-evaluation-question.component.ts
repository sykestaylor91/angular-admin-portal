import {Component, Input, Output,  EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AddRemoveEvaluationDialogComponent} from './add-remove-evaluation-dialog.component';
import DialogConfig from '../../../shared/models/dialog-config';

@Component({
  selector: 'app-add-remove-evaluation-question',
  templateUrl: 'add-remove-evaluation-question.component.html'
})
export class AddRemoveEvaluationQuestionComponent {
  @Input() courseQuestions: any[];
  @Output() questionsChanged = new EventEmitter<any[]>();


  constructor(public dialog: MatDialog) {
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddRemoveEvaluationDialogComponent, {
      height: '80%',
      width: '80%',
      data: {
        selectedItems: this.courseQuestions,
        formType: 'Edit'
      }});
    dialogRef.afterClosed().subscribe( result => {
      this.courseQuestions = result.list;
      this.questionsChanged.emit(result.list);
    });
  }
}
