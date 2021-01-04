import {RouterModule, Routes} from '@angular/router';
import {AccountComponent} from './account.component';
import {AccountLedgerComponent} from './account-ledger/account-ledger.component';
import {AppRoleGuardService} from '../app-role-guard.service';
import {CancelSubscriptionComponent} from './cancel-subscription/cancel-subscription.component';
import {ChangePlanComponent} from './change-plan/change-plan.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    canActivate: [AppRoleGuardService],
  },
  {
    path: 'change-plan',
    component: ChangePlanComponent
  },
  {
    path: 'cancel-plan',
    component: CancelSubscriptionComponent
  },
  {
    path: 'account-ledger',
    component: AccountLedgerComponent,
    canActivate: [AppRoleGuardService]
  }
];

export const AccountRoutes = RouterModule.forChild(routes);
