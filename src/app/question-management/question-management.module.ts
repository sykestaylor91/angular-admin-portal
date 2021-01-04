import {NgModule} from '@angular/core';

import {QuestionManagementComponent} from './question-management.component';
import {MaterialModule} from '../shared/material.module';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {QuestionManagementRoutes} from './question-management.routes';
import {CommonModule} from '@angular/common';
import {QuestionManagementResolverService} from './question-management-resolver.service';
// import { QuestionImportExportComponent } from './question-import-export/question-import-export.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    QuestionManagementRoutes,
    SharedModule,
  ],
  declarations: [
    QuestionManagementComponent // ,
    // QuestionImportExportComponent
  ],
  providers: [
    QuestionManagementResolverService
  ]
})
export class QuestionManagementModule {
}
