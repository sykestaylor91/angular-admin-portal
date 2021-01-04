import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {ActionType} from '../../models/action-type';
import {DialogBase} from '../../models/dialog-config';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-iframe',
  templateUrl: './dialog-iframe.component.html',
  styleUrls: ['./dialog-iframe.component.scss']
})
export class DialogIframeComponent implements OnInit {
  @Output() dialogResult = new EventEmitter<ActionType>();

  public htmlSrc: string;

  constructor(private dialogRef: MatDialogRef<DialogIframeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogBase,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.htmlSrc = this.data.htmlSrc;
  }

  onDialogResult(action: ActionType) {
    this.dialogResult.emit(action);
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
