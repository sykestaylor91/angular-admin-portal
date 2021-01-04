import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import {Disclosure} from '../../../../shared/models/disclosure';
import {FormUtilities} from '../../../../shared/helpers/form-utilities';


@Component({
  selector: 'app-edit-patents-detail',
  templateUrl: 'patents-detail.component.html',
})
export class PatentsDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedDisclosure: Disclosure;
  formSubmitted: Boolean;
  showSpinner: Boolean;
  showDelete = false;
  patentLicensee: FormControl;

  private viewCreated = false;

  // form
  patentFormGroup: FormGroup;

  // form controls
  patentNumber: FormControl;
  patentPending: FormControl;
  patentIssued: FormControl;
  patentLicensed: FormControl;
  patentRoyalties: FormControl;
  private yearDisclosed: FormControl;
  private comment: FormControl;

  @Input()
  set disclosureSetter(record: Disclosure) {
    this.selectedDisclosure = record || new Disclosure();

    this.showDelete = this.selectedDisclosure.status !== undefined;

    if (this.viewCreated === true) {
      this.populateForm(this.selectedDisclosure);
    }
  }

  @Output() cancelCalled = new EventEmitter();
  @Output() saveDisclosure = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.createForm(this.selectedDisclosure);
    this.formSubmitted = false;
    this.showSpinner = false;
  }

  ngAfterViewInit() {
    this.viewCreated = true;
  }

  ngOnDestroy() {
    this.selectedDisclosure = undefined;
    this.viewCreated = false;
  }

  createForm(disclosure: Disclosure): void {
    this.patentNumber = new FormControl(
      disclosure.patentNumber || '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    );

    this.patentPending = new FormControl(
      FormUtilities.formatBooleanToString(disclosure.patentPending),
      [
        Validators.required
      ]
    );

    this.patentIssued = new FormControl(
      FormUtilities.formatBooleanToString(disclosure.patentIssued),
      [
        Validators.required
      ]
    );

    this.patentLicensed = new FormControl(
      FormUtilities.formatBooleanToString(disclosure.patentLicensed),
      [
        Validators.required
      ]
    );

    this.patentRoyalties = new FormControl(
      FormUtilities.formatBooleanToString(disclosure.patentRoyalties),
      [
        Validators.required
      ]
    );

    this.patentLicensee = new FormControl(
      FormUtilities.formatBooleanToString(disclosure.patentLicensee),
      [
        Validators.required
      ]
    );

    this.yearDisclosed = new FormControl(
      FormUtilities.formatBooleanToString(disclosure.yearDisclosed),
      [
        Validators.required
      ]
    );

    this.comment = new FormControl(
      disclosure.comment,
      [
        // Validators.required
      ]
    );

    this.patentFormGroup = new FormBuilder().group({
      patentNumber: this.patentNumber,
      patentPending: this.patentPending,
      patentIssued: this.patentIssued,
      patentLicensed: this.patentLicensed,
      patentRoyalties: this.patentRoyalties,
      patentLicensee: this.patentLicensee,
      comment: this.comment,
      yearDisclosed: this.yearDisclosed
    });
  }

  populateForm(disclosure: Disclosure): void {
    // clear out any errors
    this.patentFormGroup.setErrors({});

    this.selectedDisclosure = disclosure;

    this.patentNumber.setValue(disclosure.patentNumber);
    this.patentPending.setValue(FormUtilities.formatBooleanToString(disclosure.patentPending));
    this.patentIssued.setValue(FormUtilities.formatBooleanToString(disclosure.patentIssued));
    this.patentLicensed.setValue(FormUtilities.formatBooleanToString(disclosure.patentLicensed));
    this.patentRoyalties.setValue(FormUtilities.formatBooleanToString(disclosure.patentRoyalties));
    this.patentLicensee.setValue(FormUtilities.formatBooleanToString(disclosure.patentLicensee));
    this.yearDisclosed.setValue(disclosure.yearDisclosed);
    this.comment.setValue(disclosure.comment);

  }

  submitHandler(): void {
    this.patentFormGroup.markAsTouched();

    this.formSubmitted = true;
    if (this.patentFormGroup.valid) {
      this.formSubmitted = false;

      const values = this.patentFormGroup.value;

      const disclosure = Disclosure.copy(this.selectedDisclosure);
      disclosure.patentNumber = values.patentNumber;
      disclosure.patentPending = FormUtilities.formatStringToBoolean(values.patentPending);
      disclosure.patentIssued = FormUtilities.formatStringToBoolean(values.patentIssued);
      disclosure.patentLicensed = FormUtilities.formatStringToBoolean(values.patentLicensed);
      disclosure.patentRoyalties = FormUtilities.formatStringToBoolean(values.patentRoyalties);
      disclosure.patentLicensee = FormUtilities.formatStringToBoolean(values.patentLicensee);
      disclosure.yearDisclosed = values.yearDisclosed;

      disclosure.comment = values.comment;

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

  // local handler
  cancelHandler(): void {
    this.formSubmitted = false;
    // TODO: add some alert message to the user before wiping out any changes.

    // calls shared handler
    this.cancelCalled.emit('cancel');
  }

}
