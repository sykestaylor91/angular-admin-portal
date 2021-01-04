import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {Publication} from '../models/publication';
import {HttpBaseService} from './http-base.service';
import {map} from 'rxjs/operators';

@Injectable()
export class PublicationService {
  selectedPublication: Publication = new Publication(); // TODO: God Service - 5 usages
  resource = 'publication';

  constructor(private http: HttpBaseService) {
  }

  query(): Observable<Publication[]> {
    return this.http.get<any>(`${this.resource}/query`)
      .pipe(map((data: any) => data.publications));
  }

  findById(id: string): Observable<Publication> {
    return this.http.get<any>(`${this.resource}/find/${id}`)
      .pipe(map((data: any) => data.publication));
  }

  findByUserId(id: string, includeDeleted: boolean = false): Observable<Publication[]> {
    // Backend has incorrect plural form
    return this.http.get<any>(`${this.resource}/findByuserId/${id}`)
      .pipe(map(data => includeDeleted ? data.publication : data.publication.filter(item => item.status !== 'deleted')));
  }

  queryByExam(id: string): Observable<Publication[]> {
    return this.http.get<any>(`${this.resource}/queryByExam/${id}`)
      .pipe(map((data: any) => data.publications));
  }

  save(publication: Publication): Observable<Publication> {
    return this.http.post<any>(`${this.resource}/save`, publication)
      .pipe(map((data: any) => data.publication));
  }

  remove(publication: Publication): Observable<Publication> {
    publication.status = 'deleted';
    return this.http.post<any>(`${this.resource}/save`, publication)
      .pipe(map((data: any) => data.publication));
  }
}
