import {ChangeDetectorRef, Component, forwardRef, Input, OnInit} from '@angular/core';
import {AbstractControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {InputType} from '../models/input-type';
import {CustomAccessorHandlerDirective} from '../helpers/custom-accessor.handler.directive';

@Component({
  selector: 'app-change-history-input-component',
  templateUrl: './change-history-input.component.html',
  styleUrls: ['./change-history-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChangeHistoryInputComponent),
      multi: true
    }
  ]
})
export class ChangeHistoryInputComponent extends CustomAccessorHandlerDirective<string | number | null> implements OnInit {
  @Input() resourceElement: string;
  @Input() selectedResource: any ;
  @Input() inputType: InputType = InputType.Text;
  @Input() min: number = 1;
  @Input() max: number = Number.MAX_SAFE_INTEGER;
  @Input() step: number = 1;
  @Input() maxLength: number = -1;
  @Input() label: string;
  @Input() errorLabel: string;
  @Input() fieldName: string;
  @Input() units: string = '';
  @Input() tooltip: string;
  @Input() cssClass: string = '';
  @Input() placeholder: string;
  @Input() formGroup: AbstractControl;
  @Input() showCommentChangeHistory: boolean = true;
  @Input() originalValue: string;
  @Input() hideIfDisabled: boolean = false;
  @Input() hint: string;
  @Input() options: any[];

  currentValue: string;
  hasFormGroup: boolean = false;
  currentControl: AbstractControl | null;
  required: boolean = null;
  showHint: boolean = false;
  InputType = InputType;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.currentControl = this.formGroup.get(this.resourceElement);
    this.hasFormGroup = !!(this.formGroup);
  }

  get showChanged(): boolean {
    if (this.hasFormGroup) {
      const origValue = this.getOriginalValue();
      this.currentValue = this.formGroup.get(this.resourceElement).value || '';
      if (origValue !== this.currentValue) {
        return this.formGroup.get(this.resourceElement) && this.formGroup.get(this.resourceElement).dirty;
      }
      return false;
    }
  }

  get isRequiredCustom(): boolean {
    if (this.isRequired) {
      return this.isRequired;
    }

    let tempRequired: boolean;
    if (this.currentControl && this.currentControl.validator && this.currentControl.validator({} as AbstractControl)) {
      tempRequired = this.currentControl.validator({} as AbstractControl).required;
    } else {
      tempRequired = false;
    }

    if (tempRequired !== this.required) {
      this.required = tempRequired;
      this.changeDetectorRef.detectChanges();
    }

    return this.required;
  }

  get hasErrorCustom(): boolean {
    if (this.hasError) {
      return this.hasError;
    }

    if (this.currentControl && this.currentControl.enabled) {
      return !this.currentControl.valid;
    }
    return false;
  }

  get isHiddenCustom(): boolean {
    if (!this.hideIfDisabled) {
      return this.isHidden;
    }

    return this.isHidden || (this.currentControl && this.currentControl.disabled);
  }

  get optionalMaxLength(): number | undefined {
    if (this.maxLength > -1) {
      return this.maxLength;
    }
    if (this.inputType === InputType.Number) {
      return (this.max + '').length;
    }
    return undefined;
  }

  getOriginalValue() {
    return this.originalValue || this.selectedResource[this.resourceElement] || '';
  }

  onUpdateValue(value: string | number | null): void {
    this.propagateChange(value);
  }

  onUseThisVersionClicked(value: string): void {
    this.writeValue(value);
    this.onUpdateValue(value);
  }
}
