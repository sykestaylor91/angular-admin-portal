import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Exam} from '../../../shared/models/exam';
import {FormsManagementDirective} from '../../../shared/helpers/forms.management.directive';
import {InputType} from '../../../shared/models/input-type';
import {FormUtilities} from '../../../shared/helpers/form-utilities';
import {ExamType} from '../../../shared/models/exam-type';
import {PermissionService} from '../../../shared/services/permission.service';

@Component({
  selector: 'app-introduction',
  templateUrl: 'introduction.component.html',
})
export class IntroductionComponent extends FormsManagementDirective implements OnInit {
  @Input() selectedExam: Exam;

  introFormGroup: FormGroup = new FormGroup({});
  needsHidden = false;
  educationObjectivesHidden = false;

  InputType = InputType;

  constructor(private permissionService: PermissionService) {
    super(permissionService);
  }

  ngOnInit() {
    this.initializeFormGroup(this.selectedExam);
    this.refreshForm(this.selectedExam);
  }

  initializeFormGroup(exam: Exam) {
    this.introFormGroup = new FormGroup({
      introduction: new FormControl(exam.introduction),
      educationObjectives: new FormControl(exam.educationObjectives),
      needs: new FormControl(exam.needs)
    });
    this.form.addControl('introFormGroup', this.introFormGroup);
  }

  refreshForm(exam: Exam) {
    this.showSpinner = true;
    this.selectedExam = exam;
    this.updateFormRequirementsBasedOnType(exam.type);
    this.handleReadOnlyStatus();
    this.showSpinner = false;
  }

  updateFormRequirementsBasedOnType(type: ExamType) {
    switch (decodeURI(type)) {
      case ExamType.Other:
        FormUtilities.requireFormControls(this.introFormGroup, ['needs', 'educationObjectives'], true);
        break;

      case ExamType.SelfAssessment:
        FormUtilities.requireFormControls(this.introFormGroup, ['needs', 'educationObjectives'], true);
        break;

      case ExamType.PreActivity:
        this.needsHidden = true;
        this.educationObjectivesHidden = true;
        break;

      case ExamType.PostActivity:
        this.needsHidden = true;
        this.educationObjectivesHidden = true;
        break;

    }
  }

}
