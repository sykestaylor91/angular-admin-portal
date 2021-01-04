import {Pipe, PipeTransform, Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import {LoggingService} from '../services/logging.service';

@Injectable()
@Pipe({name: 'safeUrl'})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value) {
    if (!environment.production) {
      LoggingService.warn('bypassing security', this.sanitized.bypassSecurityTrustUrl(value));
    }
    return this.sanitized.bypassSecurityTrustUrl(value);
  }
}
