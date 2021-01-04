import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {DialogBase} from '../../models/dialog-config';
import {ActionType} from '../../models/action-type';
import {LoggingService} from '../../services/logging.service';

@Component({
  selector: 'app-dialog-actions',
  templateUrl: './dialog-actions.component.html',
  styleUrls: ['./dialog-actions.component.scss']
})
export class DialogActionsComponent implements OnInit {
  @Input() trustHtml: boolean = false;
  @Input() displayContent: boolean = true;
  @Output() dialogResult = new EventEmitter<ActionType>();

  constructor(public dialogRef: MatDialogRef<DialogActionsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogBase) {
  }

  ngOnInit() {
    if (!this.data.displayContent) {
      this.displayContent = this.data.displayContent;
    }

    if (!this.data.trustHtml) {
      this.trustHtml = this.data.trustHtml;
    }

    if (this.displayContent && this.trustHtml) {
      LoggingService.warn('!Trusting as html!');
    }
  }

  onDialogResult(action: ActionType) {
    this.dialogResult.emit(action);
  }

  onCloseDialog() {
    // close doesn't work when opening from the inside the text editor
    // unless the close button has an *ngIf=true on it... not joking
    this.dialogRef.close();
  }
}
