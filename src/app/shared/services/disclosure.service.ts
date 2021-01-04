import {Injectable} from '@angular/core';
import {Disclosure} from '../models/disclosure';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class DisclosureService {
  selectedContributorId: string;  // TODO: God Service - 7 usages
  // TODO : need to create a session service to return the current session details, logged in user
  private resource = 'disclosure';

  constructor(private http: HttpBaseService) {
  }

  // pass in user to enable admin/commenter's to add/modify reviewer comments
  query(userId: string): Observable<Disclosure[]> {
    return this.http.get<any>(`${this.resource}/query?userId=${userId}`)
      .pipe(map((data: any) => data.disclosures));
  }

  findById(id: string): Observable<Disclosure> {
    return this.http.get<any>(`${this.resource}/find/${id}`)
      .pipe(map((data: any) => data.disclosure));
  }

  save(disclosure: Disclosure): Observable<Disclosure> {
    return this.http.post<any>(`${this.resource}/save`, disclosure)
      .pipe(map((data: any) => data.disclosure));
  }
}
