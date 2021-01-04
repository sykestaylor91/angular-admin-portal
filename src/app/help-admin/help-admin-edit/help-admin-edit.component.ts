import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SessionService} from '../../shared/services/session.service';
import {HelpService} from '../../shared/services/help.service';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {Help} from '../../shared/models/help';

@Component({
  selector: 'app-help-admin-edit',
  templateUrl: './help-admin-edit.component.html'
})
export class HelpAdminEditComponent implements OnInit {
  finaliseText: string = 'Publish';
  formSubmitted: Boolean = false;

  public id: string;
  public type: string;


  public helpFormGroup: FormGroup;
  public helpTitle: FormControl;
  public helpPage: FormControl;
  public helpContent: FormControl;
  public specifiedPage: FormControl;

  public options = {
    position: ['bottom', 'right'],
    timeOut: 5000,
    lastOnBottom: true
  };

  constructor(public helpService: HelpService,
              private router: Router,
              private notificationsService: NotificationsService,
              private sessionService: SessionService) {
  }

  ngOnInit() {
    this.createForm();
    if (this.helpService.selectedDocument) {
      this.finaliseText = 'Update';
      this.helpTitle.setValue(this.helpService.selectedDocument.title);
      this.helpPage.setValue(this.helpService.selectedDocument.page);
      this.helpContent.setValue(this.helpService.selectedDocument.value);
      this.specifiedPage.setValue(this.helpService.selectedDocument.specifiedPage);
      this.id = this.helpService.selectedDocument.id;
    }
  }

  createForm() {
    this.helpContent = new FormControl('', [Validators.required]);
    this.helpTitle = new FormControl('', [Validators.required]);
    this.helpPage = new FormControl('', [Validators.required]);
    this.specifiedPage = new FormControl('', []);
    this.helpFormGroup = new FormBuilder().group({
      helpContent: this.helpContent,
      helpTitle: this.helpTitle,
      helpPage: this.helpPage,
      specifiedPage: this.specifiedPage
    });
  }

  finaliseClickHandler() {
    this.formSubmitted = true;
    if (this.inputValidation()) {
      this.formSubmitted = false;
      this.save();
    }
  }

  inputValidation() {
    const errors = [];
    if (!this.helpTitle.value) {
      errors.push('Please provide a Document Title.');
    }
    if (!this.helpPage.value) {
      errors.push('Please specify a page.');
    }
    if (!this.helpContent.value) {
      errors.push('Please input content.');
    }
    if (errors.length > 0) {
      this.notificationsService.error('Missing required field', 'Please complete all required fields.');
      return false;
    } else {
      return true;
    }
  }

  save() {
    this.helpService.save(this.createDocument()).subscribe(data => {
      this.helpService.selectedDocument = null;
      this.notificationsService.success('Success', 'Document saved successfully');
      this.router.navigate(['/help-admin']);
    });
    this.helpService.helpDocuments = null;
    this.router.navigate(['/help-admin']);
  }

  createDocument() {
    const newDocument = new Help;
    if (this.helpService.selectedDocument) {
      newDocument.id = this.helpService.selectedDocument.id;
      newDocument.author = this.helpService.selectedDocument.author || this.sessionService.loggedInUser.id;
    } else {
      newDocument.author = this.sessionService.loggedInUser.id;
    }
    newDocument.title = this.helpTitle.value;
    newDocument.page = this.helpPage.value;
    newDocument.value = this.helpContent.value;
    newDocument.specifiedPage = this.specifiedPage.value;
    console.log(newDocument);
    return newDocument;
  }

  cancelClickHandler() {
    this.router.navigate(['/help-admin']);
    this.helpService.selectedDocument = null;
  }

}
