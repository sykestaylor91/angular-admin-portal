import {Exam} from '../../shared/models/exam';
import {FormGroup} from '@angular/forms';
import {Citation} from '../../shared/models/citation';

export class CitationsHandler {
  constructor(private form: FormGroup) {
  }

  static removeCitationIndex(editField: string, citationId: string) {
    if (editField) {
      const citationIdx = editField.indexOf(`/citation/${citationId}`);
      if (citationIdx === -1) {
        return;
      }

      const citationStartIdx = editField.indexOf('<a ', citationIdx - 10);
      const citationEndIdx = editField.indexOf('</a>', citationIdx);
      const citationHtml = editField.substring(citationStartIdx, citationEndIdx + 4);

      return editField.replace(new RegExp(citationHtml, 'gi'), '');
    }
  }

  rehydrateCitationFields(exam: Exam) {
    this.patchFormValue('generalFormGroup', 'disclaimer', exam.disclaimer);
    this.patchFormValue('copyrightFormGroup', 'copyright', exam.copyright);
    this.patchFormValue('copyrightFormGroup', 'otherInformation', exam.otherInformation);
    this.patchFormValue('introFormGroup', 'needs', exam.needs);
    this.patchFormValue('introFormGroup', 'educationObjectives', exam.educationObjectives);
    this.patchFormValue('introFormGroup', 'introduction', exam.introduction);
  }

  onCitationDeleted(citation: Citation) {
    this.replaceEditorCitationFields('generalFormGroup', 'disclaimer', citation.id);
    this.replaceEditorCitationFields('copyrightFormGroup', 'copyright', citation.id);
    this.replaceEditorCitationFields('copyrightFormGroup', 'otherInformation', citation.id);
    this.replaceEditorCitationFields('introFormGroup', 'needs', citation.id);
    this.replaceEditorCitationFields('introFormGroup', 'educationObjectives', citation.id);
    this.replaceEditorCitationFields('introFormGroup', 'introduction', citation.id);
  }

  getFormControl(formGroupName: string, fieldName: string) {
    return this.getFormGroup(formGroupName) && this.getFormGroup(formGroupName).get(fieldName).value;
  }

  getFormGroup(formGroupName: string): FormGroup | undefined {
    return this.form && this.form.get(formGroupName) as FormGroup;
  }

  patchFormValue(formGroupName: string, fieldName: string, value: any) {
    const formGroup: FormGroup = this.getFormGroup(formGroupName);
    if (formGroup && formGroup.get(fieldName)) {
      formGroup.get(fieldName).patchValue(value);
    }
  }

  replaceEditorCitationFields(formGroupName: string, fieldName: string, citationId: string) {
    this.patchFormValue(formGroupName, fieldName, CitationsHandler.removeCitationIndex(this.getFormControl(formGroupName, fieldName), citationId));
  }
}
