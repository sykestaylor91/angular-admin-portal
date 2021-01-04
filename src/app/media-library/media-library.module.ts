import {NgModule} from '@angular/core';

import {AddNewMediaComponent} from './add-new-media/add-new-media.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../shared/material.module';
import {MediaLibraryComponent} from './media-library.component';
import {SharedModule} from '../shared/shared.module';
import {PanelModule} from 'primeng/panel';
import {MediaLibraryRoutes} from './media-library.routes';
import {DataViewModule} from 'primeng/dataview';
import {DropdownModule} from 'primeng/dropdown';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  imports: [
    MediaLibraryRoutes,
    DataViewModule,
    DropdownModule,
    FormsModule,
    MaterialModule,
    PanelModule,
    ReactiveFormsModule,
    SharedModule,
    PdfViewerModule
  ],
  declarations: [
    AddNewMediaComponent,
    MediaLibraryComponent,
  ],
  providers: [],
  entryComponents: []
})
export class MediaLibraryModule {
}
