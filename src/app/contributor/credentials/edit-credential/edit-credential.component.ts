import {Component, OnInit, OnDestroy, EventEmitter, Output} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {SessionService} from '../../../shared/services/session.service';
import {CredentialService} from '../../../shared/services/credential.service';
import {NotificationsService} from 'angular2-notifications';
import {Credential} from '../../../shared/models/credential';
import {LoggingService} from '../../../shared/services/logging.service';

@Component({
  selector: 'app-edit-credential',
  templateUrl: 'edit-credential.component.html'
})
export class EditCredentialComponent implements OnInit, OnDestroy {
  @Output() Saved = new EventEmitter<boolean>();
  @Output() Cancel = new EventEmitter<boolean>();
  public formSubmitted: Boolean = false;
  public editCredentialFormGroup: FormGroup;
  public university: FormControl;
  public subject: FormControl;
  public postNominalLetters: FormControl;
  public yearAttained: FormControl;
  public years: any = [];
  public id: string;

  constructor(private credentialService: CredentialService,
              private notificationsService: NotificationsService,
              private sessionService: SessionService) {
  }

  ngOnInit() {
    this.populateYearDropDown();
    this.createForm();
    if (this.credentialService.selectedCredential) {
      this.university.setValue(this.credentialService.selectedCredential.university);
      this.subject.setValue(this.credentialService.selectedCredential.subject);
      this.postNominalLetters.setValue(this.credentialService.selectedCredential.postNominalLetters);
      this.yearAttained.setValue(this.credentialService.selectedCredential.yearAttained);
      this.id = this.credentialService.selectedCredential.id;
    }
  }

  ngOnDestroy() {
    this.credentialService.selectedCredential = null;
  }

  createForm() {
    this.university = new FormControl('', [Validators.required]);
    this.subject = new FormControl('', [Validators.required]);
    this.postNominalLetters = new FormControl('', []);
    this.yearAttained = new FormControl('', [Validators.required]);
    this.editCredentialFormGroup = new FormBuilder().group({
      university: this.university,
      subject: this.subject,
      postNominalLetters: this.postNominalLetters,
      yearAttained: this.yearAttained
    });
  }

  populateYearDropDown() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 70;
    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }
    this.years.reverse();
  }

  submitCredentialClickHandler() {
    this.formSubmitted = true;
    if (this.inputValidation()) {
      this.credentialService.save(this.createCredential()).subscribe(data => {
        this.Saved.emit(true);
        this.notificationsService.success('Success', 'Credential saved successfully');
        this.credentialService.selectedCredential = null;
      });
    }
  }

  inputValidation() {
    const errors = [];
    if (!this.university.value) {
      errors.push('Please provide a university. ');
    }
    if (!this.subject.value) {
      errors.push('Please provide a subject. ');
    }
    if (!this.yearAttained.value || !this.isNumber(this.yearAttained.value)) {
      errors.push('Please state the year attended. ');
    }
    if (errors && errors.length > 0) {
      this.notificationsService.error('Missing required field', 'Please complete all required fields.');
      return false;
    } else {
      return true;
    }
  }

  createCredential() {
    // TODO need to make this save with it's preexisting ID if editing
    const newCredential = new Credential();
    if (this.sessionService.loggedInUser) {
      newCredential.userId = this.sessionService.loggedInUser.id; // current user
      newCredential.university = this.university.value;
      newCredential.subject = this.subject.value;
      newCredential.yearAttained = this.yearAttained.value;
      newCredential.postNominalLetters = this.postNominalLetters.value;
      newCredential.type = 'credential';
      if (this.credentialService.selectedCredential) {
        newCredential.id = this.credentialService.selectedCredential.id;
      }
    } else {
      LoggingService.warn('Cant assign current user to credential');
    }
    return newCredential;
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  cancelCredentialClickHandler() {
    this.Cancel.emit(true);
  }
}
