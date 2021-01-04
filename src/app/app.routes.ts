import {RouterModule, Routes} from '@angular/router';
import {AppRoleGuardService} from './app-role-guard.service';

import {CitationsComponent} from './citations/citations.component';

import {ClinicalExamComponent} from './clinical-exam/clinical-exam.component';
import {GettingStartedComponent} from './getting-started/getting-started.component';
import {ThemeComponent} from './theme/theme.component';
import {HomeComponent} from './home/home.component';
import {Notfound404Component} from './notfound404/notfound404.component';
import {SimpleRegistrationComponent} from './simple-registration/simple-registration.component';
import {UserMessageComponent} from './user-message/user-message.component';

import {DeclarationsListComponent} from './contributor/contributor-declarations-list/list.component';
import {PublicationsComponent} from './contributor/publications/publications.component';

import {CitationLookupComponent} from './citation-lookup/citation-lookup.component';
import {CoursePerformanceComponent} from './reports/course-performance/course-performance.component';
import {ReaderPerformanceComponent} from './reports/reader-performance/reader-performance.component';

import {SerialQuestionFormModule} from './serial-question-form/serial-question-form.module';



const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'getting-started', component: GettingStartedComponent},
  {path: 'theme', component: ThemeComponent},
  {path: 'simple-registration', component: SimpleRegistrationComponent},

  {path: 'reports/reader-performance', component: ReaderPerformanceComponent, canActivate: [AppRoleGuardService]},
  {path: 'reports/activity-performance', component: CoursePerformanceComponent, canActivate: [AppRoleGuardService]},

  {path: 'publications', component: PublicationsComponent, canActivate: [AppRoleGuardService]},
  {path: 'provider/message', component: UserMessageComponent, canActivate: [AppRoleGuardService]},
  {path: 'view-contributors', component: DeclarationsListComponent, canActivate: [AppRoleGuardService]},

  {path: 'citation-library', component: CitationsComponent, canActivate: [AppRoleGuardService]},  // Change to /citations & /citations/:id
  {path: 'citation/:id', component: CitationLookupComponent},
  {path: 'clinical-exam/:id', component: ClinicalExamComponent},


  {path: 'clinical',
    loadChildren: () => import('../app/clinical-exam-list/clinical-exam-list.module').then(m => m.ClinicalExamListModule)
  },
  {
    path: 'help-admin',
    loadChildren: () => import('../app/help-admin/help-admin.module').then(m => m.HelpAdminModule)
  },
  {
    path: 'account',
    loadChildren: () => import('../app/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'activity-checkout',
    loadChildren: () => import('../app/course-checkout/course-checkout.module').then(m => m.CourseCheckoutModule)
  },
  {
    path: 'activity-manager',
    loadChildren: () => import('../app/activity-manager/activity-manager.module').then(m => m.ActivityManagerModule)
  },
  {
    path: 'activity-selector',
    loadChildren: () => import('../app/course-selector/course-selector.module').then(m => m.CourseSelectorModule)
  },
  {
    path: 'question-manager',
    loadChildren: () => import('../app/question-management/question-management.module').then(m => m.QuestionManagementModule),
    canActivate: [AppRoleGuardService]
  },
  {
    path: 'question-form',
    loadChildren: () => import('../app/question-form/question-form.module').then(m => m.QuestionFormModule),
    canActivate: [AppRoleGuardService]
  },
  {
    path: 'serial-question/form',
    loadChildren: () => import('../app/serial-question-form/serial-question-form.module').then(m => m.SerialQuestionFormModule),
    canActivate: [AppRoleGuardService]
  },

  // {
  //   path: 'contributor',
  //   loadChildren: 'app/contributor/contributor.module#ContributorModule',
  // },
  {
    path: 'media',
    loadChildren: () => import('../app/media-library/media-library.module').then(m => m.MediaLibraryModule),
    canActivate: [AppRoleGuardService]
  },
  {
    path: 'activity',
    loadChildren: () => import('../app/activity/activity.module').then(m => m.ActivityModule)
  },
//  {
//    path: 'reader',
//    loadChildren: 'app/reader/reader.module#ReaderModule',
//    canActivate: [AppRoleGuardService]
//  },
  {path: '**', component: Notfound404Component}
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
