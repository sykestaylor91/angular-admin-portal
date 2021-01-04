import {Injectable} from '@angular/core';
import {Question} from '../models/question';
import {HttpBaseService} from './http-base.service';

import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServiceHelper} from './service-helper';
import {ActivityStatus} from '../models/activity-status';
import {IncludeStatuses} from './exam.service';


@Injectable()
export class QuestionService {
  selectedQuestion: Question = new Question();  // TODO: God Service - 8 usages
  resource = 'question';

  constructor(private http: HttpBaseService) {
  }

  findById(id: string): Observable<Question> {
    return this.http.get<any>(`${this.resource}/findById/${id}`)
      .pipe(map(data => data.question));
  }

  getNewQuestionObservable(): Observable<Question> {
    const q = new Question();
    return of(q);
  }

  query(includeDeleted: boolean = true): Observable<Question[]> {
    return this.http.get<any>(`${this.resource}/query${includeDeleted ? '' : '?deleted=false'}`)
      .pipe(map(data => data.questions));
  }

  queryMeta(activityStatus?: ActivityStatus, inclusions: IncludeStatuses = {[ActivityStatus.Deleted]: false}): Observable<Question[]> {
    const url = ServiceHelper.GetQueryMetaUrl(this.resource, 'meta', activityStatus, inclusions);
    return this.http.get<any>(url)
      .pipe(map((data: any) => data.questions));
  }

  queryByUser(id: string): Observable<Question[]> {
    return this.http.get<any>(`${this.resource}/queryByUser/${id}`)
      .pipe(map(data => data.questions));
  }

  queryByExam(id: string): Observable<Question[]> {
    return this.http.get<any>(`${this.resource}/queryByExam/${id}`)
      .pipe(map(data => data.questions));
  }

  queryByUserExam(id: string): Observable<Question[]> {
    return this.http.get<any>(`${this.resource}/queryByUserExam/${id}`)
      .pipe(map(data => data.questions));
  }

  save(question: Question): Observable<Question> {
    return this.http.post<any>(`${this.resource}/save`, question)
      .pipe(map(data => data.question));
  }

  remove(question: Question): Observable<Question> {
    question.status = 'deleted';
    return this.http.post<any>(`${this.resource}/save`, question)
      .pipe(map(data => data.question));
  }
}

