import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {MediaService} from '../services/media.service';
import {MatDialog} from '@angular/material/dialog';
import {UploadInsertMediaDialogComponent} from './upload-insert-media-dialog.component';
import {Media} from '../models/media';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-upload-insert-media',
  templateUrl: 'upload-insert-media.component.html'
})

// TODO: combine with other dialog components
export class UploadInsertMediaComponent implements OnInit, OnDestroy {
  @Input() preSelectedFile: string | Media;
  @Input() providerLogo: boolean = false;
  @Input() isDisabled: boolean = false;
  @Output() emitSelectedImage = new EventEmitter<any>();

  title: string = 'Upload/Insert Media';
  selectedFile: Media;

  constructor(public dialog: MatDialog,
              private mediaService: MediaService) {
  }

  selectMediaClickHandler() {
    const dialogData = {
      preSelectedFile: this.preSelectedFile
    };
    this.openDialog(dialogData);
  }


  openDialog(data) {
    const dialogRef = this.dialog.open(UploadInsertMediaDialogComponent, {
      height: '800px',
      width: '800px',
      data: {
        preSelectedFile: this.preSelectedFile,
        providerLogo: this.providerLogo
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedFile = result;
        this.emitSelectedImage.emit(result);
      }
    });
  }

  removeSelectedImage() {
    this.selectedFile = null;
    this.emitSelectedImage.emit(null);
  }

  ngOnInit() {
    if (this.preSelectedFile) {
      if ((typeof this.preSelectedFile === 'object') && typeof this.preSelectedFile !== 'string') {
        this.selectedFile = this.preSelectedFile as Media;
      } else {
        this.mediaService.findById(this.preSelectedFile as string).subscribe(data => {
          const thumbnailImg = environment.mediaUrl + data.id + '.' + data.contentType;
          this.selectedFile = {
            id: data.id,
            title: data.title || '',
            thumbnail: thumbnailImg,
            contentType: data.contentType
          };
        });
      }
    }
  }

  ngOnDestroy() {
    this.mediaService.selectedMedia = null;
  }
}
