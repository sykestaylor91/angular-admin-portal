import {NgModule} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {CourseSelectorComponent} from './course-selector.component';
import {CourseSelectorRoutes} from './course-selector.routes';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../shared/material.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CourseSelectorRoutes,
    BrowserModule,
    FormsModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    CourseSelectorComponent
  ]
})
export class CourseSelectorModule {
}
