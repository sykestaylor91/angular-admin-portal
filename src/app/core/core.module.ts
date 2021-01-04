/**
 * Created by steve on 10/31/16.
 */

import {NgModule, Optional, SkipSelf} from '@angular/core';

import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {HelpService} from '../shared/services/help.service';
import {ChangeHistoryService} from '../shared/services/change-history.service';
import {ExamService} from '../shared/services/exam.service';
import {QuestionService} from '../shared/services/question.service';
import {SessionService} from '../shared/services/session.service';
import {MediaService} from '../shared/services/media.service';
import {ProviderOrgService} from '../shared/services/provider-org.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import {SideNavComponent} from './side-nav/side-nav.component';
import {NavMenuLinkComponent} from './side-nav/nav-menu-link/nav-menu-link.component';
import {NavSubMenuComponent} from './side-nav/nav-sub-menu/nav-sub-menu.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UserService} from '../shared/services/user.service';
import {InvitationService} from '../shared/services/invitation.service';
import {ProviderMessageService} from '../shared/services/provider-message.service';
import {UserExamService} from '../shared/services/user-exam.service';
import {ResponseService} from '../shared/services/response.service';
import {EvaluationService} from '../shared/services/evaluation.service';
import {CitationService} from '../shared/services/citation.service';
import {AccountService} from '../shared/services/account.service';
import {CheckoutBasketService} from '../shared/services/checkout-basket.service';
import {UserCourseService} from '../shared/services/user-course.service';
import {CertificationService} from '../shared/services/certification.service';
import {QuestionManagerService} from '../shared/services/question-manager.service';
import {DisclosureService} from '../shared/services/disclosure.service';
import {CredentialService} from '../shared/services/credential.service';
import {PublicationService} from '../shared/services/publication.service';
import {BrowserModule} from '@angular/platform-browser';
import {HttpBaseService} from '../shared/services/http-base.service';
import {DialogService} from '../shared/services/dialog.service';
import {UserEvaluationService} from '../shared/services/user-evaluation.service';
import {EvaluationResponseService} from '../shared/services/evaluation-response.service';
import {PermissionService} from '../shared/services/permission.service';
import {EmailService} from '../shared/services/email.service';

import {CircuitService} from '../shared/services/circuit.service';
import {ClinicalExamService} from '../shared/services/clinical-exam.service';
import {StationService} from '../shared/services/station.service';
import {ItemService} from '../shared/services/item.service';
import {AnswerFormatService} from '../shared/services/answer-format.service';



@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatRippleModule,
    MatSidenavModule,
    RouterModule,
  ],
  declarations: [
    SideNavComponent,
    NavSubMenuComponent,
    NavMenuLinkComponent
  ],
  providers: [
    AccountService,
    AnswerFormatService,
    CertificationService,
    ChangeHistoryService,
    CheckoutBasketService,
    CitationService,
    CircuitService,
    ClinicalExamService,
    CredentialService,
    DialogService,
    EvaluationResponseService,
    UserEvaluationService,
    DisclosureService,
    EmailService,
    EvaluationService,
    ExamService,
    HelpService,
    HttpBaseService,
    InvitationService,
    MediaService,
    PublicationService,
    ProviderMessageService,
    ProviderOrgService,
    QuestionService,
    QuestionManagerService,
    ResponseService,
    ItemService,
    SessionService,
    StationService,
    UserCourseService,
    UserExamService,
    UserService,
    PermissionService,
  ],
  exports: [
    SideNavComponent,
    MatIconModule,
    MatListModule,
    MatRippleModule,
    MatSidenavModule,
    NavSubMenuComponent,
    NavMenuLinkComponent,
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
