import {NgModule} from '@angular/core';
import {SerialQuestionFormComponent} from './serial-question-form.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
// import {QuestionFormModule} from '../question-form/question-form.module';
import {AddRemoveDialogModule} from '../add-remove-dialog/add-remove-dialog.module';

import {SortableModule} from 'ngx-bootstrap';
import {DndModule} from 'ng2-dnd';
import {AvatarModule} from 'ngx-avatar';
import {CitationsModule} from '../citations/citations.module';
import {SerialQuestionFormRoutes} from './serial-question-form.routes';
import {QuestionFormNoRouteModule} from '../question-form/question-form-no-route.module';
import {SerialQuestionFormResolverService} from './serial-question-form-resolver.service';


import {MaterialModule} from '../shared/material.module';

@NgModule({
  imports: [
    AvatarModule,
    CitationsModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    SortableModule,
    AddRemoveDialogModule,
    QuestionFormNoRouteModule,
    SerialQuestionFormRoutes,
    DndModule.forRoot(),
    SharedModule
  ],
  declarations: [
        SerialQuestionFormComponent,
   ],
  exports: [
        SerialQuestionFormComponent,
  ],
  providers: [
    SerialQuestionFormResolverService
  ],
  entryComponents: [
        SerialQuestionFormComponent,

//        CandidateFormComponent,
//        ExaminerFormComponent,
//        ItemFormComponent,
//        SectionFormComponent,
//        StationFormComponent,
//        AnswerFormatFormComponent,
//        CircuitListComponent,
//        StationListComponent,
//        ItemListComponent,
//        UserListComponent,
//        ClinicalAnalysisComponent,
//        AddRemoveResourceComponent
    ]
})
export class SerialQuestionFormModule {
}
