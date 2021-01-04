import {Injectable} from '@angular/core';
import {ClinicalExam} from '../models/clinical-exam';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ClinicalExamService {
    private resource = 'clinicalExam';

    constructor(private http: HttpBaseService) {
    }

    findById(id: string): Observable<ClinicalExam> {
        return this.http.get<any>(`${this.resource}/find/${id}`)
        .pipe(map(data => data.clinicalExam));
    }

    query(): Observable<any[]> {
        return this.http.get<any>(`${this.resource}/query`)
        .pipe(map(data => data.clinicalExams));
    }

    save(clinicalExam: ClinicalExam): Observable<ClinicalExam> {
        return this.http.post<any>(`${this.resource}/save`, clinicalExam)
        .pipe(map((data: any) => data.clinicalExam));
    }

    remove(clinicalExam: ClinicalExam): Observable<ClinicalExam> {
        clinicalExam.status = 'deleted';
        return this.http.post<any>(`${this.resource}/save`, clinicalExam)
        .pipe(map(data => data.clinicalExam));
    }

}
