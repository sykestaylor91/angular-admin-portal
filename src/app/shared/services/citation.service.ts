import {Injectable} from '@angular/core';
import {Citation} from '../models/citation';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class CitationService {
  private resource = 'citation';

  constructor(private http: HttpBaseService) {
  }

  query(includeDeleted: boolean = false, includeExams: boolean = false): Observable<Citation[]> {
    let queryName = `${this.resource}/query`;
    if (includeExams) {
      queryName += '/includeExams';
    }
    return this.http.get<Citation[]>(queryName)
      .pipe(map((data: any) => includeDeleted ? data.citations : data.citations.filter(item => item.status !== 'deleted')));
  }

  find(id: string): Observable<Citation> {
    return this.http.get<Citation>(`${this.resource}/find/${id}`)
      .pipe(map((data: any) => data.citation));
  }

  findMultiple(ids: string[]): Observable<Citation[]> {
    return this.http.post<Citation>(`${this.resource}/findMultiple`, ids)
      .pipe(map((data: any) => data.citations));
  }

  findByUserId(id: string): Observable<Citation> {
    return this.http.get<Citation>(`${this.resource}/findByUserId/${id}`)
      .pipe(map((data: any) => data.citation));
  }

  findMatch(citationText: string): Observable<Citation[]> {
    return this.http.post<Citation[]>(`${this.resource}/findMatch/`, {text: citationText})
      .pipe(map((data: any) => data.citations));
  }

  queryByExam(id: string): Observable<Citation[]> {
    return this.http.get<Citation[]>(`${this.resource}/queryByExam/${id}`)
      .pipe(map((data: any) => data.citations));
  }

  save(citation: Citation): Observable<Citation> {
    return this.http.post<any>(`${this.resource}/save`, citation)
      .pipe(map((data: any) => data.citation));
  }

  remove(citation: Citation): Observable<Citation> {
    citation.status = 'deleted';
    return this.save(citation);
  }
}
