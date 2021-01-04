import {NgModule} from '@angular/core';

import {ActivityManagerListComponent} from './activity-manager-list/activity-manager-list.component';
import {ActivityManagerEditModule} from './activity-manager-edit/activity-manager-edit.module';
import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EvaluationQuestionsComponent} from './edit-evaluation/evaluation-questions.component';
import {AddRemoveEvaluationQuestionComponent} from './edit-evaluation/add-remove-evaluation-question/add-remove-evaluation-question.component';
import {TableModule} from 'primeng/table';
import {AddRemoveEvaluationDialogComponent} from './edit-evaluation/add-remove-evaluation-question/add-remove-evaluation-dialog.component';
import {ActivityManagerRoutes} from './activity-manager.routes';
import {ActivityManagerTemplateHeaderComponent} from './activity-manager-list/activity-manager-template-header/activity-manager-template-header.component';
import {DndModule} from 'ng2-dnd';
import {SortableModule} from 'ngx-bootstrap';
import {QuestionFormNoRouteModule} from '../question-form/question-form-no-route.module';
import {EvaluationListComponent} from './evaluation-list/evaluation-list.component';
import { EvaluationParentListComponent } from './evaluation-list/evaluation-parent-list/evaluation-parent-list.component';
// import { ActivityImportExportComponent } from './activity-import-export/activity-import-export.component';
// import { LiveActivityManagementComponent } from './live-activity-management/live-activity-management.component';


@NgModule({
  imports: [
    ActivityManagerRoutes,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ActivityManagerEditModule,
    TableModule,
    SortableModule,
    QuestionFormNoRouteModule,
    DndModule.forRoot(),
    MaterialModule
  ],
  declarations: [
    ActivityManagerListComponent,
    EvaluationQuestionsComponent,
    EvaluationListComponent,
    AddRemoveEvaluationDialogComponent,
    AddRemoveEvaluationQuestionComponent,
    ActivityManagerTemplateHeaderComponent,
    EvaluationParentListComponent // ,
    // ActivityImportExportComponent,
    // LiveActivityManagementComponent
  ],
  providers: [
  ],
  entryComponents: [
    AddRemoveEvaluationDialogComponent,
    EvaluationParentListComponent
  ]
})
export class ActivityManagerModule {
}
