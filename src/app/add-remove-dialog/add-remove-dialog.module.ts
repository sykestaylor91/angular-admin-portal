import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {SortableModule} from 'ngx-bootstrap';
import {DndModule} from 'ng2-dnd';
import {AvatarModule} from 'ngx-avatar';
import {CitationsModule} from '../citations/citations.module';
import {QuestionFormNoRouteModule} from '../question-form/question-form-no-route.module';
import {MaterialModule} from '../shared/material.module';
import {AddRemoveDialogComponent} from './add-remove-dialog.component';
import {EditQuestionDialogComponent} from '../shared/edit-question-dialog/edit-question-dialog.component';

// TODO: combine with nowce-data-list-component.
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
    QuestionFormNoRouteModule,
    DndModule.forRoot(),
    SharedModule
  ],
  declarations: [
  AddRemoveDialogComponent,
    EditQuestionDialogComponent
  ],
  exports: [
  AddRemoveDialogComponent,
    EditQuestionDialogComponent
  ],
  entryComponents: [
AddRemoveDialogComponent,
    EditQuestionDialogComponent
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
export class AddRemoveDialogModule {
}
