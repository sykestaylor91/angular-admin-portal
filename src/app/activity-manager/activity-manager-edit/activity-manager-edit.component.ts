import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import DialogConfig, {CommentOrReviewNoteDialog} from '../../shared/models/dialog-config';
import {ActionType} from '../../shared/models/action-type';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivityManagerTabSet} from './activity-manager-tab';
import {ActivityStatusPipe} from '../../shared/pipes/activity-status.pipe';
import {AddRemoveContributorDialogComponent} from './course-contributors/add-remove-contributor/add-remove-contributor-dialog.component';
import {CanComponentDeactivate} from '../../can-deactivate-guard.service';
import {CitationsComponent} from '../../citations/citations.component';
import {ContentPermissions} from '../../shared/models/action-permissions';
import {DialogActionsComponent} from '../../shared/dialog/dialog-actions/dialog-actions.component';
import {DialogCommentComponent} from '../../shared/comment-change-history/dialog-comment/dialog-comment.component';
import {DisclosuresComponent} from './disclosures/disclosures.component';
import {EmailService} from '../../shared/services/email.service';
import {EmailTemplate} from '../../shared/models/email-template';
import {DialogIframeComponent} from '../../shared/dialog/dialog-iframe/dialog-iframe.component';
import {Exam, ResolvedExam} from '../../shared/models/exam';
import {ExamService} from '../../shared/services/exam.service';
import {FormControl, FormGroup} from '@angular/forms';
import {FormsManagementDirective} from '../../shared/helpers/forms.management.directive';
import { MatDialog } from '@angular/material/dialog';
import {ExamType} from '../../shared/models/exam-type';
import {NotificationsService} from 'angular2-notifications';
import {PermissionService} from '../../shared/services/permission.service';
import {Role} from '../../shared/models/role';
import {ActivityStatus} from '../../shared/models/activity-status';
import {CertificationService} from '../../shared/services/certification.service';

import {environment} from '../../../environments/environment';
import {catchError, finalize, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {IntroductionComponent} from './introduction/introduction.component';
import {LearningMaterialComponent} from './learning-material/learning-material.component';
import {CourseQuestionsComponent} from './course-questions/course-questions.component';
import {CitationsHandler} from './citations-handler';
import {Citation} from '../../shared/models/citation';
import {Certificate} from '../../shared/models/certificate';
import {DOCUMENT} from '@angular/common';
import {SessionService} from '../../shared/services/session.service';
import {ProviderOrgService} from '../../shared/services/provider-org.service';
import {RoutesRp} from '../../shared/models/routes-rp';

@Component({
  templateUrl: 'activity-manager-edit.component.html',
  styleUrls: ['./activity-manager-edit.component.scss'],
  encapsulation: ViewEncapsulation.Emulated // ,
    // TODO: alter the change detection so that we don't make 100s of unnecessary calls or remove all of the template function calls
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityManagerEditComponent extends FormsManagementDirective implements OnInit, OnDestroy, AfterViewInit, CanComponentDeactivate {
  editFormGroup: FormGroup = new FormGroup({});
  selectedTab: ActivityManagerTabSet = ActivityManagerTabSet.General;
  selectedExam: Exam;
  isSaveStatic: boolean = false;
  loadedTabIndexes: ActivityManagerTabSet[] = [ActivityManagerTabSet.General];


  isLearningMaterialsHidden = false;
  isDeclarationsHidden = false;

  showReviewNotes: boolean = false;
  showActivityNotes: boolean = false;
  isGeneralInformationLoaded: boolean = false;
  isDisclosuresLoaded: boolean = false;
  isIntroductionLoaded: boolean = false;
  isLearningMaterialsLoaded: boolean = false;
  isActivityQuestionsLoaded: boolean = false;
  isCitationsLoaded: boolean = false;

  isValidGeneralInfo = true;
  isValidDisclosures = true;
  isValidIntro = true;
  isValidLearningMaterial = true;
  isValidQuestions = true;

  @ViewChild(DisclosuresComponent) private disclosuresComponent: DisclosuresComponent;
  @ViewChild(IntroductionComponent) private introductionComponent: IntroductionComponent;
  @ViewChild(LearningMaterialComponent) private learningMaterialComponent: LearningMaterialComponent;
  @ViewChild(CourseQuestionsComponent) private courseQuestionsComponent: CourseQuestionsComponent;
  @ViewChild(CitationsComponent) private citationsComponent: CitationsComponent;

  ActionType = ActionType;
  Environment = environment;
  StatusCode = ActivityStatus;
  Role = Role;

  private scrollTopThreshold: number = 80;
  private citationsHandler: CitationsHandler;

  constructor(private examService: ExamService,
              private notificationsService: NotificationsService,
              private permissionService: PermissionService,
              private router: Router,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private emailService: EmailService,
              private certificationService: CertificationService,
              private sessionService: SessionService,
              private providerOrgService: ProviderOrgService,
              @Inject(DOCUMENT) private Document) {
    super(permissionService);
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
    this.route.data.subscribe((data: { resolvedExam?: ResolvedExam }) => {
      this.showSpinner = false;
      this.selectedExam = data.resolvedExam.exam;
      this.initializeFormGroup(data.resolvedExam.exam);
      this.updateFormRequirementsBasedOnType(data.resolvedExam.exam.type);

      this.setLoadedComponentChecks(this.selectedTab);
      const reviewNotesPerms = this.permissionService.getBestReviewNotesPermissions(this.selectedExam);
      const activityNotesPerms = this.permissionService.getBestActivityNotesPermissions(this.selectedExam);
      this.showReviewNotes = !(reviewNotesPerms.view === ContentPermissions.none && reviewNotesPerms.viewBlind === ContentPermissions.none);
      this.showActivityNotes = !(activityNotesPerms.view === ContentPermissions.none && activityNotesPerms.viewBlind === ContentPermissions.none);

      this.citationsHandler = new CitationsHandler(this.form);
    });
  }

  ngAfterViewInit(): void {
    this.handleReadOnlyStatus();
    this.form.valueChanges.subscribe(() => {
        this.setRequiredFieldErrors();
    });
    // TODO: replace with ElementRef
    window.document.getElementById('sidenav-container').lastElementChild.scrollTo(0, 0);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  resolveExamTypeName( s ): String {
    return decodeURI(s);
  }

  initializeFormGroup(exam: Exam) {
    this.form = new FormGroup({
      id: new FormControl(exam.id)
    });

    this.editFormGroup = new FormGroup({
      authorNotes: new FormControl(exam.authorNotes)  // Why is this duplicated on copyright?
      , plannedPublicationDate: new FormControl(exam.plannedPublicationDate)
      // , published: new FormControl(exam.published)
      , reviewerNotes: new FormControl(exam.reviewerNotes)
      , reviewedDate: new FormControl(exam.reviewApprovedDate)
      , returnForChangesDate: new FormControl(exam.returnForChangesDate)
      , status: new FormControl(exam.status)
      , withdrawnDate: new FormControl(exam.withdrawnDate)
    });

    this.form.addControl('editFormGroup', this.editFormGroup);

  }

  // TODO: isDisabled needs to check the current status, as this affects which statuses should be available in various ways - consider adding to permission service
  // e.g.   ready to publish only available when the activity is post review. If the activity is published, we can only withdraw and only if admin user
  isDisabled(status: ActivityStatus) {
    if (this.selectedExam.status === ActivityStatus.Published) {

        return  [Role.SuperAdmin, Role.Planner].map(r => this.permissionService.hasRole(r)) && status === ActivityStatus.Withdrawn ;
    } else {

        return this.editFormGroup.get('status') && this.editFormGroup.get('status').value === status;
    }
  }

 activityHasTitle() {
   return this.getFormGroupValue('generalFormGroup')['title'];
 }

  get currentStatusFriendlyName() {
    return this.editFormGroup.get('status') ? ActivityStatusPipe.getFriendlyStatusName(this.editFormGroup.get('status').value ) : '';
  }

  onNavigateTab(tab: ActivityManagerTabSet) {
    this.setRequiredFieldErrors();

    this.setLoadedComponentChecks(tab);

    if (this.loadedTabIndexes[this.loadedTabIndexes.length - 1] !== tab) {
      this.loadedTabIndexes.push(tab);
    }
    this.selectedTab = tab;
    this.setRequiredFieldErrors();

   //  this.selectedTab = tab;
  }

  setLoadedComponentChecks(tab: ActivityManagerTabSet) {
    switch (tab) {
      case ActivityManagerTabSet.General:
        this.isGeneralInformationLoaded = true;
        break;

      case ActivityManagerTabSet.Declarations:
        if (this.isDisclosuresLoaded && !this.isDeclarationsHidden) {
          this.disclosuresComponent.refreshAuthorDisclosuresList();
        }
        this.isDisclosuresLoaded = true;
        break;

      case ActivityManagerTabSet.Introduction:
        // if (this.isIntroductionLoaded) {
        //   this.introductionComponent.refreshForm(this.selectedExam);
        // }
        this.isIntroductionLoaded = true;
        break;

      case ActivityManagerTabSet.LearningMaterials:
        this.isLearningMaterialsLoaded = true;
        break;

      case  ActivityManagerTabSet.Questions:
        this.isActivityQuestionsLoaded = true;
        break;

      case  ActivityManagerTabSet.Citations:
        if (this.isCitationsLoaded) {
          this.citationsComponent.ngOnInit();
        }
        this.isCitationsLoaded = true;
        break;
    }
  }

  setRequiredFieldErrors() {
    this.isValidGeneralInfo = this.isFormGroupValid('generalFormGroup')
      && this.isFormGroupValid('certificationFormGroup')
      && this.isFormGroupValid('copyrightFormGroup');
    this.isValidDisclosures = this.isFormGroupValid('disclosuresFormGroup');
    this.isValidIntro = this.isFormGroupValid('introFormGroup');
    this.isValidLearningMaterial = this.isFormGroupValid('learningMaterialFormGroup');
    this.isValidQuestions = this.isFormGroupValid('questions');
  }

  onGoBack() {
    this.loadedTabIndexes.pop();
    this.onNavigateTab(this.loadedTabIndexes.pop() || ActivityManagerTabSet.General);
  }

  onShowReviewNotesClicked() {
    const dialogData: CommentOrReviewNoteDialog = {
      title: 'Reviewer Notes',
      comments: this.selectedExam.reviewerNotes || [],
      resource: this.selectedExam,
      permissions: this.permissionService.getBestReviewNotesPermissions(this.selectedExam)
    };

    this.saveNotes(dialogData, 'reviewerNotes');
  }

  onShowActivityNotesClicked() {
    // This used to be a string type, now it's a comments type
    if (typeof this.selectedExam.authorNotes === 'string') {
      this.selectedExam.authorNotes = [];
    }

    const dialogData: CommentOrReviewNoteDialog = {
      title: 'Activity Notes',
      comments: this.selectedExam.authorNotes || [],
      resource: this.selectedExam,
      permissions: this.permissionService.getBestActivityNotesPermissions(this.selectedExam)
    };

    this.saveNotes(dialogData, 'authorNotes');
  }

  saveNotes(dialogData: CommentOrReviewNoteDialog, propertyName: 'authorNotes' | 'reviewerNotes') {
    const matDialogData = DialogConfig.defaultCommentDialogConfig(dialogData);
    const ref = this.dialog.open(DialogCommentComponent, matDialogData);

    ref.componentInstance.dialogResult.subscribe((result: ActionType) => {
      if (result === ActionType.Save) {
        ref.componentInstance.showLoading = true;

        this.selectedExam[propertyName] = dialogData.comments;
        this.editFormGroup.get(propertyName).patchValue(dialogData.comments);

        if (this.selectedExam.id) { // to account for templated activities
          const examNotes: Exam = {id: this.selectedExam.id, [propertyName]: this.selectedExam[propertyName]};
          this.examService.saveNotes(examNotes)
            .subscribe(() => {
              this.notificationsService.success('Success', `${dialogData.title} Saved`);
              ref.close();
            }, err => {
              this.notificationsService.error(`${dialogData.title} Save Failed`, err);
              ref.componentInstance.showLoading = false;
            });
        } else {
          ref.close();
        }
      } else {
        ref.close();
      }
    });
  }

  onPublishCourse() {
    this.saveChangesObservable(ActivityStatus.Published, {status: ActivityStatus.Published}).subscribe(exam => {
      this.editFormGroup.get('status').patchValue(ActivityStatus.Published);
    });
  }

  scroll = (event): void => {
    if (event) {
      this.isSaveStatic = event.target.scrollTop > this.scrollTopThreshold;
    }
  }

  getFormGroupValue(formName: string): object {
    return (this.form.get(formName)) ? this.form.get(formName).value : {};
  }

  isFormGroupValid(formName: string): boolean {
    return (this.form.get(formName)) ? this.form.get(formName).valid : true;
  }

  saveChanges(status: ActivityStatus) {
    this.saveChangesObservable(status).subscribe();
  }

  getExamObject(additionalData: {} = {}): Exam {
    // Combine the values of all form groups
    const editFormGroupValue = this.editFormGroup.value;
    const generalFormGroupValue = this.getFormGroupValue('generalFormGroup');
    const certificationFormGroup = this.getFormGroupValue('certificationFormGroup');
    const disclosuresFormGroupValue = this.getFormGroupValue('disclosuresFormGroup');
    const questions = this.getFormGroupValue('questions');
    const introFormGroupValue = this.getFormGroupValue('introFormGroup');
    const copyrightFormGroupValue = this.getFormGroupValue('copyrightFormGroup');
    const learningMaterialFormGroupValue = this.getFormGroupValue('learningMaterialFormGroup');
    const designationFormGroupValue = this.getFormGroupValue('designationFormGroup');

    let defaultModeValues = {normalModeAllowed: false, examModeAllowed: false, studyModeAllowed: false};
    if (decodeURI(this.selectedExam.type) === ExamType.SelfAssessment && certificationFormGroup['accreditedCertificate']) {
      defaultModeValues = {normalModeAllowed: true, examModeAllowed: false, studyModeAllowed: true};
    }

    return Object.assign(
      {id: this.selectedExam.id},
      defaultModeValues,
      editFormGroupValue,
      generalFormGroupValue,
      certificationFormGroup,
      disclosuresFormGroupValue,
      introFormGroupValue,
      copyrightFormGroupValue,
      learningMaterialFormGroupValue || [],
      questions,
      designationFormGroupValue,
      additionalData
    );
  }

  saveChangesObservable(status: ActivityStatus, additionalData: any = {}): Observable<boolean> {
    let isNew: boolean = (this.selectedExam.id === null || this.selectedExam.id === undefined);
    const exam = this.getExamObject(additionalData);

    // TODO: alter so that the current exam object (including the authors...and comments) is passed each time
    if (!isNew) {
        exam.authors = this.selectedExam.authors;
        exam.comments = this.selectedExam.comments;
    }
    if (additionalData && additionalData.authors) {
        exam.authors =  additionalData.authors;
    }

    const checkReadonlyStatus: boolean = status === ActivityStatus.UnderReview || exam.status === ActivityStatus.UnderReview;

    return this.examService.save(exam)
      .pipe(
        map((response: Exam) => {
          this.notificationsService.info('Activity Saved', 'Your changes have been saved');
          Object.assign(this.selectedExam, response);
          if (isNew) {
            exam.id = response.id; // This is needed by the router navigate; no touchy!
          }
          this.reHydrateFields(response);
          this.form.markAsPristine();
          return true;
        }),
        catchError((err: any) => {
          isNew = false;
          this.notificationsService.error('Activity Save Error', err);

          return of(false);
        }),
        finalize(() => {
          // this.showSpinner = false;
          if (isNew) {
            history.replaceState('NowCE Admin Portal', 'nowce.com', `activity-manager/edit/${exam.id}`);
          } else if (checkReadonlyStatus) {
            this.ensureFormIsInProperReadOnlyState();
          }
        })
      );
  }

  reHydrateFields(exam: Exam) {
    this.updateFormRequirementsBasedOnType(this.selectedExam.type);
    this.citationsHandler.rehydrateCitationFields(this.selectedExam);
    if (this.isLearningMaterialsLoaded) {
      this.learningMaterialComponent.initializeFormGroup(this.selectedExam);
    }
  }

  ensureFormIsInProperReadOnlyState() {
    if (!this.isReadOnly && this.isFormDisabled) {
      // We could set a boolean on the parent form for which all child controls could use to determine if enabled or not
      // but this seems like a decent alternative as it requires much less code and will only happen a few (one or two)
      // times in an exams life-cycle anyways
      // TODO: remove this reload bullshit.
      location.reload();
    } else {
      this.handleReadOnlyStatus();
    }
  }

  openConfirmStatusDialog(status: ActivityStatus) {
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Are you sure you want to change the status of this activity?',
        content: 'This will save any changes made to this activity',
        actions: [ActionType.Yes, ActionType.No]
      }
    ));
    ref.componentInstance.dialogResult
      .subscribe(result => {
        if (result === ActionType.Yes) {
          this.changeActivityStatus(status);
        }
        ref.close();
      });
  }

  changeActivityStatus(status: ActivityStatus) {
    switch (status) {
      case ActivityStatus.Published:
        this.selectedExam.plannedPublicationDate = new Date();
        break;
      case ActivityStatus.Returned:
        this.selectedExam.returnForChangesDate = new Date();
        break;
      case ActivityStatus.ReviewApproved:
        this.selectedExam.reviewApprovedDate = new Date();
        break;
      case ActivityStatus.Withdrawn:
        this.selectedExam.withdrawnDate = new Date();
        break;
    }

    this.editFormGroup.patchValue({
      plannedPublicationDate: this.selectedExam.plannedPublicationDate
      , reviewerNotes: this.selectedExam.reviewerNotes
      , reviewedDate: this.selectedExam.reviewApprovedDate
      , returnForChangesDate: this.selectedExam.returnForChangesDate
      , withdrawnDate: this.selectedExam.withdrawnDate
      , status
    });

    this.saveChanges(status);
  }

  canDeactivate() {
    if (this.form.dirty) {
      return window.confirm('Any unsaved changes will be lost.');
    }
    return true;
  }

  previewActivity() {
    this.saveChanges(null);
    this.router.navigate([RoutesRp.ActivityIntroPreview, this.selectedExam.id]);
  }

  previewCertificate() {
    this.certificationService.getCertificateHTML(this.selectedExam.id, '0', '0').subscribe((data: Certificate) => {
      const dialogData = DialogConfig.largeDialogBaseConfig(
        {
          title: 'Certificate Preview',
          actions: [ActionType.Close],
          htmlSrc: data.html,
          width: '1062px'
        }
      );
      const ref = this.dialog.open(DialogIframeComponent, dialogData);

      ref.componentInstance.dialogResult.subscribe(result => {
        ref.close();
      });
    });
  }

  onShowTeamDialog() {
    const ref = this.dialog.open(
      AddRemoveContributorDialogComponent,
      DialogConfig.defaultContributorDialogConfig(
        {authors: this.selectedExam.authors}
      )
    );
    const sub = ref.componentInstance.authorChange.subscribe((result) => {
        if (result && result.authorAdded) {
          if (this.isDisclosuresLoaded && !this.isDeclarationsHidden && this.disclosuresComponent) {
                this.disclosuresComponent.refreshAuthorDisclosuresList();
          }
          this.sendAuthorEmail(result.authorAdded);
        }
        return this.saveChangesObservable(null, {authors: result.authors}).subscribe();
    });

    ref.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  sendAuthorEmail( added ) {
    const location = this.Document.location;
    const template = new EmailTemplate();
    template.toAddresses = [added.user.email];
    template.template = {
      name: 'user-added-to-activity',
      data: {
        'invitorFullName': (this.sessionService.loggedInUser.firstName || '') + ' ' + (this.sessionService.loggedInUser.lastName || ''),
        'title': this.selectedExam.title,
        'subtitle': this.selectedExam.subtitle,
        'role': added.author.role,
        'firstName': added.user.firstName,
        'lastName': added.user.lastName,
        'fullName': (added.user.firstName || '') + ' ' + (added.user.lastName || ''),
        'providerName': this.providerOrgService.provider.name,
        'username': added.user.username,
        'acceptUrl': location.protocol + '//' + location.hostname + ((location.port !== '80' && location.port !== '443') ? (':' + location.port) : '') + '/activity-manager/course-contributor-accept/' + this.selectedExam.id
      }
    };
    this.emailService.sendEmailTemplate(template);
    this.emailService.sendEmailTemplate(template).subscribe(() => {
        this.notificationsService.success('Success', 'An invitation has been sent');
    });
  }


  updateFormRequirementsBasedOnType(type: ExamType) {
    this.isLearningMaterialsHidden = false;
    this.isDeclarationsHidden = false;

    switch (decodeURI(type)) {
      case ExamType.ExamOrAssessment:
      case ExamType.PreActivity:
      case ExamType.RevisionOrRefresher:
        this.isLearningMaterialsHidden = true;
         this.isDeclarationsHidden = true;
        break;
      case ExamType.PostActivity:
        this.isLearningMaterialsHidden = true;
        this.isDeclarationsHidden = true;

        break;
    }
  }

  onCitationDeleted(citation: Citation) {
    this.citationsHandler.onCitationDeleted(citation);
  }

  onQuestionsChanged() {
    // this.saveChangesObservable(null).subscribe(exam => {});
  }
}
