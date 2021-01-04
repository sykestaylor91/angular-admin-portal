import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
import {MediaService} from '../services/media.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-upload-insert-media-dialog',
  templateUrl: 'upload-insert-media-dialog.component.html'
})
export class UploadInsertMediaDialogComponent implements OnInit {
  selectedFile: any;
  title: string = 'Upload/Insert Media';
  mode: string = 'selectMedia';

  constructor(private mediaService: MediaService,
              public dialogRef: MatDialogRef<UploadInsertMediaDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    if (this.data.preSelectedFile) {
      this.mediaService.findById(this.data.preSelectedFile).subscribe(data => {
        const thumbnailImg = environment.mediaUrl + data.id + '.' + data.contentType;
        this.selectedFile = {
          id: data.id,
          title: data.title || '',
          thumbnail: thumbnailImg,
          contentType: data.contentType,
          providerLogo: data.providerLogo
        };
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close(this.selectedFile);
  }

  uploadMediaModeClickHandler() {
    this.mode = 'uploadMedia';
  }

  selectMediaModeClickHandler() {
    this.mode = 'selectMedia';
  }

  selectImage(event) {
    this.dialogRef.close(event);
  }

}
