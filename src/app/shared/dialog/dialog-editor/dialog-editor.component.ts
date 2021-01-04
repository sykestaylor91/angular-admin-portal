import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {ActionType} from '../../models/action-type';
import {DialogBase} from '../../models/dialog-config';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-editor',
  templateUrl: './dialog-editor.component.html',
  styleUrls: ['./dialog-editor.component.scss']
})
export class DialogEditorComponent implements OnInit {
  @Output() dialogResult = new EventEmitter<ActionType>();

  constructor(private dialogRef: MatDialogRef<DialogEditorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogBase) {
  }

  ngOnInit() {
    if (!this.data.content) {
      this.data.content = '';
    }
  }

  onDialogResult(action: ActionType) {
    this.dialogResult.emit(action);
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
