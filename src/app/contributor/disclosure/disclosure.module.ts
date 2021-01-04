import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {DisclosureRoutes} from './disclosure.routes';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {DisclosureEditService} from './disclosure-edit.service';
import {DisclosureEditModule} from './edit/edit.module';

@NgModule({
  imports: [
    BrowserModule,
    DisclosureEditModule,
    DisclosureRoutes,
    FormsModule,
    MaterialModule,
    SharedModule,
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
    DisclosureEditService,
  ]

})
export class DisclosureModule {
}
