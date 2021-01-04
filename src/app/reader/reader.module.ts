import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ReaderRoutes} from './reader.routes';
import {MaterialModule} from '../shared/material.module';
import {SharedModule} from '../shared/shared.module';
import {ReaderComponent} from './reader.component';
import {AvatarModule} from 'ngx-avatar';
import {ReaderAccountComponent} from './reader-account/reader-account.component';
// import {ReaderDashboardComponent} from './reader-dashboard/reader-dashboard.component';

@NgModule({
  imports: [
    ReaderRoutes,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    AvatarModule
  ],
  declarations: [
    // ReaderDashboardComponent,
    ReaderAccountComponent,
    ReaderComponent
  ],
  exports: [
    MaterialModule
  ]
})
export class ReaderModule {
}
