import {
  AfterViewInit, ChangeDetectorRef,
  Component, Input,
  OnInit
} from '@angular/core';
import {
  AbstractControl,
  FormControl, FormGroup, Validators,
} from '@angular/forms';
import {Exam, ReviewType} from '../../../shared/models/exam';
import {FormUtilities} from '../../../shared/helpers/form-utilities';
import {FormsManagementDirective} from '../../../shared/helpers/forms.management.directive';
import {union} from 'lodash';
import {InputType} from '../../../shared/models/input-type';
import {ExamType} from '../../../shared/models/exam-type';
import AccreditationTableConfigurations from '../../../shared/models/accreditation-table-configurations';
import {PermissionService} from '../../../shared/services/permission.service';

@Component({
  selector: 'app-edit-general-information',
  templateUrl: 'general-information.component.html',
  styleUrls: ['general-information.component.scss'],
  providers: []
})
export class GeneralInformationComponent extends FormsManagementDirective implements OnInit, AfterViewInit {
  @Input() selectedExam: Exam;

  titleHidden: boolean = false;
  subtitleHidden: boolean = false;
  otherTypeHidden: boolean = false;
  providerCourseIdHidden: boolean = false;
  universalActivityNumber: boolean = false;
  learningAssessmentModeHidden: boolean = false;
  studyModeHidden: boolean = false;
  examModeHidden: boolean = false;
  welcomeMessageHidden: boolean = false;
  disclosureOfCommercialSupportHidden: boolean = false;
  plannedPublicationDateHidden: boolean = false;
  plannedExpireDateHidden: boolean = false;
  courseImageHidden: boolean = false;
  targetAudienceHidden: boolean = false;
  disclaimerHidden: boolean = false;
  estimatedCompletionTimeHidden: boolean = false;
  reviewTypeHidden: boolean = false;

  isAccredited = false;
  accreditingBody: any;
  generalFormGroup: FormGroup = new FormGroup({});

  plannedExpireValidators = [this.validateDateOrder('plannedPublicationDate', (thisDate, otherDate) => thisDate < otherDate)];

  private readonly today = new Date();

  InputType = InputType;
  ReviewType = ReviewType;

  modeSelected = false;

  constructor(private changeDetector: ChangeDetectorRef
    , private permissionService: PermissionService) {
    super(permissionService);
  }

  ngOnInit() {
    this.initializeFormGroup(this.selectedExam);
    this.showSpinner = false;
  }

  ngAfterViewInit() {
    this.isAccredited = this.form.get('certificationFormGroup').get('accreditedCertificate').value;
    this.accreditingBody = this.form.get('certificationFormGroup').get('accreditingBody').value;
    this.updateModesEnabled();
    this.updateFormRequirementsBasedOnType(this.selectedExam.type);

    this.form.get('certificationFormGroup').get('accreditedCertificate').valueChanges.subscribe(val => {
      this.isAccredited = val;
      this.updateFormRequirementsBasedOnType(this.selectedExam.type);
    });
    this.form.get('certificationFormGroup').get('accreditingBody').valueChanges.subscribe(val => {
      this.accreditingBody = val;
      this.updateFormRequirementsBasedOnType(this.selectedExam.type);
    });
  }

  getConvertedComments(comments) {
    if (comments && Array.isArray(comments)) {
      // It may be necess to parse the array to convert to an object, but I looked
      // through about 20 records in redis and didn't any exams with comments that were arrays
      return {};
    }
    return comments;
  }

  updateModesEnabled() {
    this.isAccredited = this.form.get('certificationFormGroup').get('accreditedCertificate').value;
    FormUtilities.enableFormControls(this.generalFormGroup, ['normalModeAllowed', 'studyModeAllowed', 'examModeAllowed'], true);
    const learningModeAllowed = this.generalFormGroup.get('normalModeAllowed').value;
    const studyModeAllowed = this.generalFormGroup.get('studyModeAllowed').value;
    const examModeAllowed = this.generalFormGroup.get('examModeAllowed').value;
    if (learningModeAllowed || studyModeAllowed) {
      this.modeSelected = true;
      this.generalFormGroup.get('examModeAllowed').disable();
      if (examModeAllowed) {
        this.generalFormGroup.get('examModeAllowed').patchValue(false);
      }
    } else if (examModeAllowed) {
      this.modeSelected = true;
      FormUtilities.enableFormControls(this.generalFormGroup, ['normalModeAllowed', 'studyModeAllowed'], false);
      if (learningModeAllowed) {
        this.generalFormGroup.get('normalModeAllowed').patchValue(false);
      }
      if (studyModeAllowed) {
        this.generalFormGroup.get('studyModeAllowed').patchValue(false);
      }
    } else {
      this.modeSelected = false;
    }
  }

  initializeFormGroup(exam: Exam) {
    this.generalFormGroup = new FormGroup({
      otherType: new FormControl({
        value: exam.otherType,
        disabled: false
      }, [Validators.minLength(3)]),
      title: new FormControl(exam.title, [Validators.minLength(3), Validators.maxLength(199), Validators.required]),
      subtitle: new FormControl(exam.subtitle),
      providerCourseId: new FormControl(exam.providerCourseId),
      estimatedCompletionTime: new FormControl(exam.estimatedCompletionTime),
      normalModeAllowed: new FormControl(exam.normalModeAllowed),
      studyModeAllowed: new FormControl(exam.studyModeAllowed),
      examModeAllowed: new FormControl(exam.examModeAllowed),
      welcomeMessage: new FormControl(exam.welcomeMessage, []),
      disclosureOfCommercialSupport: new FormControl(exam.disclosureOfCommercialSupport, []),
      plannedPublicationDate: new FormControl(FormUtilities.formatDateForInput(exam.plannedPublicationDate),
        [this.validateDateOrder('plannedExpireDate', (thisDate, otherDate) => thisDate > otherDate)]),
      plannedExpireDate: new FormControl(FormUtilities.formatDateForInput(exam.plannedExpireDate), this.plannedExpireValidators),
      courseImage: new FormControl(exam.courseImage),
      targetAudience: new FormControl(exam.targetAudience, []),
      disclaimer: new FormControl(exam.disclaimer),
      comments: new FormControl(this.getConvertedComments(exam.comments)),
      type: new FormControl(exam.type || 'pleaseSelect', []),
      citations: new FormControl(exam.citations), // not sure if this needs to be at a higher level
      // reviewRequired: new FormControl(exam.reviewRequired),
      reviewType: new FormControl(exam.reviewType),
      useSecurity: new FormControl(exam.useSecurity)
    });
    this.form.addControl('generalFormGroup', this.generalFormGroup);
  }

  validateDateOrder(controlName: string, order: (thisDate, otherDate) => boolean) {
    return (control: AbstractControl) => {
      const otherDate = this.generalFormGroup && this.generalFormGroup.get(controlName) && this.generalFormGroup.get(controlName).value;
      if (control.value && otherDate && (order(control.value, otherDate) || control.value < FormUtilities.formatDateForInput(this.today))) {
        return {minDate: true};
      }
      return null;
    };
  }

  updateFormRequirementsBasedOnType(type: string) {
    const accreditationTables = AccreditationTableConfigurations.getAccreditationTable(this.accreditingBody).map(a => a.key);

    // We need to convert these to using enums
    switch (decodeURI(type)) {
      case ExamType.Other:
        FormUtilities.requireFormControls(this.generalFormGroup, ['estimatedCompletionTime', 'disclosureOfCommercialSupport', 'welcomeMessage', 'plannedExpireDate'], true,
          {'plannedExpireDate': this.plannedExpireValidators});
        break;

      case ExamType.SelfAssessment:
        this.otherTypeHidden = true;
        this.examModeHidden = true;
        FormUtilities.enableFormControls(this.generalFormGroup, ['normalModeAllowed', 'studyModeAllowed'], true);
        FormUtilities.requireFormControls(this.generalFormGroup, ['reviewType', 'estimatedCompletionTime', 'disclosureOfCommercialSupport', 'targetAudience'], this.isAccredited);
        this.generalFormGroup.get('providerCourseId').clearValidators();
        FormUtilities.requireFormControls(this.generalFormGroup, ['welcomeMessage', 'plannedExpireDate'], true,
          {'plannedExpireDate': this.plannedExpireValidators});
        if (this.isAccredited) {
          this.generalFormGroup.get('normalModeAllowed').patchValue(true);
          this.generalFormGroup.get('studyModeAllowed').patchValue(true);
          FormUtilities.enableFormControls(this.generalFormGroup, ['normalModeAllowed', 'studyModeAllowed'], false);
          const acpeTables = AccreditationTableConfigurations.acpeAccreditationTableContent.map(a => a.key);
          const capceTables = AccreditationTableConfigurations.CapceAccreditationTableContent.map(a => a.key);
          if (union(acpeTables, capceTables).some(a => accreditationTables.indexOf(a) > -1)) {
            FormUtilities.requireFormControls(this.generalFormGroup, ['providerCourseId'], true);
          }
        }
        break;

      case ExamType.ExamOrAssessment:
        this.otherTypeHidden = true;
        this.learningAssessmentModeHidden = true;
        this.studyModeHidden = true;
        this.generalFormGroup.get('examModeAllowed').setValue(true);
        FormUtilities.requireFormControls(this.generalFormGroup, ['estimatedCompletionTime', 'disclosureOfCommercialSupport', 'welcomeMessage', 'plannedExpireDate'], true,
          {'plannedExpireDate': this.plannedExpireValidators});
        break;

      case ExamType.RevisionOrRefresher:
        this.otherTypeHidden = true;
        this.learningAssessmentModeHidden = true;
        this.studyModeHidden = true;
        this.examModeHidden = true;
        this.generalFormGroup.get('normalModeAllowed').setValue(true);
        break;

      case ExamType.PreActivity:
        this.otherTypeHidden = true;
        this.learningAssessmentModeHidden = true;
        this.studyModeHidden = true;
        this.examModeHidden = true;
        this.estimatedCompletionTimeHidden = true;
        this.plannedExpireDateHidden = true;
        this.disclosureOfCommercialSupportHidden = true;
        this.courseImageHidden = true;
        this.targetAudienceHidden = true;
        this.reviewTypeHidden = true;
        break;

      case ExamType.PostActivity:
        this.otherTypeHidden = true;
        this.learningAssessmentModeHidden = true;
        this.studyModeHidden = true;
        this.examModeHidden = true;
        this.estimatedCompletionTimeHidden = true;
        this.plannedExpireDateHidden = true;
        this.disclosureOfCommercialSupportHidden = true;
        this.courseImageHidden = true;
        this.targetAudienceHidden = true;
        this.reviewTypeHidden = true;
        break;

    }
    this.changeDetector.detectChanges();
  }

  onCourseImageSelected(image) {
    if (image) {
      this.generalFormGroup.get('courseImage').setValue(image.id);
    } else {
      this.generalFormGroup.get('courseImage').setValue(null);
    }
  }
}
