import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {throwError} from 'rxjs';

export class AbstractService {
  private static host: string = ''; // http://dev.nowce.com'; // TODO: add mobile host to environment

  constructor() {
    AbstractService.host = `${location.protocol}//${location.host}`;
  }

  static validResponseHandler(resp: any) {
    if (resp && resp.status && resp.status === 'failed') {
      throw new Error(resp.reason);
    }
  }

  static errorHandler(error: any) {
    const msg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    if (!environment.production) {
      console.trace(error);
    }

    return throwError(msg);
  }

  static get hostRoute(): string {
    return `${this.host}/${environment.route}`;
  }

  static createHeaders(session, contentType: string = 'application/json'): HttpHeaders {
    const headers = new HttpHeaders().append('x-api-key', environment.apikey)
      .append('session', session);
    if (contentType) {
      return headers.append('Content-Type', contentType);
    } else {
      return headers;
    }
  }
}

export class AbstractHttpService {
  protected session: string = 'none';

  constructor(protected http: HttpClient) {
  }

  validResponseHandler(resp: any) {
    AbstractService.validResponseHandler(resp);
  }

  errorHandler(error: any) {
    return AbstractService.errorHandler(error);
  }

  createHostRoute(): string {
    return AbstractService.hostRoute;
  }

  createHeaders(): HttpHeaders {
    return AbstractService.createHeaders(this.session);
  }
}
