import {Injectable} from '@angular/core';
import {SessionService} from './session.service';

import {Observable} from 'rxjs';
import {HttpBaseService} from './http-base.service';

@Injectable()
export class AccountService {
  private resource: string = 'txaccounting';

  constructor(private sessionService: SessionService, private http: HttpBaseService) {
  }

  getUserWallet(): Observable<any> {
    return this.http.get<any>(`${this.resource}/getUserWallet/${this.sessionService.loggedInUser.id}`);
  }

  queryPricingPlans(): Observable<any> {
    return this.http.get<any>(`pricingplan/query`);
  }

  saveTxOrganisation(provider): Observable<any> {
    return this.http.post<any>(`${this.resource}/runProcess/Lsys.org.init`, provider);
  }

  saveTxReader(readerId): Observable<any> {
    return this.http.post<any>(`${this.resource}/runProcess/Lsys.user.init`, readerId);
  }

  runProcess(process, params): Observable<any> {
    return this.http.post<any>(`${this.resource}/runProcess/${process}`, params);
  }

  terminateSubscription(params): Observable<any> { // Terminates provider subscription
    return this.http.post<any>(`${this.resource}/runProcess/lsys.term`, params);
  }

  dryrunProcess(process, params): Observable<any> {
    return this.http.post<any>(`${this.resource}/dryrunProcess/${process}`, params);
  }

  currentSubscription(params): Observable<any> { // Returns current provider subscription
    return this.http.post<any>(`${this.resource}/productsubscription/list4org/${params.organisationId}`, params);
  }

  getReport(filter): Observable<any> {
    return this.http.post<any>(`${this.resource}/getReport`, filter);
  }

}
