import {Injectable} from '@angular/core';
import {Credential} from '../models/credential';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class CredentialService {
  selectedCredential: Credential; // TODO: GOD Service - 11 usages
  private resource = 'credential';

  constructor(private http: HttpBaseService) {
  }

  findById(id: string): Observable<Credential[]> {
    return this.http.get<any>(`${this.resource}/query/${id}`)
      .pipe(map(data => data.credential));
  }

  query(): Observable<Credential> {
    return this.http.get<any>(`${this.resource}/query`)
      .pipe(map(data => data.credentials));
  }

  findByUserId(userId: string, includeDeleted: boolean = true): Observable<Credential[]> {
    return this.http.get<any>(`${this.resource}/query?userId=${userId}`)
      .pipe(map(data => includeDeleted ? data.credentials : data.credentials.filter(item => item.status !== 'deleted')));
  }

  save(credential: Credential): Observable<Credential> {
    return this.http.post<any>(`${this.resource}/save`, credential)
      .pipe(map((data: any) => data.credential));
  }

  remove(credential: Credential): Observable<Credential> {
    credential.status = 'deleted';
    return this.save(credential);
  }
}
