import {RouterModule, Routes} from '@angular/router';
import {AppRoleGuardService} from '../app-role-guard.service';
import {QuestionFormComponent} from './question-form.component';
import {QuestionFormResolverService} from './question-form-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: QuestionFormComponent,
    canActivate: [AppRoleGuardService],
  },
  {
    path: ':id',
    component: QuestionFormComponent,
    canActivate: [AppRoleGuardService],
    resolve: {question: QuestionFormResolverService}
  },
  {
    path: 'template/:id',
    component: QuestionFormComponent,
    canActivate: [AppRoleGuardService],
    data: {isTemplate: true},
    resolve: {question: QuestionFormResolverService}
  },
];

export const QuestionFormRoutes = RouterModule.forChild(routes);
