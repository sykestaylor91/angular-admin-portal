import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Injectable()
@Pipe({name: 'firstNWords'})
export class FirstNWordsPipe implements PipeTransform {

  transform(text: string, numberOfWords?: number): string {
    if (text) {
      const stringArray = text.split(' ');
      const highestIndex = numberOfWords || 6;

      if (stringArray.length > highestIndex) {
        stringArray.splice(highestIndex, (stringArray.length - highestIndex));
        stringArray[highestIndex] += '...';
      }
      return stringArray.join(' ');
    } else {
      return '';
    }

  }
}
