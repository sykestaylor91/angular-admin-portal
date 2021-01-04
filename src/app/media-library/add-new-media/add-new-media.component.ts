import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {MediaService} from '../../shared/services/media.service';
import {SessionService} from '../../shared/services/session.service';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {Media} from '../../shared/models/media';
import {ContentType} from '../../shared/models/content-type';

@Component({
  selector: 'app-add-new-media',
  templateUrl: 'add-new-media.component.html'
})
export class AddNewMediaComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput;

  title: string = 'Add New Media';
  formSubmitted: boolean;
  mediaFormGroup: FormGroup;
  mediaTitle: FormControl;
  author: FormControl;
  selectedFile: any;
  dragEvent = false;
  showSpinner: boolean = false;

  protected session: string = 'none';
  private caption: FormControl;
  private levelOfEvidence: FormControl;
  private file: FormControl;
  private selectedFileType: ContentType;

  constructor(public mediaService: MediaService,
              private router: Router,
              private location: Location,
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
    this.mediaTitle = new FormControl('', [Validators.required]);
    this.author = new FormControl('', [Validators.required]);
    this.caption = new FormControl('', []);
    this.levelOfEvidence = new FormControl('', []);
    this.file = new FormControl('', []);
    this.mediaFormGroup = new FormBuilder().group({
      mediaTitle: this.mediaTitle,
      author: this.author,
      caption: this.caption,
      levelOfEvidence: this.levelOfEvidence,
      file: this.file
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
      const newMedia = this.constructNewMedia();
      newMedia.id = this.mediaService.selectedMedia.id;
      this.mediaService.save(newMedia).subscribe(data => {
        this.showSpinner = false;
        this.location.back();
        if (data) {
          this.notificationsService.success('Success', 'Media upload complete');
        } else {
          this.notificationsService.error('Error', 'There was a problem uploading the selected media');
        }
      });
    } else {
      this.notificationsService.error('Form invalid', 'Please complete all required fields');
    }
  }

  ngOnDestroy() {
    this.mediaService.selectedMedia = null;
  }

  constructNewMedia() {
    const newMedia = new Media();
    newMedia.author = this.mediaFormGroup.value.author;
    newMedia.contentType = this.selectedFileType;
    newMedia.caption = this.mediaFormGroup.value.caption;
    newMedia.title = this.mediaFormGroup.value.mediaTitle;
    newMedia.userId = this.sessionService.loggedInUser.id;
    newMedia.levelOfEvidence = this.mediaFormGroup.value.levelOfEvidence;
    newMedia.uri = '';
    newMedia.status = '';
    return newMedia;
  }

  cancelClickHandler() {
    this.location.back();
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
      reader.onload = (function (aImg) {
        return function (e) {
          aImg.setAttribute('src', e.target.result);
        };
      })(img);
      reader.readAsDataURL(file);
      this.mediaTitle.setValue(this.selectedFile.name);
    }
  }

}
