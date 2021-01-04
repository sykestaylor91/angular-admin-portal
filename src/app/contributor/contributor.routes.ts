/**
 * Created by steve on 11/3/16.
 */

import {RouterModule} from '@angular/router';

import {ContributorComponent} from './contributor.component';
import {InvitationComponent} from './invitation/invitation.component';
import {RegistrationComponent} from './registration/registration.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CredentialsComponent} from './credentials/credentials.component';
import {AppRoleGuardService} from '../app-role-guard.service';

const CONTRIBUTOR_ROUTES = [
  {
    path: 'contributor',
    component: ContributorComponent,
    children: [
      {path: '', component: DashboardComponent, canActivate: [AppRoleGuardService]},
      {path: 'invitation', component: InvitationComponent, canActivate: [AppRoleGuardService]},
      {path: 'registration/:id', component: RegistrationComponent },
      {path: 'credentials', component: CredentialsComponent, canActivate: [AppRoleGuardService]}
    ]
  }
];

export const ContributorRoutes = RouterModule.forChild(CONTRIBUTOR_ROUTES);
