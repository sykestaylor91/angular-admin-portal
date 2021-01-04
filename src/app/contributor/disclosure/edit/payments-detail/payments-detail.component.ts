import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
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
  selector: 'app-edit-payments-detail',
  templateUrl: 'payments-detail.component.html',
})
export class PaymentsDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  public selectedDisclosure: Disclosure;
  private viewCreated = false;

  // form
  paymentFormGroup: FormGroup;

  // form controls
  institution: FormControl;
  grantProvided: FormControl;
  personalFee: FormControl;
  paidEmployee: FormControl;
  private otherFee: FormControl;
  private startDate: FormControl;
  private endDate: FormControl;
  private comment: FormControl;
  private yearDisclosed: FormControl;

  formSubmitted: Boolean;
  showSpinner: Boolean;
  showDelete = false;

  @Input()
  set disclosureSetter(record: Disclosure) {
    this.selectedDisclosure = record || new Disclosure();

    this.showDelete = this.selectedDisclosure && this.selectedDisclosure.status !== undefined;

    if (this.viewCreated) {
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
    this.institution = new FormControl(
      disclosure.institution || '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    );

    this.grantProvided = new FormControl(
      FormUtilities.formatBooleanToString(disclosure.grantProvided || true),
      [
        Validators.required
      ]
    );

    this.personalFee = new FormControl(
      FormUtilities.formatBooleanToString(disclosure.personalFee || true),
      [
        Validators.required
      ]
    );

    this.paidEmployee = new FormControl(
      FormUtilities.formatBooleanToString(disclosure.paidEmployee || true),
      [
        Validators.required
      ]
    );

    this.otherFee = new FormControl(
      FormUtilities.formatBooleanToString(disclosure.otherFee),
      [
        // Validators.required
      ]
    );

    this.startDate = new FormControl(
      FormUtilities.formatDateForInput(disclosure.startDate),
      [
        // Validators.required
      ]
    );

    this.endDate = new FormControl(
      FormUtilities.formatDateForInput(disclosure.endDate),
      [
        // Validators.required
      ]
    );
    this.yearDisclosed = new FormControl(
      FormUtilities.formatDateForInput(disclosure.yearDisclosed),
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

    this.paymentFormGroup = new FormBuilder().group({
      institution: this.institution,
      grantProvided: this.grantProvided,
      personalFee: this.personalFee,
      paidEmployee: this.paidEmployee,
      otherFee: this.otherFee,
      startDate: this.startDate,
      endDate: this.endDate,
      comment: this.comment,
      yearDisclosed: this.yearDisclosed
    });
  }

  populateForm(disclosure: Disclosure): void {
    // clear out any errors
    this.paymentFormGroup.setErrors({});

    this.selectedDisclosure = disclosure;

    this.institution.setValue(disclosure.institution);
    this.grantProvided.setValue(disclosure.grantProvided);
    this.personalFee.setValue(disclosure.personalFee);
    this.paidEmployee.setValue(disclosure.paidEmployee);
    this.otherFee.setValue(disclosure.otherFee);
    this.startDate.setValue(disclosure.startDate);
    this.endDate.setValue(disclosure.endDate);
    this.comment.setValue(disclosure.comment);
    this.yearDisclosed.setValue(disclosure.yearDisclosed);
  }

  submitHandler(): void {
    this.paymentFormGroup.markAsTouched();

    this.formSubmitted = true;
    if (this.paymentFormGroup) {
      this.formSubmitted = false;

      const values = this.paymentFormGroup.value;

      const disclosure = Disclosure.copy(this.selectedDisclosure);
      disclosure.institution = values.institution;
      disclosure.grantProvided = values.grantProvided;
      disclosure.personalFee = values.personalFee;
      disclosure.paidEmployee = values.paidEmployee;
      disclosure.otherFee = values.otherFee;
      disclosure.startDate = FormUtilities.createDate(values.startDate);
      disclosure.endDate = FormUtilities.createDate(values.endDate);
      disclosure.comment = values.comment;
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

  // local handler
  cancelHandler(): void {
    this.formSubmitted = false;
    // calls shared handler
    this.cancelCalled.emit('cancel');
  }

}
