import {RouterModule, Routes} from '@angular/router';
import {CourseCheckoutComponent} from './course-checkout.component';

const routes: Routes = [
  {path: '', component: CourseCheckoutComponent},
];

export const CourseSelectorRoutes = RouterModule.forChild(routes);
