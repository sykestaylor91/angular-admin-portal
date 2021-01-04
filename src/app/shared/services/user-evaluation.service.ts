import {Injectable} from '@angular/core';
import {UserEvaluation} from '../models/user-evaluation';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class UserEvaluationService {
  resource = 'userEvaluation';
  userEvaluation: UserEvaluation;

  constructor(private http: HttpBaseService) {
  }

  findById(id: string): Observable<UserEvaluation> {
    return this.http.get<any>(`${this.resource}/find/${id}`)
      .pipe(
        map((data: any) => data.UserEvaluation)
      );
  }

  findByUserId(id: string): Observable<UserEvaluation> {
    return this.http.get<any>(`${this.resource}/query/${id}`)
      .pipe(
        map((data: any) => data.UserEvaluation)
      );
  }

  save(userEvaluation: UserEvaluation): Observable<UserEvaluation> {
    return this.http.post<any>(`${this.resource}/save`, userEvaluation)
      .pipe(map((data: any) => data.userEvaluation));
  }
}
