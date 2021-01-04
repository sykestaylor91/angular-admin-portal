/**
 * Created by steve on 11/1/16.
 */

import {NgModule} from '@angular/core';

import {EditComponent} from './edit.component';
import {BrowserModule} from '@angular/platform-browser';
import {PaymentsDetailComponent} from './payments-detail/payments-detail.component';
import {SharedModule} from '../../../shared/shared.module';
import {MaterialModule} from '../../../shared/material.module';
import {PatentsDetailComponent} from './patents-detail/patents-detail.component';
import {PartnershipsDetailComponent} from './partnerships-detail/partnerships-detail.component';
import {FinancialDetailComponent} from './financial-detail/financial-detail.component';
import {ContributionsDetailComponent} from './contributions-detail/contributions-detail.component';
import {ActivitiesDetailComponent} from './activities-detail/activities-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DisclosureEditComponent} from './disclosure-edit/disclosure-edit.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ActivitiesDetailComponent,
    ContributionsDetailComponent,
    EditComponent,
    FinancialDetailComponent,
    PartnershipsDetailComponent,
    PatentsDetailComponent,
    PaymentsDetailComponent,
    DisclosureEditComponent,
  ]
})
export class DisclosureEditModule {
}
