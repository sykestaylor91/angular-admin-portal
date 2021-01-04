import {PipeTransform, Pipe, Injectable} from '@angular/core';

@Injectable()
@Pipe({name: 'firstNChars'})
export class FirstNCharsPipe implements PipeTransform {
  transform(text: string, numberOfChars?: number): string {

    if (text) {
      const stringArray = text.split('');
      const highestIndex = numberOfChars || 10;

      if (stringArray.length > highestIndex) {
        stringArray.splice(highestIndex, (stringArray.length - (highestIndex - 3)));
        stringArray.push('...');
      }
      return stringArray.join('');
    } else {
      return '';
    }

  }
}
