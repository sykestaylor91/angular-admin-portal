import {NgModule} from '@angular/core';
import {MaterialModule} from '../shared/material.module';
import {TableModule} from 'primeng/table';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {QuestionFormComponent} from './question-form.component';
import {QuestionFormResolverService} from './question-form-resolver.service';

// TODO: This is not meant to be permanent. We don't want to have 2 basically duplicate modules doing the same thing
// This is temporary until we can move question-form to a better location and/or not lazy load this route

@NgModule({
  imports: [
    TableModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    QuestionFormComponent
  ],
  providers: [
    QuestionFormResolverService
  ],
  exports: [
    QuestionFormComponent
  ]
})
export class QuestionFormNoRouteModule {
}
