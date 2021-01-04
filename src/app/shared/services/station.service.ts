import {Injectable} from '@angular/core';
import {Station} from '../models/station';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class StationService {
    private resource = 'station';

    constructor(private http: HttpBaseService) {
    }

    findById(id: string): Observable<Station> {
        return this.http.get<any>(`${this.resource}/find/${id}`)
    .pipe(map(data => data.station));
    }

    query(): Observable<any[]> {
        return this.http.get<any>(`${this.resource}/query`)
    .pipe(map(data => data.stations));
    }

    save(station: Station): Observable<Station> {
        return this.http.post<any>(`${this.resource}/save`, station)
    .pipe(map((data: any) => data.station));
    }

    remove(station: Station): Observable<Station> {
        station.status = 'deleted';
        return this.http.post<any>(`${this.resource}/save`, station)
    .pipe(map(data => data.station));
    }

}
