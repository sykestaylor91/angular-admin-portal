/**
 * Created by steve on 11/3/16.
 */

import {RouterModule} from '@angular/router';
import {AppRoleGuardService} from '../../app-role-guard.service';
import {EditComponent} from './edit/edit.component';

const DISCLOSURE_ROUTES = [
  {
    path: 'contributor/disclosure',
    children: [
      {
        path: '',
        redirectTo: '/contributor/disclosure/edit',
        pathMatch: 'full'
      },
      {path: 'edit', component: EditComponent, canActivate: [AppRoleGuardService]}
    ]
  }
];

export const DisclosureRoutes = RouterModule.forChild(DISCLOSURE_ROUTES);
