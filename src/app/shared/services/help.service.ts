import {Injectable} from '@angular/core';
import {Help} from '../models/help';
import {HttpBaseService} from './http-base.service';

import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable()
export class HelpService {
  selectedDocument: Help;
  helpDocuments: Help[];
  documents: Help[] = [];

  private resource = 'help';

  constructor(private http: HttpBaseService) {
  }

  query(includeDeleted: boolean = false): Observable<Help[]> {
    return this.http.get<any>(`${this.resource}/query`)
      .pipe(
        map((data: any) => data.help as Help[]),
        map(help => includeDeleted ? help : help.filter(h => h.status !== 'deleted'))
      );
  }

  save(help: Help): Observable<Help> {
    return this.http.post<any>(`${this.resource}/save`, help)
      .pipe(map((data: any) => data.help));
  }

  remove(help: Help): Observable<Help> {
    help.status = 'deleted';
    return this.save(help);
  }

  getHelpDocuments(): Observable<Help[]> {
    // TODO: Use cache service instead
    if (this.documents.length === 0) {
      return this.query().pipe(
        tap(documents => {
          this.documents = documents;
        })
      );
    } else {
      return of(this.documents);
    }
  }

}
