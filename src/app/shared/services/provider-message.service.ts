import {Injectable} from '@angular/core';
import {Message} from '../models/message';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ProviderMessageService {
  resource = 'message';

  constructor(private http: HttpBaseService) {
  }

  query(): Observable<Message> {
    return this.http.get<any>(`${this.resource}/query`)
      .pipe(map((data: any) => data.message));
  }

  save(message: Message): Observable<Message> {
    return this.http.post<any>(`${this.resource}/save`, message)
      .pipe(map((data: any) => data.message));
  }

  remove(message: Message): Observable<Message> {
    message.status = 'deleted';
    return this.http.post<any>(`${this.resource}/save`, message)
      .pipe(map((data: any) => data.message));
  }
}
