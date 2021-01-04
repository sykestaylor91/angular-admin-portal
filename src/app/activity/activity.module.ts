import {NgModule} from '@angular/core';
import {ActivityRoutes} from './activity.routes';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '../shared/material.module';

import {ActivityLearningMaterialComponent} from './activity-learning-material/activity-learning-material.component';
import {CourseCompleteComponent} from './course-complete/course-complete.component';
import {CourseMapComponent} from './question-view/course-navigation/course-map/course-map.component';
import {CourseNavigationComponent} from './question-view/course-navigation/course-navigation.component';
import {CourseTimerComponent} from './question-view/course-navigation/course-timer/course-timer.component';
import {IntroComponent} from './intro/intro.component';
import {IntroResolverPreviewService} from './intro/intro-resolver-preview.service';
import {IntroResolverService} from './intro/intro-resolver.service';
import {PostCourseCertificateComponent} from './post-course-certificate/post-course-certificate.component';
import {PostCourseEvaluationModule} from './post-course-evaluation/post-course-evaluation.module';
import {QuestionViewComponent} from './question-view/question-view.component';
import {QuestionViewResolverPreviewService} from './question-view/question-view-resolver-preview.service';
import {QuestionViewResolverService} from './question-view/question-view-resolver.service';
import {RateCourseComponent} from './rate-course/rate-course.component';
import {QuestionAnswerComponent} from './question-view/question-answer/question-answer.component';
import {EventTrackingService} from '../shared/services/event-tracking.service';

@NgModule({
  imports: [
    ActivityRoutes,
    FormsModule,
    MaterialModule,
    PostCourseEvaluationModule,
    SharedModule
  ],
  declarations: [
    ActivityLearningMaterialComponent,
    CourseCompleteComponent,
    CourseMapComponent,
    CourseNavigationComponent,
    CourseTimerComponent,
    IntroComponent,
    PostCourseCertificateComponent,
    QuestionViewComponent,
    RateCourseComponent,
    QuestionAnswerComponent
  ],
  providers: [
    IntroResolverPreviewService,
    IntroResolverService,
    QuestionViewResolverPreviewService,
    QuestionViewResolverService,
    EventTrackingService
  ],
  entryComponents: []
})
export class ActivityModule {
}
