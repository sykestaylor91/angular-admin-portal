import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit
} from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import {Disclosure} from '../../../../shared/models/disclosure';

@Component({
  selector: 'app-edit-partnerships-detail',
  templateUrl: 'partnerships-detail.component.html',
})
export class PartnershipsDetailComponent implements OnInit, OnDestroy, AfterViewInit {

  public selectedDisclosure: Disclosure;
  private viewCreated: Boolean;

  // form
  partnershipsFormGroup: FormGroup;
  partnershipDetails: FormControl;
  formSubmitted: Boolean;
  showSpinner: Boolean;
  showDelete = false;
  private yearDisclosed: FormControl;

  @Input()
  set disclosureSetter(record: Disclosure) {
    this.selectedDisclosure = record || new Disclosure();

    this.showDelete = this.selectedDisclosure.status !== undefined;

    if (this.viewCreated) {
      this.populateForm(this.selectedDisclosure);
    }
  }

  @Output() cancelCalled = new EventEmitter();
  @Output() saveDisclosure = new EventEmitter();

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

    this.partnershipDetails = new FormControl(
      disclosure.partnershipDetails,
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

    this.partnershipsFormGroup = new FormBuilder().group({
      partnershipDetails: this.partnershipDetails,
      yearDisclosed: this.yearDisclosed
    });
  }

  populateForm(disclosure: Disclosure): void {
    this.partnershipsFormGroup.setErrors({});

    this.selectedDisclosure = disclosure;
    this.partnershipDetails.setValue(disclosure.partnershipDetails);
    this.yearDisclosed.setValue(disclosure.yearDisclosed);

  }

  submitHandler(): void {
    this.formSubmitted = true;

    if (this.partnershipsFormGroup.valid) {
      this.formSubmitted = false;
      const values = this.partnershipsFormGroup.value;
      const disclosure = Disclosure.copy(this.selectedDisclosure);

      disclosure.partnershipDetails = values.partnershipDetails;
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
