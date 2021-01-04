import { Input, Directive } from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {environment} from '../../../environments/environment';

@Directive()
export abstract class CustomAccessorHandlerDirective<M = any, R = any> implements ControlValueAccessor {
  @Input() isHidden: boolean = false;
  @Input() hasError: boolean = false;
  @Input() isRequired: boolean = false;
  @Input() isDisabled: boolean = false;

  modelValue: M;

  propagateChange: Function = (value: R) => null;

  protected constructor(private name: string = '') {
    if (!environment.production) {
        console.log('CustomAccessorHandler:name', name);
    }
  }

  writeValue(value: M): void {
    if (!environment.production) {
        console.log('CustomAccessorHandler:writeValue', this.name, value);
    }
    this.modelValue = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
