import {Injectable} from '@angular/core';
import {Invitation} from '../models/invitation';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class InvitationService {
  resource = 'invitation';

  constructor(private http: HttpBaseService) {
  }

  findById( id: string ): Observable<Invitation> {
    return this.http.get<any>(`${this.resource}/find/${id}`)
      .pipe(
        map((data: any) => data.invitation)
      );
  }

  query(): Observable<Invitation[]> {
    return this.http.get<any>(`${this.resource}/query`)
      .pipe(
        map((data: any) => data.invitation)
      );
  }

  save(invitation: Invitation): Observable<Invitation> {
    return this.http.post<any>(`${this.resource}/save`, invitation)
      .pipe(
        map((data: any) => data.invitation)
      );
  }

  remove(invitation: Invitation): Observable<Invitation> {
    invitation.status = 'deleted';
    return this.http.post<any>(`${this.resource}/save`, invitation)
      .pipe(
        map((data: any) => data.invitation)
      );
  }

  sendInvite(invitation) {
    throw new Error('Not implemented');
  }
}
