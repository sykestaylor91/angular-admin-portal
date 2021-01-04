import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpBaseService} from './http-base.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  private resource = 'synchronisation';


  constructor(private dbService: NgxIndexedDBService,
              private http: HttpBaseService) {
    dbService.currentStore = 'userExamData';
  }

  saveToIndexedDb(value) {
    this.dbService.add(value).then(
      () => {
        // Do something after the value was added
      },
      error => {
        console.log(error);
      }
    );
  }

  reSyncData() {
    this.dbService.getAll().then(
      entry => {
        console.log(entry);
         // send all of our data back
        this.save(entry).subscribe( data => {
          console.log('data sending resolved');
        });
        // then wipe the entries
        // this.dbService.clear().then(
        //   () => {
        //    console.log('indexedDb cleared');
        //   },
        //   error => {
        //     console.log(error);
        //   }
        // );
      },
      error => {
        console.log(error);
      }
    );
  }

  save(saveData: any): Observable<any> {
    if (saveData) {
      return this.http.post<any>(`${this.resource}/save`, saveData)
        .pipe(map((data: any) => data));
    }
    return this.http.post<any>(`${this.resource}/save`, saveData)
      .pipe(map((data: any) => data));
  }
}
