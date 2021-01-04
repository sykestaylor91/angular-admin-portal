import {Injectable} from '@angular/core';
import {ProviderOrg} from '../models/provider-org';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ProviderOrgService {
  resource = 'providerOrg';

  provider: any = {
    id: '210',
    name: 'The Journal of the American Learning Association',
    providerNumber: '12345',
    fullAddress: '173 Coleridge Street, San Francisco , 94110',
    route: '',
    domain: '',
    contactInfo: '',
    status: 'active'
  };

  constructor(private http: HttpBaseService) {
  }

  find(id: string): Observable<ProviderOrg> {
    return this.http.get<any>(`${this.resource}/find/${id}`)
      .pipe(map(data => data.providerOrg));
  }

  query(): Observable<ProviderOrg> {
    return this.http.get<any>(`${this.resource}/query`)
      .pipe(map(data => data.providerOrg));
  }

}
