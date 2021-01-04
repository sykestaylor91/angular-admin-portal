import {Injectable} from '@angular/core';
import {Circuit} from '../models/circuit';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class CircuitService {
    private resource = 'circuit';

    constructor(private http: HttpBaseService) {
    }

    findById(id: string): Observable<Circuit> {
        return this.http.get<any>(`${this.resource}/find/${id}`)
    .pipe(map(data => data.circuit));
    }

    query(): Observable<any[]> {
        return this.http.get<any>(`${this.resource}/query`)
    .pipe(map(data => data.circuits));
    }

    save(circuit: Circuit): Observable<Circuit> {
        return this.http.post<any>(`${this.resource}/save`, circuit)
    .pipe(map((data: any) => data.circuit));
    }

    remove(circuit: Circuit): Observable<Circuit> {
        circuit.status = 'deleted';
        return this.http.post<any>(`${this.resource}/save`, circuit)
    .pipe(map(data => data.circuit));
    }

}
