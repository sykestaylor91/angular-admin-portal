import {NgModule} from '@angular/core';

import {HelpAdminComponent} from './help-admin.component';
import {HelpAdminListComponent} from './help-admin-list/help-admin-list.component';
import {HelpAdminEditComponent} from './help-admin-edit/help-admin-edit.component';
import {HelpAdminRoutes} from './help-admin.routes';
import {TableModule} from 'primeng/table';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import {MaterialModule} from '../shared/material.module';


@NgModule({
  imports: [
    TableModule,
    HelpAdminRoutes,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    MatDialogModule
  ],
  declarations: [
    HelpAdminComponent,
    HelpAdminListComponent,
    HelpAdminEditComponent
  ]
})
export class HelpAdminModule {
}
