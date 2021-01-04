import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ExamService} from '../../../../shared/services/exam.service';
import {ContributorInviteStatus, Exam, ResolvedExam} from '../../../../shared/models/exam';
import {SessionService} from '../../../../shared/services/session.service';

@Injectable()
export class CourseContributorAcceptResolverService implements Resolve<any> {

  changeMade: Boolean = false;

  constructor(private examService: ExamService, private sessionService: SessionService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResolvedExam> | Promise<ResolvedExam> | ResolvedExam {
    const id: string = route.params['id'];


    return this.examService.findById(id).pipe(
      flatMap(exam => {
        exam.authors.forEach( (entry, index, array)  => {

            if (entry.id === this.sessionService.loggedInUser.id) {
                array[index].status = ContributorInviteStatus.Accepted;
                array[index].accepted = new Date();
                this.changeMade = true;
            }

        });

        if ( this.changeMade ) {
          return this.examService.save(exam);
        } else {
          return of(exam);
        }
      }),
      map((response: Exam) => {
        return {exam: response};
      }),
      catchError(err => {
        console.error(err);
        this.router.navigate(['/list/all']);
        return null;
      })
    );
  }
}
