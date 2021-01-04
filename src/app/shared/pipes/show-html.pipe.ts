import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Injectable()
@Pipe({name: 'showHtml'})
export class ShowHtmlPipe implements PipeTransform {
  constructor() {
  }

  transform(value) {
    if (value) {
      return value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    }
  }
}
