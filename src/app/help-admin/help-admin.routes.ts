/**
 * Created by steve on 11/2/16.
 */
import {RouterModule} from '@angular/router';

import {HelpAdminComponent} from './help-admin.component';
import {HelpAdminListComponent} from './help-admin-list/help-admin-list.component';
import {HelpAdminEditComponent} from './help-admin-edit/help-admin-edit.component';
import {AppRoleGuardService} from '../app-role-guard.service';

const HELP_ADMIN_ROUTES = [
  {
    path: '',
    component: HelpAdminComponent,
    children: [
      {path: '', component: HelpAdminListComponent, useAsDefault: true, canActivate: [AppRoleGuardService]},
      {path: 'edit', component: HelpAdminEditComponent, canActivate: [AppRoleGuardService]}
    ]
  }
];

export const HelpAdminRoutes = RouterModule.forChild(HELP_ADMIN_ROUTES);
