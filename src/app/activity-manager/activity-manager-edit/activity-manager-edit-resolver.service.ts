import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {ExamService} from '../../shared/services/exam.service';
import {Exam, ResolvedExam} from '../../shared/models/exam';
import {map, tap} from 'rxjs/operators';
import {ActivityStatus} from '../../shared/models/activity-status';
import {NotificationsService} from 'angular2-notifications';
import {Location} from '@angular/common';

@Injectable()
export class ActivityManagerEditResolverService implements Resolve<ResolvedExam> {

  constructor(private location: Location
    , private notificationsService: NotificationsService
    , private examService: ExamService
    , private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResolvedExam> | Promise<ResolvedExam> | ResolvedExam {
    const isTemplate = route.data['isTemplate'] || false;
    const type: string = route.params['type'];
    const id: string = route.params['id'];

    return this.getExamObservable(id, type)
      .pipe(
        tap((exam: Exam) => {
          if (!exam) {
            this.notificationsService.alert('This exam does not exist, navigating you back the list of exams');
            this.router.navigate(['/list/all']);
          }
        }),
        map((exam: Exam) => {
          if (isTemplate) {
            exam.status = ActivityStatus.UnderConstruction;
            exam.templateId = exam.id;
            delete exam.id;
          }

          return {
            exam
          };
        })
      );
  }

  getExamObservable(id, type): Observable<Exam> {
    if (id) {
      return this.examService.findById(id);
    }
    return this.examService.getNewExam(type);
  }
}
