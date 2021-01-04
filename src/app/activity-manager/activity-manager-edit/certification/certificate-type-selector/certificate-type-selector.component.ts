import {Component, forwardRef, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {CustomAccessorHandlerDirective} from '../../../../shared/helpers/custom-accessor.handler.directive';

@Component({
  selector: 'app-certificate-type-selector',
  templateUrl: './certificate-type-selector.component.html',
  styleUrls: ['./certificate-type-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CertificateTypeSelectorComponent),
      multi: true
    }
  ]
})
export class CertificateTypeSelectorComponent extends CustomAccessorHandlerDirective<boolean> {
  @Input() label: string;
  @Input() cssClass: string;

  constructor() {
    super();
  }

  onUpdateValue(value) {
    this.propagateChange(value);
  }
}
