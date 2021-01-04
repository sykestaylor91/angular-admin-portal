import {Injectable} from '@angular/core';
import {Response} from '../models/response';

import {Observable} from 'rxjs';
import {HttpBaseService} from './http-base.service';
import {map} from 'rxjs/operators';

@Injectable()
export class ResponseService {
  resource = 'response';

  constructor(private http: HttpBaseService) {
  }

  findByUserId(id: string): Observable<Response> {
    return this.http.get<any>(`${this.resource}/query/${id}`)
      .pipe(map((data: any) => data.response));
  }

  findByQuestionId(id: string): Observable<Response[]> {
    return this.http.get<any>(`${this.resource}/findByQuestionId/${id}`)
      .pipe(map((data: any) => data.responses));
  }

  findById(id: string): Observable<Response> {
    return this.http.get<any>(`${this.resource}/find/${id}`)
      .pipe(map((data: any) => data.response));
  }

  findByUserExamId(id: string): Observable<Response[]> {
    return this.http.get<any>(`${this.resource}/findByUserExamId/${id}`)
      .pipe(map((data: any) => data.responses));
  }

  save(response: Response): Observable<Response[]> {
    return this.http.post<any>(`${this.resource}/save`, response)
      .pipe(map((data: any) => data.response));
  }

  saveSerial(response: Response[]): Observable<Response[]> {
    return this.http.post<any>(`${this.resource}/save`, response)
      .pipe(map((data: any) => data.response));
  }

}

