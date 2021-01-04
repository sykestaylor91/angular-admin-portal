import {Injectable} from '@angular/core';
import {UserExam} from '../models/user-exam';
import {HttpBaseService} from './http-base.service';

import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Exam} from '../models/exam';
import {SessionService} from './session.service';
import {UserExamStatus} from '../models/user-exam-status';
import {NotificationsService} from 'angular2-notifications';

@Injectable()
export class UserExamService {
  resource = 'userExam';

  constructor(private http: HttpBaseService
    , private sessionService: SessionService
    , private notificationsService: NotificationsService) {
  }

  queryAll(): Observable<UserExam[]> {
    return this.http.get<any>(`${this.resource}/queryAll`)
      .pipe(
        map((data: any) => data.userExams)
      );
  }

  findById(id: string): Observable<UserExam> {
    return this.http.get<any>(`${this.resource}/find/${id}`)
      .pipe(
        map((data: any) => data.userExam)
      );
  }

  findByUserId(id: string): Observable<UserExam[]> {
    return this.http.get<any>(`${this.resource}/query/${id}`)
      .pipe(
        map((data: any) => data.userExam)
      );
  }

  findByExamId(id: string): Observable<UserExam[]> {
    return this.http.get<any>(`${this.resource}/findByExamId/${id}`)
      .pipe(
        map((data: any) => data.userExam)
      );
  }

  findByExamIdForCurrentUser(examId: string): Observable<UserExam[]> {
    return this.http.get<any>(`${this.resource}/query/${this.sessionService.loggedInUser.id}/${examId}`)
      .pipe(
        map((data: any) => data.userExams)
      );
  }

  saveTime(userExam: UserExam): Observable<UserExam> {
    if (!userExam.id || isNaN(userExam.elapsedSeconds)) {
      return;
    }

    return this.http.put<any>(`${this.resource}/saveTime/${userExam.id}`, {elapsedSeconds: userExam.elapsedSeconds})
      .pipe(map((data: any) => data.userExam));
  }

  save(userExam: UserExam): Observable<UserExam> {
    return this.http.post<any>(`${this.resource}/save`, userExam)
      .pipe(map((data: any) => data.userExam));
  }

  start(userExam: UserExam): Observable<UserExam> {
    return this.http.post<any>(`${this.resource}/start`, userExam)
      .pipe(map((data: any) => data.userExam));
  }

  map(exam: Exam): UserExam {
    const userExam = new UserExam(exam);
    userExam.userId = this.sessionService.loggedInUser.id;
    userExam.currentQuestion = exam.questions[0];
    userExam.examId = exam.id;
    userExam.dateCreated = new Date();
    delete userExam.id;
    delete userExam.lastUpdated;
    delete userExam.version;

    return userExam;
  }

  pause(userExam: UserExam): Observable<UserExam> {
    userExam.status = UserExamStatus.Paused;
    return this.save(userExam);
  }

  resume(userExam: UserExam): Observable<UserExam> {
    if (userExam.status === UserExamStatus.Paused) {
      userExam.status = UserExamStatus.Open;
      return this.save(userExam);
    }
    return of(userExam);
  }

  startExam(userExam: UserExam): Observable<UserExam | {}> {
    return this.start(userExam)
      .pipe(
        catchError((err: string) => {
          let friendlyErrorMessage = '';
          if (err.indexOf('ExistingOpenUserExam') > -1) {
            friendlyErrorMessage = 'This exam is already started for this user. You cannot start this again.';
            return new Promise(resolve => resolve(true));
          } else if (err.indexOf('MatchingOpenExamType') > -1) {
            friendlyErrorMessage = `An exam type of '${userExam.type}' already exists. You can only have 1 exam of each exam type open at a time.`;
          } else {
            friendlyErrorMessage = err;
          }
          this.notificationsService.error('Starting Exam Failed', friendlyErrorMessage);
          return new Promise(resolve => resolve(false));
        })
      );
  }

}
