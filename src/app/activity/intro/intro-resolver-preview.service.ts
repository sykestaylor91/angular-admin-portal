import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ExamService} from '../../shared/services/exam.service';
import {map} from 'rxjs/internal/operators';
import {Location} from '@angular/common';
import {NotificationsService} from 'angular2-notifications';
import {ExamMode, ResolvedUserExam} from '../../shared/models/user-exam';
import {UserExamService} from '../../shared/services/user-exam.service';

@Injectable()
export class IntroResolverPreviewService implements Resolve<ResolvedUserExam> {
  constructor(private location: Location
    , private notificationsService: NotificationsService
    , private userExamService: UserExamService
    , private examService: ExamService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResolvedUserExam> | Promise<ResolvedUserExam> | ResolvedUserExam {
    const examId: string = route.params['examId'];

    if (!examId) {
      this.notificationsService.alert('You must supply a valid activity, navigating you back.');
      this.location.back();
      return null;
    }

    const examObs = this.examService.findById(examId);
    return examObs.pipe(map(exam => {
        return {
          exam,
          userExam: this.userExamService.map(exam),
          examModeLabel: ExamMode.Preview
        };
      })
    );
  }
}
