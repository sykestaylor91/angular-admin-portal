import {NgModule} from '@angular/core';

import {ActivityManagerEditComponent} from './activity-manager-edit.component';
import {GeneralInformationComponent} from './general-information/general-information.component';
import {ActivityContributorListComponent} from './course-contributors/activity-contributor-list/activity-contributor-list.component';
import {ContributorDetailsRowComponent} from './course-contributors/contributor-details-row/contributor-details-row.component';
import {AddRemoveContributorDialogComponent} from './course-contributors/add-remove-contributor/add-remove-contributor-dialog.component';
import {SharedModule} from '../../shared/shared.module';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CertificationComponent} from './certification/certification.component';
import {DesignationsComponent} from './designations/designations.component';
import {CopyrightComponent} from './copyright/copyright.component';
import {DisclosuresComponent} from './disclosures/disclosures.component';
import {LearningMaterialComponent} from './learning-material/learning-material.component';
import {IntroductionComponent} from './introduction/introduction.component';
import {ActivityManagerEditResolverService} from './activity-manager-edit-resolver.service';
import {TableModule} from 'primeng/table';
import {ActivityContributorAssociationsComponent} from './course-contributors/activity-contributor-associations/activity-contributor-associations.component';
import {CourseQuestionsComponent} from './course-questions/course-questions.component';
import {AddRemoveDialogModule} from '../../add-remove-dialog/add-remove-dialog.module';

import {SortableModule} from 'ngx-bootstrap';
import {DndModule} from 'ng2-dnd';
import {AvatarModule} from 'ngx-avatar';
import {CitationsModule} from '../../citations/citations.module';
import {CertificateTypeSelectorComponent} from './certification/certificate-type-selector/certificate-type-selector.component';
import {CourseContributorAcceptComponent} from './course-contributors/course-contributor-accept/course-contributor-accept.component';
import {CourseContributorAcceptResolverService} from './course-contributors/course-contributor-accept/course-contributor-accept-resolver.service';
import {QuestionFormNoRouteModule} from '../../question-form/question-form-no-route.module';


@NgModule({
  imports: [
    AvatarModule,
    CitationsModule,
    TableModule,
    FormsModule,
    QuestionFormNoRouteModule,
    ReactiveFormsModule,
    AddRemoveDialogModule,
    SharedModule,
    MaterialModule,
    SortableModule,
    DndModule.forRoot()
  ],
  declarations: [
    ActivityContributorListComponent,
    ActivityManagerEditComponent,
    AddRemoveContributorDialogComponent,
    CertificationComponent,
    ContributorDetailsRowComponent,
    CopyrightComponent,
    CourseQuestionsComponent,
    DesignationsComponent,
    DisclosuresComponent,
    GeneralInformationComponent,
    IntroductionComponent,
    LearningMaterialComponent,
    ActivityContributorAssociationsComponent,
    CertificateTypeSelectorComponent,
    CourseContributorAcceptComponent
  ],
  exports: [
    ActivityManagerEditComponent
  ],
  providers: [
    ActivityManagerEditResolverService,
    CourseContributorAcceptResolverService
  ],
  entryComponents: [
    AddRemoveContributorDialogComponent
  ]
})
export class ActivityManagerEditModule {
}
