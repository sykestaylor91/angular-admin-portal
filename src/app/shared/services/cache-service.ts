import {Observable} from 'rxjs';
import {publishReplay, refCount} from 'rxjs/operators';

export class CacheProperties {
  useCached: boolean = false;
  timeout?: number = 2000;
}

export abstract class CacheService {
  private _cache: Observable<any>[] = [];

  cache<T = any>(key: string, timeout: number, service: Function): Observable<T> {
    if (this._cache[key]) {
      return this._cache[key];
    }

    this._cache[key] = service()
      .pipe(
        publishReplay(1, timeout),
        refCount()
      );

    return this._cache[key];
  }
}
