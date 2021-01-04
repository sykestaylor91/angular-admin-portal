import {NgModule} from '@angular/core';

import {CitationsComponent} from './citations.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../shared/material.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    FormsModule,
    MaterialModule,
    SharedModule,
  ],
  declarations: [
    CitationsComponent
  ],
  exports: [
    CitationsComponent
  ]
})
export class CitationsModule {
}
