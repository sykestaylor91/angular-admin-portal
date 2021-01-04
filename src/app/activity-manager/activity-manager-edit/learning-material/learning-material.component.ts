import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';

import {
  FormGroup,
  FormArray,
  FormBuilder, Validators
} from '@angular/forms';

import {Exam} from '../../../shared/models/exam';
import {FormsManagementDirective} from '../../../shared/helpers/forms.management.directive';
import {LearningMaterial} from '../../../shared/models/learning-material';
import {InputType} from '../../../shared/models/input-type';
import {ExamType} from '../../../shared/models/exam-type';
import {PermissionService} from '../../../shared/services/permission.service';

@Component({
  selector: 'app-learning-material',
  templateUrl: 'learning-material.component.html',
  styleUrls: ['learning-material.component.scss'],
})
export class LearningMaterialComponent extends FormsManagementDirective implements OnInit, AfterViewInit {
  @Input() selectedExam: Exam;

  learningMaterialFormGroup: FormGroup;
  InputType = InputType;
  showSpinner = true;
  isAccredited = false;
  hideAll = false;

  constructor(private formBuilder: FormBuilder
    , private permissionService: PermissionService
    , private changeDetector: ChangeDetectorRef) {
    super(permissionService);
  }

  ngOnInit() {
    this.initializeFormGroup(this.selectedExam);
    this.updateFormRequirementsBasedOnType(this.selectedExam.type);
    this.showSpinner = false;
  }

  ngAfterViewInit() {
    this.isAccredited = this.form.get('certificationFormGroup').get('accreditedCertificate').value;
    this.changeDetector.detectChanges();

    this.form.get('certificationFormGroup').get('accreditedCertificate').valueChanges.subscribe(val => {
      this.isAccredited = val;
      this.updateFormRequirementsBasedOnType(this.selectedExam.type);
    });

    this.handleReadOnlyStatus();
  }

  initializeFormGroup(exam: Exam) {
    this.form.removeControl('learningMaterialFormGroup');

    exam.learningMaterial = this.convertIfWrongFormat(exam.learningMaterial);

    this.learningMaterialFormGroup = new FormGroup({
      learningMaterial: new FormArray([]),
    });

    if (exam.learningMaterial && exam.learningMaterial.length > 0) {
      exam.learningMaterial.forEach(lm => {
        this.addLearningMaterialToFormArray(lm);
      });
    } else {
      // this.addLearningMaterialToFormArray(this.blankLearningMaterial);
    }

    this.form.addControl('learningMaterialFormGroup', this.learningMaterialFormGroup);
  }

  convertIfWrongFormat(learningMaterial: any) {
    if (typeof learningMaterial === 'string' || (learningMaterial === null || learningMaterial === undefined)) {
      return [{heading: '', loe: '', text: learningMaterial}];
    } else {
      if (Array.isArray(learningMaterial) && Object.keys(learningMaterial[0]).length === 0) {
        return this.blankLearningMaterial;
      }
      return learningMaterial;
    }
  }

  addLearningMaterial() {
    this.addLearningMaterialToFormArray(this.blankLearningMaterial);
  }

  removeLearningMaterial(i) {
    this.learningMaterials.removeAt(i);
    if (this.selectedExam.learningMaterial && this.selectedExam.learningMaterial[i]) {
      this.selectedExam.learningMaterial.splice(i, 1);  // we should be handling changes through the fg only, not this
    }
  }

  getOriginalText(i: number): string {
    return (i < this.selectedExam.learningMaterial.length && this.selectedExam.learningMaterial[i].text) ? this.selectedExam.learningMaterial[i].text : '';
  }

  get learningMaterials(): FormArray {
    return this.learningMaterialFormGroup.get('learningMaterial') as FormArray;
  }

  private addLearningMaterialToFormArray(lm: LearningMaterial) {
    // const lmg = new FormGroup({lm: new FormControl(lm)});
    this.learningMaterials.push(this.formBuilder.group(lm));
    this.updateFormRequirementsBasedOnType(this.selectedExam.type);
  }

  private get blankLearningMaterial(): LearningMaterial {
    return {heading: '', loe: '', text: ''};
  }

  updateFormRequirementsBasedOnType(type: string) {
    switch (decodeURI(type)) {
      case ExamType.SelfAssessment:
        if (this.isAccredited) {
          this.learningMaterials.controls.forEach(control => {
            control.setValidators([Validators.required]);
          });
        }
        break;

      case ExamType.ExamOrAssessment:

      case ExamType.PreActivity:
      case ExamType.PostActivity:
        this.hideAll = true;
        break;
    }
    this.changeDetector.detectChanges();
  }
}
