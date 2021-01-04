import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {SpinnerManagement} from '../models/spinner-management';
import { Input, Directive } from '@angular/core';
import {environment} from '../../../environments/environment';
import {ActivityStatus} from '../models/activity-status';
import {FormUtilities} from './form-utilities';
import {PermissionService} from '../services/permission.service';

@Directive()
export abstract class FormsManagementDirective extends SpinnerManagement {
  @Input() form: FormGroup;

  protected constructor(protected _permissionService: PermissionService) {
    super();
  }

  private get userHasPermissionToBypassReadOnly(): boolean {
    return this._permissionService.usersRoleCanBypassReadOnly;
  }

  get isReadOnly(): boolean {
    if (this.form && this.form.get('editFormGroup')) {
      return this.form.get('editFormGroup').get('status').value === ActivityStatus.UnderReview && !this.userHasPermissionToBypassReadOnly;
    }
    return false;
  }

  get isFormDisabled() {
    return this.form && this.form.disabled || (this.form.get('disabled') && this.form.get('disabled').value);
  }

  get isValid() {
    if (this.form) {
      // if (!this.form.valid && !environment.production) {
      //   console.warn('Invalid Form', this.findInvalidControls());
      // }
      return this.form.valid;
    }
    return true;
  }

  // findInvalidControls(controls: { [key: string]: AbstractControl } = this.form.controls, invalid: Array<any> = []) {
  //   for (const name in controls) {
  //     if (controls[name].invalid) {
  //       if (!environment.production) {
  //         console.warn('error', name, controls[name].errors);
  //       }
  //       invalid.push(name);
  //       const control = controls[name];
  //       const fg = control as FormGroup;
  //       if (fg && fg.controls && Object.keys(fg.controls).length > 0) {
  //         this.findInvalidControls(fg.controls, invalid);
  //       }
  //     }
  //   }
  //   return invalid;
  // }

  isControlValid(formControlName: string): boolean {
    return this.form && this.form.controls[formControlName] && this.form.controls[formControlName].enabled && this.form.controls[formControlName].valid;
  }

  handleReadOnlyStatus() {
    if (this.isReadOnly && this.form) {
      this.form.disable();
      this.form.addControl('disabled', new FormControl(true));
      FormUtilities.enableFormControls(this.form.get('editFormGroup'), ['status'], true);
      FormUtilities.enableFormControls(this.form.get('generalFormGroup'), ['comments'], true);
    }
  }
}
