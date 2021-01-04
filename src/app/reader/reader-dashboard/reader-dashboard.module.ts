import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    TableModule,
    FormsModule,
    SharedModule,
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class ReaderDashboardModule {
}
