import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AbstractService} from './abstract.service';
import {Observable} from 'rxjs';
import {SessionService} from './session.service';
import {CacheProperties, CacheService} from './cache-service';
import {catchError, tap} from 'rxjs/operators';
import {LoggingService} from './logging.service';

@Injectable()
export class HttpBaseService extends CacheService {
  private session: string = 'none';

  constructor(private http: HttpClient, private sessionService: SessionService) {
    super();
  }

  // TODO: At some point this needs to handle unauthenticated responses from the backend as well as batching of requests

  get<T = any>(url: string, cacheProperties?: CacheProperties): Observable<T> {
    const getService = this.http.get<T>(`${AbstractService.hostRoute}/${url}`, {headers: AbstractService.createHeaders(this.session)});
    const service: Observable<T> = cacheProperties && cacheProperties.useCached ? this.cache(url, cacheProperties.timeout, () => getService) : getService;

    return service
      .pipe(
        tap((data: any) => LoggingService.log('GET response for url: ', url, ' | data: ', data)),
        catchError(AbstractService.errorHandler)
      );
  }

  post<T = any>(url: string, body: any = null, contentType?: string): Observable<T> {
    if (!body.userId && this.sessionService.loggedInUser) {
      body.userId = this.sessionService.loggedInUser.id;
    }
    if (this.sessionService.loggedInUser) {
      body.loggedInUserId = this.sessionService.loggedInUser.id;
    }

    return this.http.post<T>(`${AbstractService.hostRoute}/${url}`, body, {headers: AbstractService.createHeaders(this.session, contentType)})
      .pipe(
        tap((data: any) => LoggingService.log('POST response for url: ', url, ' | data: ', data)),
        tap(AbstractService.validResponseHandler),
        catchError(AbstractService.errorHandler)
      );
  }

  put<T = any>(url: string, body: any = null): Observable<T> {
    if (!body.userId && this.sessionService.loggedInUser) {
      body.userId = this.sessionService.loggedInUser.id;
    }
    if (this.sessionService.loggedInUser) {
      body.loggedInUserId = this.sessionService.loggedInUser.id;
    }

    return this.http.put<T>(`${AbstractService.hostRoute}/${url}`, body, {headers: AbstractService.createHeaders(this.session)})
      .pipe(
        tap((data: any) => LoggingService.log('PUT response for url: ', url, ' | data: ', data)),
        tap(AbstractService.validResponseHandler),
        catchError(AbstractService.errorHandler)
      );
  }

}
