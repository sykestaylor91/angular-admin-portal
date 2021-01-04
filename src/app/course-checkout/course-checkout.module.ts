import { NgModule } from '@angular/core';
import {CourseCheckoutComponent} from './course-checkout.component';
import {WalletComponent} from './wallet/wallet.component';
import {MaterialModule} from '../shared/material.module';
import {SharedModule} from '../shared/shared.module';
import {CourseSelectorRoutes} from './course-checkout.routes';

@NgModule({
  imports: [
    CourseSelectorRoutes,
    MaterialModule,
    SharedModule,
  ],
  declarations: [
    WalletComponent,
    CourseCheckoutComponent
  ]
})
export class CourseCheckoutModule { }
