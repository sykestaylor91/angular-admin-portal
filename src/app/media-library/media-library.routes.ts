import {RouterModule, Routes} from '@angular/router';
import {AppRoleGuardService} from '../app-role-guard.service';
import {AddNewMediaComponent} from './add-new-media/add-new-media.component';
import {MediaLibraryComponent} from './media-library.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'add-new',
    pathMatch: 'full'
  },
  {path: 'add-new', component: AddNewMediaComponent, canActivate: [AppRoleGuardService]},
  {path: 'library/:type', component: MediaLibraryComponent, canActivate: [AppRoleGuardService]},
];

export const MediaLibraryRoutes = RouterModule.forChild(routes);
