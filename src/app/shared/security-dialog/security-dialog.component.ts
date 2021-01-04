import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Question} from '../models/question';
import {ActionType} from '../models/action-type';
@Component({
  selector: 'app-security-dialog',
  templateUrl: 'security-dialog.component.html'
})
// TODO: combine with other dialog components
export class SecurityDialogComponent implements OnInit {
  @Output() dialogResult = new EventEmitter<any>();

  showSpinner: boolean = true;
  question: Question;
  courseQuestions: any[] = [];

  constructor(private dialogRef: MatDialogRef<SecurityDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.showSpinner = false;
  }

  removeLock() {
    // TODO: replace this with real mechanism

    this.dialogResult.emit({test: true});
  }

}
