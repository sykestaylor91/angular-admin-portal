import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'blank'
})
export class BlankPipe implements PipeTransform {
  transform(value: any, placeholder: string): any {
    if (!value || value === '') {
      return placeholder;
    } else {
      return value;
    }
  }
}
