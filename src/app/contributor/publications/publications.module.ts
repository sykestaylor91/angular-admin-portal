/**
 * Created by steve on 11/1/16.
 */

import {NgModule} from '@angular/core';

import {EditPublicationComponent} from './edit-publication/edit-publication.component';
import {PublicationsComponent} from './publications.component';
import {BrowserModule} from '@angular/platform-browser';
import {SharedModule} from '../../shared/shared.module';
import {MaterialModule} from '../../shared/material.module';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap';
import {AddMyPublicationComponent} from './add-my-publication/add-my-publication.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    ModalModule.forRoot(),
    SharedModule,
  ],
  declarations: [
    AddMyPublicationComponent,
    PublicationsComponent,
    EditPublicationComponent
  ]
})
export class PublicationsModule {
}
