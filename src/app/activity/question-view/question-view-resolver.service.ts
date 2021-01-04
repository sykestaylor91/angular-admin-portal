import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, zip} from 'rxjs';
import {map} from 'rxjs/internal/operators';
import {UserExam} from '../../shared/models/user-exam';
import {UserExamService} from '../../shared/services/user-exam.service';
import {Location} from '@angular/common';
import {NotificationsService} from 'angular2-notifications';
import {QuestionService} from '../../shared/services/question.service';
import {Question, ResolvedQuestionContent} from '../../shared/models/question';
import {ExamService} from '../../shared/services/exam.service';
import {UserExamStatus} from '../../shared/models/user-exam-status';
import {RoutesRp} from '../../shared/models/routes-rp';
import {ResponseService} from '../../shared/services/response.service';
import {Response} from '../../shared/models/response';

@Injectable()
export class QuestionViewResolverService implements Resolve<ResolvedQuestionContent> {
  constructor(private location: Location
    , private notificationsService: NotificationsService
    , private examService: ExamService
    , private userExamService: UserExamService
    , private questionsService: QuestionService
    , private responseService: ResponseService
    , private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResolvedQuestionContent> | Promise<ResolvedQuestionContent> | ResolvedQuestionContent {
    const userExamId: string = route.params['userExamId'];

    if (!userExamId) {
      this.notificationsService.alert('You must supply a valid userExamId, navigating you back.');
      this.location.back();
      return null;
    }

    const userExamObs = this.userExamService.findById(userExamId);
    const questionsObs = this.questionsService.queryByUserExam(userExamId);
    const responseObs = this.responseService.findByUserExamId(userExamId);

    const result: Observable<[UserExam, Question[], Response[]]> = zip(userExamObs, questionsObs, responseObs);
    return result.pipe(map(value => {
        const userExam = value[0];
        const questions = value[1];
        const responses = value[2];

        if (!userExam || !userExam.id) {
          this.notificationsService.alert('This user exam does not exist, navigating you back.');
          this.location.back();
          return null;
        }

        if (userExam.status !== UserExamStatus.Open
          && userExam.status !== UserExamStatus.Completed
        ) {
          if (userExam.examId) {
            this.notificationsService.alert('This exam is not open, navigating you to the introduction.');
            this.router.navigate([RoutesRp.ActivityIntro, userExam.examId]);
          } else {
            this.notificationsService.alert('There is a problem with this exam, navigating you back.');
            this.location.back();
          }
          return null;
        }

        return {
          userExam
          , questions
          , responses
        };
      })
    );
  }
}
