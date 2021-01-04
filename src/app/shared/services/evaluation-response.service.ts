import {Injectable} from '@angular/core';
import {EvaluationResponse} from '../models/evaluation-response';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {Exam} from '../models/exam';
import {map} from 'rxjs/operators';

@Injectable()
export class EvaluationResponseService {
  private resource = 'evaluationResponse';

  constructor(private http: HttpBaseService) {
  }

  findByUserId(id: string): Observable<EvaluationResponse> {
    return this.http.get<Exam>(`${this.resource}/query/${id}`)
      .pipe(
        map((data: any) => data.evaluationResponse)
      );
  }

  findByQuestionId(id: string): Observable<EvaluationResponse[]> {
    return this.http.get<Exam>(`${this.resource}/findByQuestionId/${id}`)
      .pipe(
        map((data: any) => data.evaluationResponse)
      );
  }

  findById(id: string): Observable<EvaluationResponse> {
    return this.http.get<Exam>(`${this.resource}/find/${id}`)
      .pipe(
        map((data: any) => data.evaluationResponse)
      );
  }

  save(evaluationResponse: EvaluationResponse): Observable<EvaluationResponse> {
    return this.http.post<any>(`${this.resource}/save`, evaluationResponse)
      .pipe(
        map((data: any) => data.evaluationResponse)
      );
  }
}
