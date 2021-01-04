import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
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
  selector: 'app-edit-financial-detail',
  templateUrl: 'financial-detail.component.html',

})
export class FinancialDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  public selectedDisclosure: Disclosure;
  private viewCreated: Boolean;

  // form
  financialFormGroup: FormGroup;
  institution: FormControl;
  formSubmitted: Boolean;
  showSpinner: Boolean;
  showDelete = false;

  relationshipType: FormControl;
  startDate: FormControl;
  private endDate: FormControl;
  private comment: FormControl;
  private yearDisclosed: FormControl;

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
    this.institution = new FormControl(
      disclosure.institution || '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    );

    this.relationshipType = new FormControl(
      disclosure.relationshipType || '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    );

    this.startDate = new FormControl(
      FormUtilities.formatDateForInput(disclosure.startDate),
      [
        Validators.required
      ]
    );
    this.yearDisclosed = new FormControl(
      FormUtilities.formatDateForInput(disclosure.yearDisclosed),
      [
        Validators.required
      ]
    );
    this.endDate = new FormControl(FormUtilities.formatDateForInput(disclosure.endDate), []);
    this.comment = new FormControl(
      disclosure.comment,
      [
        // Validators.required
      ]
    );

    this.financialFormGroup = new FormBuilder().group({
      institution: this.institution,
      relationshipType: this.relationshipType,
      startDate: this.startDate,
      endDate: this.endDate,
      comment: this.comment,
      yearDisclosed: this.yearDisclosed
    });
  }

  populateForm(disclosure: Disclosure): void {
    // clear out any errors
    this.financialFormGroup.setErrors({});

    this.selectedDisclosure = disclosure;

    this.institution.setValue(disclosure.institution);
    this.relationshipType.setValue(disclosure.relationshipType);
    this.startDate.setValue(FormUtilities.formatDateForInput(disclosure.startDate));
    this.endDate.setValue(FormUtilities.formatDateForInput(disclosure.endDate));
    this.comment.setValue(disclosure.comment);
    this.yearDisclosed.setValue(disclosure.yearDisclosed);
  }

  submitHandler(): void {
    this.formSubmitted = true;

    if (this.financialFormGroup.valid) {
      this.formSubmitted = false;
      const values = this.financialFormGroup.value;
      const disclosure = Disclosure.copy(this.selectedDisclosure);

      disclosure.institution = values.institution;
      disclosure.relationshipType = values.relationshipType;
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

  cancelHandler(): void {
    this.formSubmitted = false;
    // TODO: add some alert message to the user before wiping out any changes.

    // calls shared handler
    this.cancelCalled.emit('cancel');
  }

}
