/**
 * Created by steve on 8/3/16.
 */

import * as moment from 'moment';
import {FormGroup, Validators} from '@angular/forms';
import {ValidatorFn} from '@angular/forms';

export class FormUtilities {

  static formatDateForInput(date: any): string {
    let myDate = '';

    if (date) {
      myDate = moment(date).utc().format('YYYY-MM-DD');
    }

    return myDate;
  }

  static createDate(val: any): Date {
    return moment(val).utc().toDate();
  }

  static formatBooleanToString(val: string | boolean): string {
    let myString = 'false';

    if (val) {
      myString = val.toString();
    }

    return myString;
  }

  static formatStringToBoolean(val: string | boolean): boolean {
    if (typeof val === 'boolean') {
      return val as boolean;
    }

    if (val) {
      if (val === 'true') {
        return true;
      }
    }

    return false;
  }

  static selectValidator(control) {
    let valid = null;

    if (control.value === 'pleaseSelect' || control.value === null) {
      valid = {'required': true};
    }

    return valid;
  }

  static enableFormControls(formGroup: FormGroup | any, controls: string[], isEnabled: boolean): void {
    if (formGroup) {
      controls.forEach(name => {
        const control = formGroup.get(name);
        if (isEnabled && control.disabled) {
          control.enable();
        } else if (!isEnabled && control.enabled) {
          control.disable();
        } else {
          control.updateValueAndValidity();
        }
      });
    }
  }

  static requireFormControls(formGroup: FormGroup, controls: string[], isRequired: boolean, otherValidators: {[key: string]: ValidatorFn[]} = {}): void {
    controls.forEach(name => {
      const control = formGroup.get(name);
      if (isRequired && !otherValidators[name]) {
        control.setValidators([Validators.required]);
      } else if (isRequired && otherValidators[name]) {
        control.setValidators([Validators.required].concat(otherValidators[name]));
      } else {
        control.clearValidators();
        if (otherValidators[name]) {
          control.setValidators(otherValidators[name]);
        }
      }
      // Validator won't run until the value changes, so force patch to current value
      control.patchValue(control.value);
    });
  }

}
