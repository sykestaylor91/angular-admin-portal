import {Injectable} from '@angular/core';
import {AnswerFormat} from '../models/answer-format';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class AnswerFormatService {
    private resource = 'answerFormat';

    constructor(private http: HttpBaseService) {
    }

    findById(id: string): Observable<AnswerFormat> {
        return this.http.get<any>(`${this.resource}/find/${id}`)
    .pipe(map(data => data.answerFormat));
    }

    query(): Observable<any[]> {
        return this.http.get<any>(`${this.resource}/query`)
    .pipe(map(data => data.answerFormats));
    }

    save(answerFormat: AnswerFormat): Observable<AnswerFormat> {
        return this.http.post<any>(`${this.resource}/save`, answerFormat)
    .pipe(map((data: any) => data.answerFormat));
    }

    remove(answerFormat: AnswerFormat): Observable<AnswerFormat> {
        answerFormat.status = 'deleted';
        return this.http.post<any>(`${this.resource}/save`, answerFormat)
    .pipe(map(data => data.answerFormat));
    }

}
