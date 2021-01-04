import {Injectable} from '@angular/core';
import {Item} from '../models/item';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ItemService {
    private resource = 'item';

    constructor(private http: HttpBaseService) {
    }

    findById(id: string): Observable<Item> {
        return this.http.get<any>(`${this.resource}/find/${id}`)
    .pipe(map(data => data.item));
    }

    query(): Observable<any[]> {
        return this.http.get<any>(`${this.resource}/query`)
    .pipe(map(data => data.items));
    }

    save(item: Item): Observable<Item> {
        return this.http.post<any>(`${this.resource}/save`, item)
    .pipe(map((data: any) => data.item));
    }

    remove(item: Item): Observable<Item> {
        item.status = 'deleted';
        return this.http.post<any>(`${this.resource}/save`, item)
    .pipe(map(data => data.item));
    }

}
