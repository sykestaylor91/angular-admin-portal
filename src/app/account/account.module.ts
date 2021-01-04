import {NgModule} from '@angular/core';

import {AccountComponent} from './account.component';
import {BrowserModule} from '@angular/platform-browser';
import {MaterialModule} from '../shared/material.module';
import {AccountLedgerComponent} from './account-ledger/account-ledger.component';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {ChangePlanService} from './change-plan/change-plan.service';
import {ChangePlanComponent} from './change-plan/change-plan.component';
import {SelectNewComponent} from './change-plan/select-new/select-new.component';
import {ConfirmSwitchComponent} from './change-plan/confirm-switch/confirm-switch.component';
import {CancelSubscriptionComponent} from './cancel-subscription/cancel-subscription.component';
import {AccountRoutes} from './account.routes';

@NgModule({
  imports: [
    AccountRoutes,
    BrowserModule,
    TableModule,
    FormsModule,
    MaterialModule,
    SharedModule,
  ],
  declarations: [
    AccountComponent,
    AccountLedgerComponent,
    CancelSubscriptionComponent,
    ChangePlanComponent,
    ConfirmSwitchComponent,
    SelectNewComponent,
  ],
  providers: [
    ChangePlanService
  ]
})
export class AccountModule {
}
