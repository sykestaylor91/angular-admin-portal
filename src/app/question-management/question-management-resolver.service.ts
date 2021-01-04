import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Question, ResolvedQuestion} from '../shared/models/question';
import {QuestionService} from '../shared/services/question.service';
import {SessionService} from '../shared/services/session.service';
import {User} from '../shared/models/user';
import Utilities from '../shared/utilities';
import {UserService} from '../shared/services/user.service';
import {uniq} from 'lodash';

import {Observable, zip} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class QuestionManagementResolverService implements Resolve<any> {

  // This filtering/sorting should not be handled client-side... tech debt item
  static getFilterType(type: string) {
    if (type === 'activity') {
      type = 'normal';
    } else if (type === 'pre-activity') {
      type = 'precourse';
    } else if (type === 'post-activity') {
      type = 'evaluation';
    } else if (type === 'serial-questions') {
      type = 'serial';
    }
    return type;
  }

  constructor(private userService: UserService,
              private sessionService: SessionService,
              private questionService: QuestionService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResolvedQuestion> | Promise<ResolvedQuestion> | ResolvedQuestion {
    const type: string = QuestionManagementResolverService.getFilterType(route.params['type']);

    const result: Observable<[Question[], User]> = zip(
      route.routeConfig.path.indexOf('list') > -1 ? this.questionService.queryMeta() : this.questionService.query(false),
      this.sessionService.sessionUser
    );

    return result.pipe(

      map((value) => {
        let questions = value[0];
        const sessionUser = value[1];
        questions = questions.sort(Utilities.dateSorter('dateCreated'));
        if (type === 'serial') {
          questions = questions.filter(question => question.serialQuestions.length > 0 || question.type === type);

        } else if (type !== 'all' && type !== undefined) {
          questions = questions.filter(question => question.type === type);
        }
        return {
          questions: questions,
          sessionUser: sessionUser,
          uniqueUserIds: uniq(questions.map(question => question.userId))
        };
      }));
  }
}
