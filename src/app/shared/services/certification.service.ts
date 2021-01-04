import {Injectable} from '@angular/core';
import {Certification} from '../models/certification';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { Certificate } from '../models/certificate';

@Injectable()
export class CertificationService {
  private resource = 'certification';

  constructor(private http: HttpBaseService) {
  }

  query(): Observable<Certification> {
    return this.http.get<any>(`${this.resource}/query`)
      .pipe(map((data: any) => data.certifications));
  }

  getCertificateHTML(examId: string, userEvalId: string, userExamId: string): Observable<Certificate> {
    return this.http.get<any>(`${this.resource}/generate-certificate/${examId}/${userEvalId}/${userExamId}`)
      .pipe(map((data: any) => data.certificate));
  }

  findById(id: string): Observable<Certification> {
    return this.http.get<any>(`${this.resource}/find/${id}`)
      .pipe(map((data: any) => data.certification));
  }

  save(certification: Certification): Observable<Certification> {
    return this.http.post<any>(`${this.resource}/save`, certification)
      .pipe(map((data: any) => data.certification));
  }
}
