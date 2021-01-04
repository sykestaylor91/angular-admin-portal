import {Injectable} from '@angular/core';
import {Exam} from '../models/exam';
import {HttpBaseService} from './http-base.service';
import {ExamType} from '../models/exam-type';
import {ActivityStatus} from '../models/activity-status';
import {SessionService} from './session.service';
import {Role} from '../models/role';
import {ActivityIdentifier} from '../models/activity-identifier';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServiceHelper} from './service-helper';

export type IncludeStatuses = {
  [K in ActivityStatus]?: boolean
};

@Injectable()
export class ExamService {
  private resource: string = 'exam';

  constructor(private http: HttpBaseService, private sessionService: SessionService) {
  }

  getExams(activityStatus?: ActivityStatus, includeDeleted: boolean = false): Observable<Exam[]> {
    const url = ServiceHelper.GetQueryMetaUrl(this.resource, 'query', activityStatus, {[ActivityStatus.Deleted]: includeDeleted});
    return this.http.get<any>(url)
      .pipe(map((data: any) => data.exams));
  }

  getExamsMetaBy(activityStatus?: ActivityStatus, inclusions: IncludeStatuses = {[ActivityStatus.Deleted]: false}): Observable<ActivityIdentifier[]> {
    const url = ServiceHelper.GetQueryMetaUrl(this.resource, 'meta', activityStatus, inclusions);
    return this.http.get<any>(url)
      .pipe(map((data: any) => data.exams));
  }

  getNewExam(type: ExamType): Observable<Exam> {
    const e = new Exam();
    e.type = type;
    e.status = ActivityStatus.UnderConstruction;
    e.authors = [{id: this.sessionService.loggedInUser.id, role: Role.Planner}];
    return of(e);
  }

  findById(id: string): Observable<Exam> {
    return this.http.get<Exam>(`${this.resource}/find/${id}`)
      .pipe(map((data: any) => data.exam));
  }

  findByExamTitleSubtitle(title: string, subtitle?: string): Observable<Exam> {
    return this.http.post<any>(`${this.resource}/findByExamTitleSubtitle`, {title, subtitle})
      .pipe(map((data: any) => data.exam));
  }

  save(exam: Exam): Observable<Exam> {
    if (exam.id === null || exam.id === undefined) {
      return this.http.post<any>(`${this.resource}/save`, exam)
        .pipe(map((data: any) => data.exam));
    }
    return this.http.put<any>(`${this.resource}/save/${exam.id}`, exam)
      .pipe(map((data: any) => data.exam));
  }

  saveNotes(exam: Exam): Observable<Exam> {
    return this.http.put<any>(`${this.resource}/saveNotes/${exam.id}`, exam)
      .pipe(map((data: any) => data.exam));
  }

  delete(exam: Exam): Observable<Exam> {
    exam.status = ActivityStatus.Deleted;
    return this.save(exam);
  }
}
