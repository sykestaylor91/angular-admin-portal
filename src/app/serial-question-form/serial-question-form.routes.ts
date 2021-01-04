import {RouterModule, Routes} from '@angular/router';
import {AppRoleGuardService} from '../app-role-guard.service';
import {SerialQuestionFormComponent} from './serial-question-form.component';
import {SerialQuestionFormResolverService} from './serial-question-form-resolver.service';
import {QuestionFormResolverService} from '../question-form/question-form-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: SerialQuestionFormComponent,
    canActivate: [AppRoleGuardService],
  },
  {
    path: ':id',
    component: SerialQuestionFormComponent,
    canActivate: [AppRoleGuardService],
    resolve: {question: SerialQuestionFormResolverService}
  },
  {
    path: 'template/:id',
    component: SerialQuestionFormComponent,
    canActivate: [AppRoleGuardService],
    data: {isTemplate: true},
    resolve: {question: QuestionFormResolverService}
  },
  // {
  //   path: 'list/:activityType',
  //   component: CourseQuestionsComponent,
  //   canActivate: [AppRoleGuardService],
  // },
];

export const SerialQuestionFormRoutes = RouterModule.forChild(routes);
