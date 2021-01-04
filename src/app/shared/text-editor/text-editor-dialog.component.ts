import {Component, Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {TextEditorDialog} from '../models/dialog-config';
import {MediaType} from '../models/media-type';
import {Citation} from '../models/citation';
import {TextEditorAddCitationComponent} from './add-citation/add-citation.component';
import {Media} from '../models/media';

enum ViewCitationType {
  NotSet,
  Insert,
  ShowAll,
  FilterByCourse
}

@Component({
  templateUrl: 'text-editor-dialog.component.html',
  styleUrls: ['text-editor-dialog.component.scss']
})
export class TextEditorDialogComponent {
  showLoading: boolean = false;
  viewCitationHeader: boolean = true;
  citationType: ViewCitationType = ViewCitationType.NotSet;

  MediaType = MediaType;
  ViewCitationType = ViewCitationType;

  @ViewChild(TextEditorAddCitationComponent) private textEditorAddCitationComponent: TextEditorAddCitationComponent;

  constructor(public dialogRef: MatDialogRef<TextEditorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: TextEditorDialog) {
  }

  onInsertMedia(media: Media) {
    this.onCloseDialog(media);
  }

  onViewCitationsClicked(viewCitationType: ViewCitationType) {
    this.onShowLoading(viewCitationType === ViewCitationType.ShowAll || viewCitationType === ViewCitationType.FilterByCourse);
    this.viewCitationHeader = false;
    this.citationType = viewCitationType;
  }

  onInsertCitation(citation: Citation) {
    this.viewCitationHeader = true;
    this.onCloseDialog(citation);
  }

  onShowLoading(isLoading: boolean) {
    this.showLoading = isLoading;
  }

  onCloseDialog(data?: any) {
    this.dialogRef.close(data);
  }

  onPreviousClicked() {
    if (this.textEditorAddCitationComponent && this.textEditorAddCitationComponent.matchingCitationsFound) {
      this.textEditorAddCitationComponent.matchingCitationsFound = false;
    } else {
      this.viewCitationHeader = true;
    }
  }
}
