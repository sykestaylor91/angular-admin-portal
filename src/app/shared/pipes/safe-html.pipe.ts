import {Pipe, PipeTransform, Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import {LoggingService} from '../services/logging.service';

@Injectable()
@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value) {
    if (!environment.production) {
      LoggingService.warn('bypassing security', this.sanitized.bypassSecurityTrustHtml(value));
    }
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
