import {RouterModule, Routes} from '@angular/router';
import {AppRoleGuardService} from '../app-role-guard.service';
import {QuestionManagementComponent} from './question-management.component';
import {QuestionManagementResolverService} from './question-management-resolver.service';

const routes: Routes = [
  {
    path: 'list/:type',
    component: QuestionManagementComponent,
    canActivate: [AppRoleGuardService],
    resolve: {resolvedQuestion: QuestionManagementResolverService}
  },
  {
    path: 'new',
    component: QuestionManagementComponent,
    canActivate: [AppRoleGuardService],
    resolve: {resolvedQuestion: QuestionManagementResolverService}
  },
];

export const QuestionManagementRoutes = RouterModule.forChild(routes);
