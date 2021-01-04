import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable } from 'rxjs';
import { tap} from 'rxjs/operators';
import { Location } from '@angular/common';
import {QuestionService} from '../shared/services/question.service';
import {Question} from '../shared/models/question';
import {NotificationsService} from 'angular2-notifications';

@Injectable()
export class SerialQuestionFormResolverService implements Resolve<any> {

  constructor(private questionService: QuestionService,
              private notificationsService: NotificationsService,
              private router: Router,
              private location: Location) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Question> | Promise<Question> | Question {
    let id = route.params['id'];
    const isTemplate = route.data['isTemplate'] || false;

    if (!id && this.questionService.selectedQuestion) {
      id = this.questionService.selectedQuestion.id;
    }

    return this.getQuestionObservable(id)
      .pipe(
        tap((question: Question) => {
          if (!question) {
            this.notificationsService.alert('This question does not exist, navigating you back.');
            this.location.back();
          } else {
            if (isTemplate) {
              delete question.id;
              question.title = question.title + '- used as a blueprint';
              delete question.comments;
            }
          }
          return question;
        })
      );
  }
  getQuestionObservable(id): Observable<Question> {
    if (id) {
      return this.questionService.findById(id);
    }
    return this.questionService.getNewQuestionObservable();
  }
}
