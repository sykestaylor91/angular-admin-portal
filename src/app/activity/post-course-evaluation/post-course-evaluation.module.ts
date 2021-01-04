import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PostCourseEvaluationComponent} from './post-course-evaluation.component';
import {EvaluationSelectComponent} from './evaluation-select/evaluation-select.component';
import {EvaluationFreeTextComponent} from './evaluation-free-text/evaluation-free-text.component';
import {EvaluationMultipleChoiceComponent} from './evaluation-multiple-choice/evaluation-multiple-choice.component';
import {EvaluationSingleChoiceComponent} from './evaluation-single-choice/evaluation-single-choice.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../../shared/material.module';
import {SharedModule} from '../../shared/shared.module';
import {UserEvaluationExamService} from './user-evaluation.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    SharedModule,
  ],
  declarations: [
    EvaluationFreeTextComponent,
    EvaluationMultipleChoiceComponent,
    EvaluationSelectComponent,
    EvaluationSingleChoiceComponent,
    PostCourseEvaluationComponent,
  ],
  exports: [
    PostCourseEvaluationComponent,
  ],
  providers: [
    UserEvaluationExamService
  ]
})
export class PostCourseEvaluationModule {
}
