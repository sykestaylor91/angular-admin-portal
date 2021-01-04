import {RouterModule, Routes} from '@angular/router';
import {IntroComponent} from './intro/intro.component';
import {QuestionViewComponent} from './question-view/question-view.component';
import {IntroResolverService} from './intro/intro-resolver.service';
import {QuestionViewResolverService} from './question-view/question-view-resolver.service';
import {IntroResolverPreviewService} from './intro/intro-resolver-preview.service';
import {PostCourseEvaluationComponent} from './post-course-evaluation/post-course-evaluation.component';
import {QuestionViewResolverPreviewService} from './question-view/question-view-resolver-preview.service';
import {RoutesRp} from '../shared/models/routes-rp';
import {AppRoleGuardService} from '../app-role-guard.service';

const routes: Routes = [
  {
    path: 'intro/:examId'
    , data: {match: RoutesRp.ActivityIntro}
    , component: IntroComponent
    , resolve: {resolvedUserExam: IntroResolverService}
  },
  {
    path: 'intro/preview/:examId'
    , data: {match: RoutesRp.ActivityIntroPreview}
    , component: IntroComponent
    , canActivate: [AppRoleGuardService] // TODO: At some point this will need to ensure against unauthenticated users previewing
    , resolve: {resolvedUserExam: IntroResolverPreviewService}
  },
  {
    path: 'questions/:userExamId'
    , data: {match: RoutesRp.ActivityQuestions}
    , component: QuestionViewComponent
    , resolve: {resolvedQuestionView: QuestionViewResolverService}
  },
  {
    path: 'questions/preview/:examId'
    , data: {match: RoutesRp.ActivityQuestionsPreview}
    , component: QuestionViewComponent
    , canActivate: [AppRoleGuardService] // TODO: At some point this will need to ensure against unauthenticated users previewing
    , resolve: {resolvedQuestionView: QuestionViewResolverPreviewService}
  },
  {
    path: 'question/preview/:questionId'  // Navigating from questions list
    , data: {match: RoutesRp.ActivityQuestionPreview}
    , component: QuestionViewComponent
    , resolve: {resolvedQuestionView: QuestionViewResolverPreviewService}
  },
 {
   path: 'evaluation/preview/:evaluationId'
   , data: {match: RoutesRp.EvaluationPreview}
   , component: PostCourseEvaluationComponent
   , resolve: {resolvedEvaluation: QuestionViewResolverPreviewService}
 }
];


export const ActivityRoutes = RouterModule.forChild(routes);
