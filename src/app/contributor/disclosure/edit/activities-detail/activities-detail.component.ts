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
  selector: 'app-disclosure-edit-activities-detail',
  templateUrl: 'activities-detail.component.html',
})
export class ActivitiesDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() cancelCalled = new EventEmitter();
  @Output() saveDisclosure = new EventEmitter();
  selectedDisclosure: Disclosure;
  activitiesFormGroup: FormGroup;
  activityDetails: FormControl;
  formSubmitted: Boolean;
  showSpinner: Boolean;
  showDelete = false;
  private viewCreated: Boolean;
  private yearDisclosed: FormControl;

  constructor() {
  }

  @Input()
  set disclosureSetter(record: Disclosure) {
    this.selectedDisclosure = record || new Disclosure();
    this.showDelete = this.selectedDisclosure && this.selectedDisclosure.status !== undefined;

    if (this.viewCreated) {
      this.populateForm(this.selectedDisclosure);
    }
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
    this.yearDisclosed = new FormControl(
      disclosure.yearDisclosed,
      [
        Validators.required
      ]
    );

    this.activityDetails = new FormControl(
      disclosure.activityDetails,
      [
        Validators.required
      ]
    );

    this.activitiesFormGroup = new FormBuilder().group({
      activityDetails: this.activityDetails,
      yearDisclosed: this.yearDisclosed
    });
  }

  populateForm(disclosure: Disclosure): void {
    // clear out any errors
    this.activitiesFormGroup.setErrors({});
    this.selectedDisclosure = disclosure;
    this.activityDetails.setValue(disclosure.activityDetails);
    this.yearDisclosed.setValue(disclosure.yearDisclosed);
  }

  submitHandler(): void {
    this.formSubmitted = true;

    if (this.activitiesFormGroup.valid) {
      this.formSubmitted = false;
      const values = this.activitiesFormGroup.value;
      const disclosure = Disclosure.copy(this.selectedDisclosure);
      disclosure.activityDetails = values.activityDetails;
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
