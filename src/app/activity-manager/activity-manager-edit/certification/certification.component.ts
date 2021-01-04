import {Component, OnInit, Input, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormUtilities} from '../../../shared/helpers/form-utilities';
import {Exam} from '../../../shared/models/exam';
import {InputType} from '../../../shared/models/input-type';
import {FormsManagementDirective} from '../../../shared/helpers/forms.management.directive';
import {AccreditationBodies, AccreditationBodiesWithNone} from '../../../shared/models/accrediting-body';
import AccreditationTableConfigurations from '../../../shared/models/accreditation-table-configurations';
import LearningFormatOptions from '../../../shared/models/learning-format-options';
import {KeyValue} from '../../../shared/models/key-value';
import {ExamType} from '../../../shared/models/exam-type';
import {PermissionService} from '../../../shared/services/permission.service';
import {Media} from '../../../shared/models/media';
import Utilities from '../../../shared/utilities';

@Component({
  selector: 'app-certification',
  templateUrl: 'certification.component.html',

})
export class CertificationComponent extends FormsManagementDirective implements OnInit, AfterViewInit {
  @Input() selectedExam: Exam;

  activityCertificateHidden = false;
  accreditedCertificateHidden = false;
  providerCertificateHidden = false;
  providerNumberHidden = false;

  certificationFormGroup: FormGroup;
  accreditationTable: KeyValue[] = [];
  creditTypeOptions: KeyValue[] = [];
  learningFormatOptions: KeyValue[] = [];

  InputType = InputType;
  AccreditationBodies = AccreditationBodies;

  numberOfCreditsPlaceholder = null;
  numberOfCreditsLabel = null;

  private isFormLoaded: boolean = false;
  private get generalFormGroup(): FormGroup {
    return this.form.get('generalFormGroup') as FormGroup;
  }

  constructor(private permissionService: PermissionService,
              private changeDetector: ChangeDetectorRef) {
    super(permissionService);
  }

  ngOnInit() {
    this.initializeFormGroup(this.selectedExam);
    this.setSubscribers();

    if (this.selectedExam.id) {
      this.onCertificateChanged(this.selectedExam.certificate);
    }

    this.isFormLoaded = true;
    this.showSpinner = false;
  }

  ngAfterViewInit() {
    this.updateFormRequirementsBasedOnType(this.selectedExam.type);
  }

  initializeFormGroup(exam: Exam) {
    this.certificationFormGroup = new FormGroup({
      certificate: new FormControl(FormUtilities.formatStringToBoolean(exam.certificate), []),
      accreditedCertificate: new FormControl({
        value: FormUtilities.formatStringToBoolean(exam.accreditedCertificate), disabled: true
      }, [Validators.required]),
      providerCertificate: new FormControl({
        value: FormUtilities.formatStringToBoolean(exam.providerCertificate),
        disabled: true
      }, [Validators.required]),

      accreditingBody: new FormControl({value: exam.accreditingBody || 'NONE', disabled: true}, []),
      accreditationType: new FormControl({value: exam.accreditationType, disabled: true}, []),
      accreditingOrganizationName: new FormControl({value: exam.accreditingOrganizationName, disabled: true}, []),
      coProvider: new FormControl({value: exam.coProvider, disabled: true}, []),

      creditType: new FormControl({value: exam.creditType, disabled: true}, [Validators.required]),
      otherCreditType: new FormControl({value: exam.otherCreditType, disabled: true}, [Validators.required]),

      learningFormat: new FormControl({value: exam.learningFormat, disabled: true}, [Validators.required]),
      otherLearningFormat: new FormControl({value: exam.otherLearningFormat, disabled: true}, []),
      providerNumber: new FormControl({value: exam.providerNumber, disabled: true}),
      universalActivityNumber: new FormControl({value: exam.universalActivityNumber, disabled: true}),

      numberOfCredits: new FormControl({
        value: exam.numberOfCredits,
        disabled: true
      }, [Validators.required, Validators.min(0.25), Validators.max(40), Utilities.numberOfCreditsValidator]),
      lastCreditAwardedDate: new FormControl({
        value: exam.lastCreditAwardedDate,
        disabled: true
      }, [Validators.required, this.validateDateOrder()]),

      accreditingBodyLogo: new FormControl({value: exam.accreditingBodyLogo, disabled: true})
    });

    this.form.addControl('certificationFormGroup', this.certificationFormGroup);
  }

  validateDateOrder() {
    return (control: AbstractControl) => {
      const controlName = 'plannedExpireDate';
      const otherDate = this.generalFormGroup && this.generalFormGroup.get(controlName) && this.generalFormGroup.get(controlName).value;
      if (control.value && otherDate && (control.value < otherDate || control.value < FormUtilities.formatDateForInput(new Date()))) {
        return {minDate: true};
      }
      return null;
    };
  }

  setSubscribers() {
    this.certificationFormGroup.get('certificate').valueChanges.subscribe((certificate: boolean) => {
      this.onCertificateChanged(certificate);
    });

    this.certificationFormGroup.get('accreditedCertificate').valueChanges.subscribe((accreditedCertificate: boolean) => {
      this.setupAccreditingBodies(accreditedCertificate);
      this.onCertificateDetailChanged(accreditedCertificate, this.certificationFormGroup.get('providerCertificate').value);
    });

    this.certificationFormGroup.get('providerCertificate').valueChanges.subscribe((providerCertificate: boolean) => {
      this.onCertificateDetailChanged(this.certificationFormGroup.get('accreditedCertificate').value, providerCertificate);
    });

    this.certificationFormGroup.get('accreditingBody').valueChanges.subscribe((accreditingBody: string) => {
      this.onAccreditingBodyChanged(accreditingBody);
    });

    this.certificationFormGroup.get('accreditationType').valueChanges.subscribe((accreditationType: string) => {
      this.onAccreditationTypeChanged(accreditationType);
    });

    this.certificationFormGroup.get('creditType').valueChanges.subscribe((creditType: string) => {
      this.onCreditTypeChanged(creditType);
    });

    this.certificationFormGroup.get('learningFormat').valueChanges.subscribe((learningFormat: string) => {
      this.onLearningFormatChanged(learningFormat);
    });
  }

  onCertificateChanged(certificate: boolean) {
    FormUtilities.enableFormControls(this.certificationFormGroup, ['accreditedCertificate', 'providerCertificate', 'providerNumber'], certificate);
  }

  onCertificateDetailChanged(accreditedCertificate: boolean, providerCertificate: boolean) {
    FormUtilities.enableFormControls(this.certificationFormGroup, ['accreditingBody', 'coProvider']
      , this.certificationFormGroup.get('certificate').value && (accreditedCertificate || providerCertificate));
  }

  onAccreditingBodyChanged(accreditingBody: string) {
    const iAmEnabled = this.certificationFormGroup.get('accreditingBody').enabled;

    this.accreditationTable = AccreditationTableConfigurations.getAccreditationTable(accreditingBody);

    FormUtilities.enableFormControls(this.certificationFormGroup, ['accreditationType', 'numberOfCredits', 'lastCreditAwardedDate', 'accreditingBodyLogo']
      , iAmEnabled && accreditingBody && accreditingBody !== 'NONE');

    FormUtilities.enableFormControls(this.certificationFormGroup, ['otherLearningFormat']
      , iAmEnabled && accreditingBody && accreditingBody === 'NONE');

    FormUtilities.enableFormControls(this.certificationFormGroup, ['accreditingOrganizationName', 'otherCreditType']
      , iAmEnabled && accreditingBody === 'OTHER ACCREDITOR');

    FormUtilities.enableFormControls(this.certificationFormGroup, ['learningFormat']
      , iAmEnabled && accreditingBody !== 'NONE');

    FormUtilities.enableFormControls(
      this.certificationFormGroup,
      ['universalActivityNumber'],
      accreditingBody === 'ACPE'
    );

    // Broadly, if the accrediting body is ACGME, hide a bunch of these
    if (accreditingBody === 'ACGME') {
      FormUtilities.enableFormControls(
        this.certificationFormGroup,
        ['accreditationType', 'accreditingOrganizationName', 'creditType', 'otherCreditType',
         'numberOfCredits', 'lastCreditAwardedDate', 'learningFormat', 'otherLearningFormat'],
        false
      );
    }

    if (accreditingBody === 'ACPE') {
      this.numberOfCreditsPlaceholder = 'Enter maximum contact hours for completing this activity';
      this.numberOfCreditsLabel = 'Maximum number of contact hours';
    } else {
      this.numberOfCreditsPlaceholder = 'Enter credits in .25 increments';
      this.numberOfCreditsLabel = 'Maximum number of credits';
    }

    this.updateFormRequirementsBasedOnType(this.selectedExam.type);
  }

  onAccreditationTypeChanged(accreditationType: string) {
    const iAmEnabled = this.certificationFormGroup.get('accreditationType').enabled;

    if (this.accreditationTable.length > 0) {
      this.setDefaultOptionIfApplicable(accreditationType, this.accreditationTable, 'accreditationType');
    }

    this.creditTypeOptions = this.getCreditTypeOptionsBasedOnAccreditationType();

    const isCreditTypeEnabled = iAmEnabled &&
      this.certificationFormGroup.get('certificate').value &&
      (this.certificationFormGroup.get('accreditedCertificate').value || this.certificationFormGroup.get('providerCertificate').value);

    FormUtilities.enableFormControls(this.certificationFormGroup
      , ['creditType']
      , isCreditTypeEnabled);
  }

  setupAccreditingBodies(accreditedCertificate: boolean) {
    this.AccreditationBodies = accreditedCertificate ? AccreditationBodies : AccreditationBodiesWithNone;

    if (accreditedCertificate && this.certificationFormGroup.get('accreditingBody').value === 'NONE') {
      this.certificationFormGroup.get('accreditingBody').setValue('ACCME');
    }
  }

  getCreditTypeOptionsBasedOnAccreditationType(): KeyValue[] {
    if (this.certificationFormGroup.get('accreditationType').enabled) {
      const accreditationTypes = this.accreditationTable.find(a => a.key === this.certificationFormGroup.get('accreditationType').value);
      if (accreditationTypes) {
        return accreditationTypes.value['creditTypeOptions'];
      }
    }
    return [];
  }

  onCreditTypeChanged(creditType: string) {
    const iAmEnabled = this.certificationFormGroup.get('creditType').enabled;

    if (iAmEnabled && this.creditTypeOptions.length > 0) {
      this.setDefaultOptionIfApplicable(creditType, this.creditTypeOptions, 'creditType');
    }

    if (iAmEnabled && creditType) {
      this.learningFormatOptions = LearningFormatOptions.get().find(f => f.creditType === creditType).options;
    }

    if (iAmEnabled) {
      FormUtilities.enableFormControls(this.certificationFormGroup, ['otherCreditType']
        , this.certificationFormGroup.get('creditType').value === 'other');
    }
  }

  onLearningFormatChanged(learningFormat: string) {
    const iAmEnabled = this.certificationFormGroup.get('learningFormat').enabled;

    if (this.learningFormatOptions.length > 0) {
      this.setDefaultOptionIfApplicable(learningFormat, this.learningFormatOptions, 'learningFormat');

      if (iAmEnabled) {
        FormUtilities.enableFormControls(this.certificationFormGroup, ['otherLearningFormat']
          , learningFormat === 'other');
      }

    } else {
      this.certificationFormGroup.controls.learningFormat.disable({onlySelf: true, emitEvent: false});
    }
  }

  setDefaultOptionIfApplicable(key: string, options: KeyValue[], formControlName: string) {
    if ((key === null || key === undefined) || options.findIndex(c => c.key === key) === -1) {
      this.certificationFormGroup.get(formControlName).setValue(options[0].key);
    }
  }

  get otherCreditTypePlaceholder(): string {
    if (this.certificationFormGroup.get('accreditingBody').value === 'OTHER ACCREDITOR') {
      return 'Enter description of the credit type or contact hours that reader may claim, i.e. \'AMA PRA Category 1 Credit\'';
    } else if (this.certificationFormGroup.get('accreditingBody').value === 'INDEPENDENT') {
      return 'Enter description of the credit type or contact hours that reader may claim, i.e. \'Our Name study hours\'';
    }
    return '';
  }

  get isOtherAccreditorOrIndependent(): boolean {
    return this.certificationFormGroup.get('accreditingBody').value === 'OTHER ACCREDITOR' ||
      this.certificationFormGroup.get('accreditingBody').value === 'INDEPENDENT';
  }

  get otherLearningFormatLabel(): string {
    if (this.isOtherAccreditorOrIndependent || this.certificationFormGroup.get('learningFormat').disabled) {
      return 'Learning format / Activity type';
    } else {
      return 'Other learning format';
    }
  }

  emitSelectedImage(media: Media) {
    this.certificationFormGroup.get('accreditingBodyLogo').setValue(media);
  }

  updateFormRequirementsBasedOnType(type: ExamType) {
    const isAccredited = this.certificationFormGroup.get('accreditedCertificate').value;
    const accreditingBody = this.certificationFormGroup.get('accreditingBody').value;

    this.setupAccreditingBodies(isAccredited);

    switch (decodeURI(type)) {
      case ExamType.Other:
      case ExamType.SelfAssessment:
        FormUtilities.requireFormControls(this.certificationFormGroup, ['providerNumber'], (accreditingBody === 'CAPCE' || accreditingBody === 'ANCC'));
        break;

      case ExamType.ExamOrAssessment:
        this.activityCertificateHidden = true;
        this.accreditedCertificateHidden = true;
        this.providerCertificateHidden = true;
        this.providerNumberHidden = true;
        break;

      case ExamType.RevisionOrRefresher:
        this.activityCertificateHidden = true;
        this.accreditedCertificateHidden = true;
        this.providerNumberHidden = true;
        break;

      case ExamType.PreActivity:
        this.activityCertificateHidden = true;
        this.accreditedCertificateHidden = true;
        this.providerCertificateHidden = true;
        this.providerNumberHidden = true;
        break;

      case ExamType.PostActivity:
        this.activityCertificateHidden = true;
        this.accreditedCertificateHidden = true;
        this.providerCertificateHidden = true;
        this.providerNumberHidden = true;
        break;

    }
    this.changeDetector.detectChanges();
  }
}
