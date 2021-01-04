import {Observable, of} from 'rxjs';
import {SessionService} from '../session.service';
import {HttpClient} from '@angular/common/http';

export class HttpBaseServiceStub {
  private session: string = 'none';
  private http: HttpClient;
  private sessionService: SessionService;
  data: any = {};

  constructor() {
  }

  get<T = any>(url: string): Observable<T> {
    return of(this.data);
  }

  post<T = any>(url: string, body: any = null): Observable<T> {
    return of(this.data);
  }

  put<T = any>(url: string, body: any = null): Observable<T> {
    return of(this.data);
  }

}
