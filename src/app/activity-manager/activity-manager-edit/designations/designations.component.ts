import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';

import {
  FormBuilder,
  FormControl, FormGroup, Validators
} from '@angular/forms';

import {FormUtilities} from '../../../shared/helpers/form-utilities';
import {Exam} from '../../../shared/models/exam';
import {FormsManagementDirective} from '../../../shared/helpers/forms.management.directive';
import {InputType} from '../../../shared/models/input-type';
import {DesignationOptions} from '../../../shared/models/designation-options';
import {AttemptOptions} from '../../../shared/models/attempt-options';
import {ExamType} from '../../../shared/models/exam-type';
import {PermissionService} from '../../../shared/services/permission.service';

@Component({
  selector: 'app-designations',
  templateUrl: 'designations.component.html',
  styleUrls: ['./designations.component.scss']
})
export class DesignationsComponent extends FormsManagementDirective implements OnInit, AfterViewInit {
  @Input() selectedExam: Exam;
  allHidden = false;
  designationFormGroup: FormGroup;
  designationHidden = false;
  isAccredited = false;
  isTokensTrackingPriceChanges = true;
  maxAnswerAttemptsHidden = false;
  mocStatementHidden = true;
  passRateHidden = false;
  publishDisclosuresHidden = false;
  publishDisclosuresLocked = false;
  pricingHidden: boolean = false;

  InputType = InputType;
  DesignationOptions = DesignationOptions;
  AttemptOptions = AttemptOptions;

  private get certificationFormGroup(): FormGroup {
    return this.form.get('certificationFormGroup') as FormGroup;
  }

  constructor(private changeDetector: ChangeDetectorRef
    , private permissionService: PermissionService) {
    super(permissionService);
  }

  ngOnInit() {
    this.initializeForm();
    this.setSubscribers();
    this.showSpinner = false;
  }

  ngAfterViewInit() {
    this.isAccredited = this.certificationFormGroup.get('accreditedCertificate').value;
    this.updateFormRequirementsBasedOnType(this.selectedExam.type);

    this.certificationFormGroup.get('accreditedCertificate').valueChanges.subscribe(val => {
      this.isAccredited = val;
      this.updateFormRequirementsBasedOnType(this.selectedExam.type);
    });
    this.handleReadOnlyStatus();

    const accreditingBody = this.certificationFormGroup.get('accreditingBody').value;
    this.updateDesignationOptions(accreditingBody);
  }

  initializeForm() {
    this.designationFormGroup = new FormBuilder().group({
      tokens: new FormControl(this.selectedExam.tokens, []),
      price: new FormControl(this.selectedExam.price, []),
      publishDisclosures: new FormControl(FormUtilities.formatStringToBoolean(this.selectedExam.publishDisclosures)),
      designation: new FormControl(this.selectedExam.designation, []),
      mocStatement: new FormControl(this.selectedExam.mocStatement, []),
      passRate: new FormControl(this.selectedExam.passRate),
      levelOfDifficulty: new FormControl(this.selectedExam.levelOfDifficulty, []),
      maxAnswerAttempts: new FormControl(this.selectedExam.maxAnswerAttempts || 2, []),
      includeStatementOfVerification: new FormControl(FormUtilities.formatStringToBoolean(this.selectedExam.includeStatementOfVerification), [])
    });
    this.updateTokenTracker(this.selectedExam.tokens);

    this.form.addControl('designationFormGroup', this.designationFormGroup);
  }

  setSubscribers() {
    this.designationFormGroup.get('designation').valueChanges.subscribe((e) => this.designationChangeHandler(e));

    this.certificationFormGroup.get('accreditationType').valueChanges.subscribe((accreditationType: string) => {
      if (accreditationType === 'A' || 'B' || 'C' || 'D' || 'E' || 'F' || 'G' || 'H' || 'I' || 'J' || 'K' || 'L') {
        this.designationFormGroup.get('publishDisclosures').setValue('true');
      }
    });

    this.certificationFormGroup.get('accreditingBody').valueChanges.subscribe((accreditingBody: string) => {
      this.updateDesignationOptions(accreditingBody);
    });

    this.designationFormGroup.get('price').valueChanges.subscribe(value => {
      if (this.isTokensTrackingPriceChanges) {
        this.designationFormGroup.get('tokens').patchValue(value);
      }
    });

    this.designationFormGroup.get('tokens').valueChanges.subscribe(value => {
      this.updateTokenTracker(value);
    });
  }

  updateTokenTracker(value) {
    this.isTokensTrackingPriceChanges = value === this.designationFormGroup.get('price').value || (!value && !this.designationFormGroup.get('price').value);
  }

  updateDesignationOptions(accreditingBody: string) {
    if (accreditingBody === 'ACGME') {
      this.DesignationOptions = DesignationOptions.filter(o => o.key === 'other');
      this.designationFormGroup.get('designation').setValue('other');

      FormUtilities.enableFormControls(this.designationFormGroup, ['designation', 'mocStatement'], false);

    } else {
      this.DesignationOptions = DesignationOptions;

      FormUtilities.enableFormControls(this.designationFormGroup, ['designation', 'mocStatement'], true);
    }
    this.changeDetector.detectChanges();
  }

  designationChangeHandler(e) {
    this.mocStatementHidden = !(e === 'other');
  }

  updateFormRequirementsBasedOnType(type: string) {
    switch (decodeURI(type)) {
      case ExamType.Other:
        FormUtilities.requireFormControls(this.designationFormGroup, ['passRate', 'publishDisclosures', 'maxAnswerAttempts'], true);
        break;

      case ExamType.SelfAssessment:
        FormUtilities.requireFormControls(this.designationFormGroup, ['passRate', 'publishDisclosures', 'maxAnswerAttempts'], true);
        this.designationFormGroup.get('designation').clearValidators();
        this.publishDisclosuresLocked = false;
        if (this.isAccredited) {
          this.designationFormGroup.get('designation').setValidators([Validators.required]);
          this.designationFormGroup.get('publishDisclosures').patchValue(true);
          this.publishDisclosuresLocked = true;
        }
        break;

      case ExamType.ExamOrAssessment:
        this.pricingHidden = true;
        FormUtilities.requireFormControls(this.designationFormGroup, ['designation', 'publishDisclosures'], true);
        break;

      case ExamType.RevisionOrRefresher:
        this.publishDisclosuresHidden = true;
        this.designationHidden = true;
        this.passRateHidden = true;
        this.DesignationOptions = DesignationOptions.filter(o => o.key !== 'other');
        break;

      case ExamType.PreActivity:
        this.allHidden = true;
        this.maxAnswerAttemptsHidden = true;
        break;

      case ExamType.PostActivity:
        this.allHidden = true;
        this.maxAnswerAttemptsHidden = true;
        break;

    }
    this.changeDetector.detectChanges();
  }

  onLinkUnlinkPriceAndTokens(e) {
    this.isTokensTrackingPriceChanges = !this.isTokensTrackingPriceChanges;
    if (this.isTokensTrackingPriceChanges) {
      this.designationFormGroup.get('tokens').patchValue(this.designationFormGroup.get('price').value);
    }
  }

}
