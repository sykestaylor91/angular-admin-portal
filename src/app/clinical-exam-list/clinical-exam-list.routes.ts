import {RouterModule, Routes} from '@angular/router';
import {ClinicalExamListComponent} from './clinical-exam-list.component';
import {CircuitListComponent} from './circuit-list/circuit-list.component';
import {StationListComponent} from './station-list/station-list.component';
import {UserListComponent} from './user-list/user-list.component';
import {ItemListComponent} from './item-list/item-list.component';
import {ClinicalAnalysisComponent} from './clinical-analysis/clinical-analysis.component';

import {ClinicalExamFormComponent} from './clinical-exam-form/clinical-exam-form.component';
import {CircuitFormComponent} from './circuit-form/circuit-form.component';
import {ItemFormComponent} from './item-form/item-form.component';
import {SectionFormComponent} from './section-form/section-form.component';
import {StationFormComponent} from './station-form/station-form.component';
import {AnswerFormatFormComponent} from './answer-format-form/answer-format-form.component';

const routes: Routes = [
  {path: 'clinical/list', component: ClinicalExamListComponent},
  {path: 'clinical/circuit-list', component: CircuitListComponent},
  {path: 'clinical/station-list', component: StationListComponent},
  {path: 'clinical/user-list', component: UserListComponent},
  {path: 'clinical/item-list', component: ItemListComponent},
  {path: 'clinical/analysis', component: ClinicalAnalysisComponent},
  {path: 'clinical/list', component: ClinicalExamListComponent},
  {path: 'clinical/circuit-form', component: CircuitFormComponent},
  {path: 'clinical/circuit-form/:id', component: CircuitFormComponent }, // canActivate: [AppRoleGuardService],resolve: {question: QuestionFormResolverService}
  {path: 'clinical/station-form', component: StationFormComponent},
  {path: 'clinical/station-form/:id', component: StationFormComponent }, // canActivate: [AppRoleGuardService],resolve: {question: QuestionFormResolverService}
  {path: 'clinical/clinical-exam-form', component: ClinicalExamFormComponent},
  {path: 'clinical/clinical-exam-form/:id', component: ClinicalExamFormComponent },
  {path: 'clinical/section-form', component: SectionFormComponent},
  {path: 'clinical/section-form/:id', component: SectionFormComponent }, // canActivate: [AppRoleGuardService],resolve: {question: QuestionFormResolverService}

  {path: 'clinical/item-form', component: ItemFormComponent},
  {path: 'clinical/item-form/:id', component: ItemFormComponent }, // canActivate: [AppRoleGuardService],resolve: {question: QuestionFormResolverService}
  {path: 'clinical/answer-format-form', component: AnswerFormatFormComponent},
  {path: 'clinical/answer-format-form/:id', component: AnswerFormatFormComponent }// canActivate: [AppRoleGuardService],resolve: {question: QuestionFormResolverService}

];

export const ClinicalExamListRoutes = RouterModule.forChild(routes);
