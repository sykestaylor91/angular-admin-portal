import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ExamService} from '../../../shared/services/exam.service';
import {EvaluationService} from '../../../shared/services/evaluation.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Exam} from '../../../shared/models/exam';
import {FormsManagementDirective} from '../../../shared/helpers/forms.management.directive';
import {InputType} from '../../../shared/models/input-type';
import {FormUtilities} from '../../../shared/helpers/form-utilities';
import {ExamType} from '../../../shared/models/exam-type';
import {PermissionService} from '../../../shared/services/permission.service';
import {ActivityIdentifier} from '../../../shared/models/activity-identifier';

@Component({
  selector: 'app-copyright',
  templateUrl: 'copyright.component.html'
})
export class CopyrightComponent extends FormsManagementDirective implements OnInit, AfterViewInit {
  @Input() selectedExam: Exam;

  copyrightFormGroup: FormGroup = new FormGroup({});
  courses: ActivityIdentifier[] = [];
  postCourseEvaluations: ActivityIdentifier[] = [];
  isAccredited = false;
  showSpinner: boolean;

  republicationRequestHidden = false;
  readerSupportHidden = false;
  otherInformationHidden = false;
  followOnActivityHidden = false;
  postActivityEvaluationHidden = false;

  InputType = InputType;

  constructor(private examService: ExamService,
              private permissionService: PermissionService,
              private evaluationService: EvaluationService,
              private changeDetector: ChangeDetectorRef) {
    super(permissionService);
  }

  ngOnInit() {
    this.initializeFormGroup(this.selectedExam);
    this.getAllExamsMetaData();
    this.getAllPostCourseEvaluationsMetaData();
    this.showSpinner = false;
  }

  ngAfterViewInit() {
    this.isAccredited = this.form.get('certificationFormGroup').get('accreditedCertificate').value;
    this.updateFormRequirementsBasedOnType(this.selectedExam.type);

    this.form.get('certificationFormGroup').get('accreditedCertificate').valueChanges.subscribe(val => {
      this.isAccredited = val;
      this.updateFormRequirementsBasedOnType(this.selectedExam.type);
    });
  }

  getAllExamsMetaData() {
    this.examService.getExamsMetaBy().subscribe(data => {
      this.courses = data;
    });
  }

  getAllPostCourseEvaluationsMetaData() {
    this.evaluationService.getAllEvaluationsMetaData().subscribe(data => {
      this.postCourseEvaluations = data;
    });
  }

  initializeFormGroup(exam: Exam) {
    this.copyrightFormGroup = new FormGroup({
      copyright: new FormControl(exam.copyright),
      republicationRequest: new FormControl(exam.republicationRequest),
      otherInformation: new FormControl(exam.otherInformation),
      postActivityEvaluation: new FormControl(exam.postActivityEvaluation),
      readerSupport: new FormControl(exam.readerSupport),
      followOnActivity: new FormControl(exam.followOnActivity)
    });
    this.form.addControl('copyrightFormGroup', this.copyrightFormGroup);
  }

  getExamPii(exam: Exam) {
    if (exam.title && exam.title.length > 0) {
      return exam.title;
    }
    if (exam.subtitle && exam.subtitle.length > 0) {
      return exam.subtitle;
    }
    return exam.id;
  }

  updateFormRequirementsBasedOnType(type: ExamType) {
    switch (decodeURI(type)) {
      case ExamType.Other:
        FormUtilities.requireFormControls(this.copyrightFormGroup, ['copyright', 'readerSupport'], true);
        break;

      case ExamType.SelfAssessment:
        FormUtilities.requireFormControls(this.copyrightFormGroup, ['copyright', 'readerSupport'], true);
        FormUtilities.requireFormControls(this.copyrightFormGroup, ['republicationRequest', 'postActivityEvaluation'], this.isAccredited);
        if (this.isAccredited) {
          const defaultAccreditedExam = this.postCourseEvaluations.filter(e => this.getExamPii(e).toLowerCase() === 'post activity evaluation 1');
          if (defaultAccreditedExam.length) {
            this.copyrightFormGroup.get('postActivityEvaluation').patchValue(defaultAccreditedExam[0].id);
          }
        }
        break;

      case ExamType.ExamOrAssessment:
        FormUtilities.requireFormControls(this.copyrightFormGroup, ['copyright', 'readerSupport'], true);
        break;

      case ExamType.RevisionOrRefresher:
        FormUtilities.requireFormControls(this.copyrightFormGroup, ['copyright', 'readerSupport'], false);
        break;

      case ExamType.PreActivity:
        this.republicationRequestHidden = true;
        this.readerSupportHidden = true;
        this.otherInformationHidden = true;
        this.postActivityEvaluationHidden = true;
        FormUtilities.requireFormControls(this.copyrightFormGroup, ['followOnActivity'], true);
        break;

      case ExamType.PostActivity:
        this.republicationRequestHidden = true;
        this.readerSupportHidden = true;
        this.otherInformationHidden = true;
        this.followOnActivityHidden = true;
        break;

    }
    this.changeDetector.detectChanges();
  }

}
