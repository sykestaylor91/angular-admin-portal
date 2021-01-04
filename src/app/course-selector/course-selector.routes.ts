import {RouterModule, Routes} from '@angular/router';
import {CourseSelectorComponent} from './course-selector.component';

const routes: Routes = [
  {path: '', component: CourseSelectorComponent},
];

export const CourseSelectorRoutes = RouterModule.forChild(routes);
