import {Injectable} from '@angular/core';
import {ChangeHistory} from '../models/change-history';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ChangeHistoryService {
  private resource: string = 'changeHistory';

  constructor(private http: HttpBaseService) {
  }

  save(change: ChangeHistory): Observable<ChangeHistory> {
    return this.http.post<any>(`${this.resource}/save`, change)
      .pipe(map((data: any) => data.changeHistory));
  }

  countByKey(key: string): Observable<ChangeHistory> {
    return this.http.get<any>(`${this.resource}/find/count:${key}`)
      .pipe(map((data: any) => data.changeHistory));
  }

  // Implement caching which would be invalidated by examService.save
  findByKey(key: string): Observable<ChangeHistory[]> {
    return this.http.get<any>(`${this.resource}/find/${key}`)
      .pipe(map((data: any) => data.changeHistory));
  }
}
