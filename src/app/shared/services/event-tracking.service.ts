import { Injectable } from '@angular/core';
import {HttpBaseService} from './http-base.service';
import {SessionService} from './session.service';
import {EventTypes} from '../models/event-types.enum';
import {catchError, map} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class EventTrackingService {

  constructor(private http: HttpBaseService
    , private sessionService: SessionService
    , private notificationsService: NotificationsService) {
  }

  trackEvent( type: EventTypes, opts: any ) {

    const obj = {
      type: type,
      opts: opts
    };

    return this.http.post<any>(`events/save`, obj)
      .pipe(
        map((data: any) => data)

      ),
      catchError((err: string) => {

        this.notificationsService.error('Saving event failed');
        return new Promise(resolve => resolve(false));
      });
  }
}
