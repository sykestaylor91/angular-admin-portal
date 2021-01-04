import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'checkMark'
})
export class CheckMarkPipe implements PipeTransform {

  transform(value: boolean): any {

    let output = '';

    if (value === true) {
      output = '<i class="fa fa-check"></i>';
    }

    return output;
  }

}
