import {AbstractControl, ValidatorFn} from '@angular/forms';
import {FormGroup} from '@angular/forms';

export class CustomValidator {

  static readonly EMAIL_REGEX = new RegExp('(?!.*\\.\\.)(^[^\\.][^@\\s]+@[^@\\s]+\\.[^@\\s\\.]+$)', 'i');

  static get emailFormat(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const val = control.value;
      if (val != null && val !== '' && (val.length <= 5 || !CustomValidator.EMAIL_REGEX.test(val))) {
        return {'invalidemail': true};
      }

      return null;
    };
  }

  static get noWhitespace(): ValidatorFn {
    const isEmpty = (value) => {
      return (value.toString() || '').trim().length === 0;
    };

    return (control: AbstractControl): { [key: string]: any } => {
      let isValid: boolean = true;

      if (control.value) {
        if (!Array.isArray(control.value)) {
          isValid = !isEmpty(control.value);
        } else {
          isValid = !control.value.some(obj => isEmpty(obj));
        }
      }

      return isValid ? null : {'whitespace': true};
    };
  }

  static readonly PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\!\@\#\$\%\^\&\*])[0-9a-zA-Z\!\@\#\$\%\^\&\*]{8,15}$/;

  static get passwordPolicy(): ValidatorFn {

    // regex and min length have to be consistend with Auth0 setup in
    // * Connections / Database / 'Username-Password-Authentication' -> Password Policy
    //
    // currently:
    // + Special characters (!@#$%^&*)
    // + Lower case (a-z), upper case (A-Z) and numbers (0-9)
    // + Must have 8 characters in length
    // + Non-empty password required

    return (control: AbstractControl): { [key: string]: any } => {
      const val = control.value;
      if (val != null && val !== '' &&
          (val.length <= 8 || !CustomValidator.PASSWORD_REGEX.test(val))) {
        return {'invalidpassword': true};
      }

      return null;
    };
  }

  static matchPassword(group: FormGroup) {

     const password = group.controls.password.value;
     const confirmPassword = group.controls.confirmPassword.value;

      if ( password !== confirmPassword ) {
          console.log('MatchPassword: false');
          group.controls.confirmPassword.setErrors( { confirmPassword: true} );
          return {confirmPassword: true};
      } else {
          console.log('MatchPassword: true');
          return null;
      }
  }

}
