import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import {Disclosure} from '../../../../shared/models/disclosure';

@Component({
  selector: 'app-disclosure-edit-contributions-detail',
  templateUrl: 'contributions-detail.component.html'
})
export class ContributionsDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() cancelCalled = new EventEmitter();
  @Output() saveDisclosure = new EventEmitter();
  selectedDisclosure: Disclosure;
  contributionFormGroup: FormGroup;
  contributionDetails: FormControl;
  benefitsDetails: FormControl;
  formSubmitted: Boolean;
  showDelete = false;
  showSpinner: Boolean;
  private yearDisclosed: FormControl;
  private viewCreated: Boolean;

  @Input()
  set disclosureSetter(record: Disclosure) {
    this.selectedDisclosure = record || new Disclosure();

    this.showDelete = this.selectedDisclosure.status !== undefined;

    if (this.viewCreated === true) {
      this.populateForm(this.selectedDisclosure);
    }
  }

  constructor() {
  }

  ngOnInit() {
    this.viewCreated = false;
    this.createForm(this.selectedDisclosure);
    this.formSubmitted = false;
    this.showSpinner = false;
  }

  ngAfterViewInit() {
    this.viewCreated = true;
  }

  ngOnDestroy() {
    this.viewCreated = false;
  }

  createForm(disclosure: Disclosure): void {

    this.contributionDetails = new FormControl(
      disclosure.contributionDetails,
      [
        Validators.required
      ]
    );

    this.benefitsDetails = new FormControl(
      disclosure.benefitsDetails,
      [
        Validators.required
      ]
    );

    this.yearDisclosed = new FormControl(
      disclosure.yearDisclosed,
      [
        Validators.required
      ]
    );

    this.contributionFormGroup = new FormBuilder().group({
      contributionDetails: this.contributionDetails,
      benefitsDetails: this.benefitsDetails,
      yearDisclosed: this.yearDisclosed
    });
  }

  populateForm(disclosure: Disclosure): void {
    // clear out any errors
    this.contributionFormGroup.setErrors({});
    this.selectedDisclosure = disclosure;
    this.contributionDetails.setValue(disclosure.contributionDetails);
    this.yearDisclosed.setValue(disclosure.yearDisclosed);
  }

  submitHandler(): void {
    this.formSubmitted = true;
    if (this.contributionFormGroup.valid) {
      this.formSubmitted = false;
      const values = this.contributionFormGroup.value;
      const disclosure = Disclosure.copy(this.selectedDisclosure);
      disclosure.contributionDetails = values.contributionDetails;
      disclosure.benefitsDetails = values.benefitsDetails;
      disclosure.yearDisclosed = values.yearDisclosed;
      this.showSpinner = true;
      this.saveDisclosure.emit(disclosure);
    }
  }

  deleteHandler(): void {
    const disclosure = Disclosure.copy(this.selectedDisclosure);
    disclosure.status = Disclosure.DELETED;
    this.showSpinner = true;
    this.saveDisclosure.emit(disclosure);
  }

  cancelHandler(): void {
    this.formSubmitted = false;
    // calls shared handler
    this.cancelCalled.emit('cancel');
  }

}
