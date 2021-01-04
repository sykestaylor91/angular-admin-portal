import {RouterModule, Routes} from '@angular/router';
import {ActivityManagerListComponent} from './activity-manager-list/activity-manager-list.component';
import {AppRoleGuardService} from '../app-role-guard.service';
import {CourseContributorAcceptComponent} from './activity-manager-edit/course-contributors/course-contributor-accept/course-contributor-accept.component';
import {CourseContributorAcceptResolverService} from './activity-manager-edit/course-contributors/course-contributor-accept/course-contributor-accept-resolver.service';
import {ActivityManagerEditComponent} from './activity-manager-edit/activity-manager-edit.component';
import {CanDeactivateGuard} from '../can-deactivate-guard.service';
import {ActivityManagerEditResolverService} from './activity-manager-edit/activity-manager-edit-resolver.service';
import {EvaluationQuestionsComponent} from './edit-evaluation/evaluation-questions.component';
import {EvaluationListComponent} from './evaluation-list/evaluation-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: ActivityManagerListComponent,
    canActivate: [AppRoleGuardService],
  },
  {
    path: 'list/:activityStatus',
    component: ActivityManagerListComponent,
    canActivate: [AppRoleGuardService],
  },
  {
    path: 'new',
    redirectTo: 'new/Other',
    pathMatch: 'full'
  },
  {
    path: 'new/:type',
    component: ActivityManagerEditComponent,
    canActivate: [AppRoleGuardService],
    canDeactivate: [CanDeactivateGuard],
    data: {isNew: true},
    resolve: {
      resolvedExam: ActivityManagerEditResolverService
    }
  },
  {
    path: 'template/:id',
    component: ActivityManagerEditComponent,
    canActivate: [AppRoleGuardService],
    canDeactivate: [CanDeactivateGuard],
    data: {isTemplate: true},
    resolve: {
      resolvedExam: ActivityManagerEditResolverService
    }
  },
  {
    path: 'evaluation/list',
    component: EvaluationListComponent,
    canActivate: [AppRoleGuardService]
  },
  {
    path: 'edit/:id',
    component: ActivityManagerEditComponent,
    canActivate: [AppRoleGuardService],
    canDeactivate: [CanDeactivateGuard],
    resolve: {
      resolvedExam: ActivityManagerEditResolverService
    }
  },
  {
    path: 'evaluation/new',
    component: EvaluationQuestionsComponent,
    canActivate: [AppRoleGuardService]
  },
  {
    path: 'evaluation/edit/:id',
    component: EvaluationQuestionsComponent,
    canActivate: [AppRoleGuardService]
  },
  {
    path: 'course-contributor-accept/:id',
    component: CourseContributorAcceptComponent,
    resolve: {
      resolvedExam: CourseContributorAcceptResolverService
    }
  }
];

export const ActivityManagerRoutes = RouterModule.forChild(routes);
