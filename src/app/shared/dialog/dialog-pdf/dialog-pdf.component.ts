import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {ActionType} from '../../models/action-type';
import {DialogBase} from '../../models/dialog-config';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer} from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@Component({
  selector: 'app-dialog-pdf',
  templateUrl: './dialog-pdf.component.html',
  styleUrls: ['./dialog-pdf.component.scss']
})
export class DialogPdfComponent implements OnInit {
  @Output() dialogResult = new EventEmitter<ActionType>();

  public pdfSrc: string;


  constructor(private dialogRef: MatDialogRef<DialogPdfComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.pdfSrc = this.data.pdfSrc;

  }

  onDialogResult(action: ActionType) {
    this.dialogResult.emit(action);
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
