import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SortableModule} from 'ngx-bootstrap';
import {AvatarModule} from 'ngx-avatar';

import {DndModule} from 'ng2-dnd';

import {TableModule} from 'primeng/table';
import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '../shared/material.module';

import {ClinicalExamListComponent} from './clinical-exam-list.component';

import {ClinicalExamListRoutes} from './clinical-exam-list.routes';

import {CandidateFormComponent} from './candidate-form/candidate-form.component';
import {CircuitFormComponent} from './circuit-form/circuit-form.component';
import {ClinicalExamFormComponent} from './clinical-exam-form/clinical-exam-form.component';
import {ExaminerFormComponent} from './examiner-form/examiner-form.component';
import {ItemFormComponent} from './item-form/item-form.component';
import {SectionFormComponent} from './section-form/section-form.component';
import {StationFormComponent} from './station-form/station-form.component';
import {AnswerFormatFormComponent} from './answer-format-form/answer-format-form.component';

import {CircuitService} from '../shared/services/circuit.service';
import {ClinicalExamService} from '../shared/services/clinical-exam.service';
import {StationService} from '../shared/services/station.service';
import {ItemService} from '../shared/services/item.service';
import {AnswerFormatService} from '../shared/services/answer-format.service';
import {CircuitListComponent} from './circuit-list/circuit-list.component';
import {StationListComponent} from './station-list/station-list.component';
import {ItemListComponent} from './item-list/item-list.component';
import {UserListComponent} from './user-list/user-list.component';
import {ClinicalAnalysisComponent} from './clinical-analysis/clinical-analysis.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {AddRemoveResourceComponent} from './add-remove-resource/add-remove-resource.component';

@NgModule({
  imports: [
    ClinicalExamListRoutes,
    AvatarModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    SortableModule,
    CommonModule,
    DndModule.forRoot()
  ],
  declarations: [
    ClinicalExamListComponent,
    CandidateFormComponent,
    CircuitFormComponent,
    ClinicalExamFormComponent,
    ExaminerFormComponent,
    ItemFormComponent,
    SectionFormComponent,
    StationFormComponent,
    AnswerFormatFormComponent,
    CircuitListComponent,
    StationListComponent,
    ItemListComponent,
    UserListComponent,
    ClinicalAnalysisComponent,
    AddRemoveResourceComponent
  ],
  exports: [
    ClinicalExamListComponent
  ],
  providers: [
    CircuitService,
    ClinicalExamService,
    StationService,
    ItemService,
    AnswerFormatService,
    ClinicalExamService,
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    },
  ],
  entryComponents: [
    CircuitFormComponent,
    CandidateFormComponent,
    ClinicalExamFormComponent,
    ExaminerFormComponent,
    ItemFormComponent,
    SectionFormComponent,
    StationFormComponent,
    AnswerFormatFormComponent,
    CircuitListComponent,
    StationListComponent,
    ItemListComponent,
    UserListComponent,
    ClinicalAnalysisComponent,
    AddRemoveResourceComponent
  ]
})
export class ClinicalExamListModule {
}
