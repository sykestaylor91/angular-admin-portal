import {NgModule} from '@angular/core';

import {DeclarationsListComponent} from './contributor-declarations-list/list.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {PublicationsModule} from './publications/publications.module';
import {DisclosureModule} from './disclosure/disclosure.module';
import {ContributorRoutes} from './contributor.routes';
import {ContributorComponent} from './contributor.component';
import {RegistrationComponent} from './registration/registration.component';
import {CredentialsComponent} from './credentials/credentials.component';
import {EditCredentialComponent} from './credentials/edit-credential/edit-credential.component';
import {InvitationComponent} from './invitation/invitation.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {MaterialModule} from '../shared/material.module';

@NgModule({
  imports: [
    ContributorRoutes,
    TableModule,
    DisclosureModule,
    FormsModule,
    MaterialModule,
    PublicationsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    ContributorComponent,
    CredentialsComponent,
    DashboardComponent,
    DeclarationsListComponent,
    EditCredentialComponent,
    InvitationComponent,
    RegistrationComponent,
  ],
  providers: [],
  exports: [
    DeclarationsListComponent
  ]
})
export class ContributorModule {
}
