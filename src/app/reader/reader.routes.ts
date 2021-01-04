import {RouterModule, Routes} from '@angular/router';
import {AppRoleGuardService} from '../app-role-guard.service';

import {ReaderComponent} from './reader.component';
import {ReaderAccountComponent} from './reader-account/reader-account.component';

const READER_ROUTES = [
  {
    path: 'reader',
    component: ReaderComponent,
    children: [
      {path: 'account', component: ReaderAccountComponent, canActivate: [AppRoleGuardService] },
        // {path: 'invitation', component: ReaderInvitationComponent, canActivate: [AppRoleGuardService]},
        // {path: 'account-ledger', component: ReaderAccountComponent, canActivate: [AppRoleGuardService]}
    ]
  }
];

export const ReaderRoutes = RouterModule.forChild(READER_ROUTES);
