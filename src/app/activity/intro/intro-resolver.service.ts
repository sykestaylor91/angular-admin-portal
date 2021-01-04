import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, zip} from 'rxjs';
import {ExamService} from '../../shared/services/exam.service';
import {map} from 'rxjs/internal/operators';
import {Location} from '@angular/common';
import {NotificationsService} from 'angular2-notifications';
import {ExamMode, ResolvedUserExam, UserExam} from '../../shared/models/user-exam';
import {UserExamService} from '../../shared/services/user-exam.service';
import {Exam} from '../../shared/models/exam';
import {UserExamStatus} from '../../shared/models/user-exam-status';

@Injectable()
export class IntroResolverService implements Resolve<ResolvedUserExam> {
  constructor(private location: Location
    , private notificationsService: NotificationsService
    , private userExamService: UserExamService
    , private examService: ExamService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResolvedUserExam> | Promise<ResolvedUserExam> | ResolvedUserExam {
    const examId: string = route.params['examId'];

    if (!examId) {
      this.notificationsService.alert('You must supply a valid exam id, navigating you back.');
      this.location.back();
      return null;
    }

    // Were here to Start|Resume|Retake an exam so we should have a valid ExamId to key off
    const examObs = this.examService.findById(examId);
    const userExamObs = this.userExamService.findByExamIdForCurrentUser(examId);
    const result: Observable<[Exam, UserExam[]]> = zip(examObs, userExamObs);
    return result.pipe(map(value => {
        const exam: Exam = value[0];
        const userExams: UserExam[] = value[1] || [];
        let userExam: UserExam = userExams.find(ue =>
          ue.status === UserExamStatus.Open ||
          ue.status === UserExamStatus.Paused
        );

        const isRetake: boolean = userExams.length > 0 && !userExam;
        const examModeLabel: ExamMode = isRetake ? ExamMode.Retake : userExam ? ExamMode.Resume : ExamMode.Normal;

        if (!userExam) {
          userExam = this.userExamService.map(exam);
          userExam.examId = exam.id;
        }

        return {
          exam,
          userExam,
          examModeLabel
        };
      })
    );
  }
}
