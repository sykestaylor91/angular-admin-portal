import {Component, OnInit, ViewChild, EventEmitter, Output} from '@angular/core';
import {MediaService} from '../../services/media.service';
import {SessionService} from '../../services/session.service';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {Media} from '../../models/media';
import {environment} from '../../../../environments/environment';
import {ContentType} from '../../models/content-type';

@Component({
  selector: 'app-shared-upload-media',
  templateUrl: 'shared-upload-media.component.html'
})
export class SharedUploadMediaComponent implements OnInit {
  @Output() selectImage = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput;

  title: string = 'Upload Media';
  formSubmitted: boolean;
  mediaFormGroup: FormGroup;
  mediaTitle: FormControl;
  author: FormControl;
  selectedFile: any;
  dragEvent = false;

  protected session: string = 'none';
  private caption: FormControl;
  private levelOfEvidence: FormControl;
  private selectedFileType: ContentType;

  constructor(public mediaService: MediaService,
              private notificationsService: NotificationsService,
              private sessionService: SessionService) {
  }

  ngOnInit() {
    this.createForm();
    if (this.mediaService.selectedMedia) {
      this.title = 'Edit Media';
      this.mediaTitle.setValue(this.mediaService.selectedMedia.title);
      this.author.setValue(this.mediaService.selectedMedia.author);
      this.caption.setValue(this.mediaService.selectedMedia.caption);
      this.levelOfEvidence.setValue(this.mediaService.selectedMedia.levelOfEvidence);
    }
  }

  createForm() {
    this.mediaFormGroup = new FormGroup({
      mediaTitle: new FormControl('', [Validators.required]),
      author: new FormControl('', [Validators.required]),
      caption: new FormControl('', []),
      levelOfEvidence: new FormControl('', []),
      file: new FormControl('', [])
    });
  }

  getExtension(filename) {
    const parts = filename.split('.');
    return parts[parts.length - 1];
  }

  fileSelected(event) {
    this.selectedFile = event.target.files[0];
    this.selectedFileType = this.getExtension(event.target.files[0].name);
    this.fileChange(event);
  }

  startUploadClickHandler() {
    this.formSubmitted = true;
    if (this.mediaFormGroup.valid && this.selectedFile) {
      this.mediaService.save(this.constructNewMedia(), this.selectedFile).subscribe(data => {
        this.notificationsService.success('Success', 'Media upload complete');
        const thumbnailImg = environment.mediaUrl + data.id + '.' + data.contentType;  // TODO: create real thumbnail
        const newImage = {
          id: data.id,
          title: data.title || '',
          caption: data.caption || '',
          thumbnail: thumbnailImg,
          contentType: data.contentType
        };
        this.selectImage.emit(newImage);
      });
    }
  }

  constructNewMedia() {
    const newMedia = new Media();
    newMedia.author = this.mediaFormGroup.value.author;
    newMedia.contentType = this.selectedFileType;
    newMedia.title = this.mediaFormGroup.value.mediaTitle;
    newMedia.userId = this.sessionService.loggedInUser.id;
    newMedia.levelOfEvidence = this.mediaFormGroup.value.levelOfEvidence;
    newMedia.uri = '';
    newMedia.status = '';
    return newMedia;
  }

  drag(event) {
    this.dragEvent = true;
  }

  dragLeave(event) {
    this.dragEvent = false;
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const img = document.querySelector('#preview img');
      const reader = new FileReader();
      reader.onload = ((aImg) => {
        return (e) => {
          aImg.setAttribute('src', e.target.result);
        };
      })(img);
      reader.readAsDataURL(file);
      this.mediaTitle.setValue(this.selectedFile.name);

    }
  }
}
