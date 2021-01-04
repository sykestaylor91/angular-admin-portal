import {Injectable} from '@angular/core';
import {Evaluation} from '../models/evaluation';
import {HttpBaseService} from './http-base.service';
import {ActivityIdentifier} from '../models/activity-identifier';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class EvaluationService {
  private resource = 'evaluation';

  constructor(private http: HttpBaseService) {
  }

  findById(id: string): Observable<Evaluation> {
    return this.http.get<any>(`${this.resource}/find/${id}`)
      .pipe(map((data: any) => data.evaluation));
  }

  findByEvaluationTitle(title: string): Observable<Evaluation> {
    return this.http.get<any>(`${this.resource}/findByEvaluationTitle/${title}`)
      .pipe(map((data: any) => data.evaluation));
  }

  getAllEvaluations(): Observable<Evaluation[]> {
    return this.http.get<any>(`${this.resource}/query`)
      .pipe(map((data: any) => data.evaluation));
  }

  getAllEvaluationsMetaData(): Observable<Evaluation[]> {
    return this.http.get<any>(`${this.resource}/meta`)
      .pipe(map((data: any) => data.evaluation));
  }

  save(evaluation: Evaluation): Observable<Evaluation> {
    if (evaluation.id) {
      return this.http.put<any>(`${this.resource}/save/${evaluation.id}`, evaluation)
        .pipe(map((data: any) => data.evaluation));
    }
    return this.http.post<any>(`${this.resource}/save`, evaluation)
      .pipe(map((data: any) => data.evaluation));
  }
}
