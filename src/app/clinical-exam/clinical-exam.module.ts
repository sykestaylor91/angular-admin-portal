  // import { NgModule } from '@angular/core';
  // import { CommonModule } from '@angular/common';
  //
  // import {ClinicalExamComponent} from './clinical-exam.component';
  //
  // @NgModule({
  //  imports: [
  //    CommonModule
  //  ],
  //  declarations: [
  //      ClinicalExamComponent
  //  ],
  //  exports: [
  //      ClinicalExamComponent
  //  ]
  // //})
  // export class ClinicalExamModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SortableModule} from 'ngx-bootstrap';
import {AvatarModule} from 'ngx-avatar';

import {DndModule} from 'ng2-dnd';

  import {TableModule} from 'primeng/table';
  import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '../shared/material.module';

import { ClinicalExamComponent } from './clinical-exam.component';

import {CircuitService} from '../shared/services/circuit.service';
import {ClinicalExamService} from '../shared/services/clinical-exam.service';
import {StationService} from '../shared/services/station.service';
import {ItemService} from '../shared/services/item.service';
import {AnswerFormatService} from '../shared/services/answer-format.service';


@NgModule({
    imports: [
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
        ClinicalExamComponent // ,
//        CandidateFormComponent,
//        CircuitFormComponent,
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
    ],
    exports: [
        ClinicalExamComponent
    ],
    providers: [
        CircuitService,
        ClinicalExamService,
        StationService,
        ItemService,
        AnswerFormatService
    ],
    entryComponents: [
//        CircuitFormComponent,
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
export class ClinicalExamModule { }

