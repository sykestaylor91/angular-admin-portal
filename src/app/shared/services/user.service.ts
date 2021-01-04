import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class UserService {
  resource = 'user';

  constructor(private http: HttpBaseService) {
  }

  query(): Observable<User[]> {
    return this.http.get<any>(`${this.resource}/query`)
      .pipe(map((data: any) => data.users));
  }

  findById(id: string): Observable<User> {
    return this.http.get<any>(`${this.resource}/find/${id}`)
      .pipe(map((data: any) => data.user));
  }

  findByIdArray(ids: string[]): Observable<Array<User>> {
    return this.http.get<any>(`${this.resource}/findMultiple/${ids}`, {useCached: true})
      .pipe(map((data: any) => data.users));
  }

  findByUsername(username: string): Observable<User> {
    return this.http.get<any>(`${this.resource}/findByUsername/${username}`)
      .pipe(map((data: any) => data.user));
  }

  save(user: User): Observable<User> {
    return this.http.post<any>(`${this.resource}/save`, user)
      .pipe(map((data: any) => data.users));
  }

  update(user: User): Observable<User> {
    return this.http.post<any>(`${this.resource}/update`, user)
      .pipe(map((data: any) => data.user));
  }
}
