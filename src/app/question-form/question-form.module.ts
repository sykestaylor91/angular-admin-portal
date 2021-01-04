import {NgModule} from '@angular/core';
import {QuestionFormComponent} from './question-form.component';
import {QuestionFormRoutes} from './question-form.routes';
import {QuestionFormNoRouteModule} from './question-form-no-route.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    QuestionFormRoutes,
    QuestionFormNoRouteModule
  ],
  exports: [
    QuestionFormComponent
  ]
})
export class QuestionFormModule {
}
