import {Injectable} from '@angular/core';
import {HttpBaseService} from './http-base.service';
import {EmailTemplate} from '../models/email-template';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class EmailService {
  private resource = 'email';

  constructor(private http: HttpBaseService) {
  }

  sendEmailTemplate(email: EmailTemplate): Observable<EmailTemplate> {
    return this.http.post<any>(`${this.resource}/sendTemplate`, email, 'application/json')
      .pipe(map((data: any) => data.email));
  }
}
