import DialogConfig from '../../shared/models/dialog-config';
import Utilities from '../../shared/utilities';
import { ActionType } from '../../shared/models/action-type';
import { ActivatedRoute, Router } from '@angular/router';
import { Column, ColumnType } from '../../shared/models/column';
import { Component, OnInit } from '@angular/core';
import { CoursePerformanceService } from '../../reports/course-performance/course-performance.service';
import { DialogActionsComponent } from '../../shared/dialog/dialog-actions/dialog-actions.component';
import { ExamService, IncludeStatuses } from '../../shared/services/exam.service';
import { Exam, ReviewType } from '../../shared/models/exam';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { Role } from '../../shared/models/role';
import { SessionService } from '../../shared/services/session.service';
import { SpinnerManagement } from '../../shared/models/spinner-management';
import { ActivityStatus } from '../../shared/models/activity-status';
import { Params } from '@angular/router';
import {
  ActivityManagerColumns_All,
  ActivityManagerColumns_Draft,
  ActivityManagerColumns_Published,
  ActivityManagerColumns_Withdrawn,
} from './activity-manager-columns';


import { finalize, tap, flatMap } from 'rxjs/operators';
import { Observable, zip, of } from 'rxjs';
import { ExamType } from '../../shared/models/exam-type';
import { isArray, Dictionary } from 'lodash';
import { RoutesRp } from '../../shared/models/routes-rp';
import { ContextMenuItems } from '../../shared/models/context-menu-items';
import {FilterList} from '../../shared/models/filter-list';


@Component({
  templateUrl: 'activity-manager-list.component.html',
  styleUrls: ['activity-manager-list.component.scss']
})
export class ActivityManagerListComponent extends SpinnerManagement implements OnInit {
  title: string = 'Create and Manage Activities';
  selectedExam: Exam;
  filterTerm: string;
  activityTypes: string[] = Object.keys(ExamType).map(key => ExamType[key]);
  filterByTypeSelect: ExamType | 'all' = 'all';
  activityStatuses: string[] = Object.keys(ActivityStatus).filter(i => (i !== 'NotSet')).map(key => ActivityStatus[key]);
  filterByStatusSelect: string = 'all';
  exams: Exam[] = [];
  filteredExams: Exam[] = [];
  filterType: any;
  columns: Column[];
  canEdit: boolean = true;
  canDelete: boolean = true;
  canUseTemplate: boolean = true;
  canPreviewReview: boolean = true;
  canUnPublish: boolean = true;
  canViewMetrics: boolean = true;
  isAcceptedMessageVisible: boolean = false;
  acceptedActivityName: string;

  ColumnType = ColumnType;
  Role = Role;
  contextMenu: string[] = [
    ContextMenuItems.Edit,
    ContextMenuItems.Delete,
    ContextMenuItems.UseAsTemplate,
    ContextMenuItems.Preview,
    ContextMenuItems.UnPublish,
    ContextMenuItems.Metrics];

  filterLists: FilterList[] = [
    {
      label: 'Activity type',
      options: this.activityTypes,
      dataPropertyName: 'type'
    },
    {label: 'Status',
      options: this.activityStatuses,
      dataPropertyName: 'status'
    }
  ];

  contextMenuHide: any = {};

  static creditSorter(a: Exam, b: Exam): number {
    return parseInt(a.numberOfCredits, 10) - parseInt(b.numberOfCredits, 10);
  }

  constructor(private sessionService: SessionService,
    private examService: ExamService,
    private notificationsService: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private coursePerformanceService: CoursePerformanceService) {
    super();
  }

  async ngOnInit() {
    await this.initializeRouteListener();
    this.route.queryParams
      .subscribe(params => {
        if (params.acceptedActivityName) {
          this.acceptedActivityName = params.acceptedActivityName;
          this.notificationsService.success('Thank you. Your acknowledgement of joining the team for ' + this.acceptedActivityName + ' has been sent');
        }
      });

  }

  async initializeRouteListener() {
    const result: Observable<[Params, Params]> = zip(
      this.route.params,
      this.route.queryParams
    );

    result
      .pipe(
        tap(value => {
          const params = value[0];
          const queryParams = value[1] = {} ? { [ActivityStatus.Deleted]: true } : value[1];
          const activityStatus: ActivityStatus = params.activityStatus as ActivityStatus;
          this.initializeColumnsBy(activityStatus);
          this.loadExams(activityStatus, queryParams);
        })
      )
      .subscribe();
  }

  // TODO: why are canUnPublish and canUseTemplate set here?  All this should do is init columns. Move all permission logic to permission service
  initializeColumnsBy(activityStatus: ActivityStatus = ActivityStatus.NotSet) {
    this.canUnPublish = true;

    switch (activityStatus) {
      case ActivityStatus.UnderConstruction:
        this.columns = Utilities.deepClone(ActivityManagerColumns_Draft);
        this.canUnPublish = false;
        break;
      case ActivityStatus.Published:
        this.columns = Utilities.deepClone(ActivityManagerColumns_Published);
        break;
      case ActivityStatus.Withdrawn:
        this.columns = Utilities.deepClone(ActivityManagerColumns_Withdrawn);
        this.canUseTemplate = this.sessionService.userIsInPermission([Role.Provider]);
        break;
      default:
        this.columns = Utilities.deepClone(ActivityManagerColumns_All);
        this.canUnPublish = false;
        break;
    }
  }

  loadExams(activityStatus: ActivityStatus = ActivityStatus.NotSet, inclusions: IncludeStatuses = { [ActivityStatus.Deleted]: false }) {
    this.showSpinner = true;
    this.examService
      .getExamsMetaBy(activityStatus, inclusions)
      .pipe(finalize(() => this.showSpinner = false))
      .subscribe(exams => {
        this.filteredExams = this.exams = exams;
        this.contextMenuHide[ContextMenuItems.Edit] = [];
        this.contextMenuHide[ContextMenuItems.Delete] = [];
        this.contextMenuHide[ContextMenuItems.UseAsTemplate] = [];
        this.contextMenuHide[ContextMenuItems.Preview] = [];
        this.contextMenuHide[ContextMenuItems.UnPublish] = [];
        this.contextMenuHide[ContextMenuItems.Metrics] = [];
        this.exams.forEach(exam => {
          if (this.canUserEdit(exam) === -1) {
            this.contextMenuHide[ContextMenuItems.Edit].push(exam.id);
            this.contextMenuHide[ContextMenuItems.Delete].push(exam.id);
          }
          if (!this.canUseTemplate) {
            this.contextMenuHide[ContextMenuItems.UseAsTemplate].push(exam.id);
          }
          if (!this.canPreviewReview) {
            this.contextMenuHide[ContextMenuItems.Preview].push(exam.id);
          }
          if (!this.canUnPublish) {
            this.contextMenuHide[ContextMenuItems.UnPublish].push(exam.id);
          }
          if (!this.canViewMetrics) {
            this.contextMenuHide[ContextMenuItems.Metrics].push(exam.id);
          }
        });
      });
    // TODO:  REMOVE FILTER ADDED for DEMO
    this.filteredExams = this.filteredExams.filter(exam => exam.status !== ActivityStatus.Deleted);
    this.exams = this.exams.filter(exam => exam.status !== ActivityStatus.Deleted);

  }

  // TODO: move all filtering to single shared component and remove all this junk. This is done in a different way everywhere I see it
  onFilterChanged() {
    this.filteredExams = this.exams;
    if (this.filterByTypeSelect !== 'all') {
      this.filteredExams = this.filteredExams
        .filter((item: Exam) => item.type && decodeURI(item.type) === this.filterByTypeSelect);
    }
    if (this.filterByStatusSelect !== 'all') {
      this.filteredExams = this.filteredExams
        .filter((item: Exam) => item.status && item.status.toLowerCase() === this.filterByStatusSelect);
      this.initializeColumnsBy(this.filterByStatusSelect as ActivityStatus);
    }
  }

  onClearFilters() {
    this.filteredExams = this.exams;
    this.filterTerm = '';
  }

  onUpdateFilterOccurrence(array) {
    this.filteredExams = array;
  }

  onOrderChange(event) {
    switch (event) {
      case 'newToOld':
      case 'oldToNew':
        this.filteredExams = this.filteredExams.sort(Utilities.dateSorter('lastUpdated', event === 'newToOld' ? 'desc' : 'asc'));
        break;
      case 'creditsHighToLow':
      case 'creditsLowToHigh':
        this.filteredExams = this.filteredExams.sort(ActivityManagerListComponent.creditSorter);
        break;
    }
  }

  onDeleteClick(activity) {
    let ref2;
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm Delete',
        content: `<p><span class="bold">Deleting this activity will erase all content, and stored data about this activity from your activity folder.</span> To delete a question, select the question in your question library and select ‘Delete’</p>
<p><span class="bold">Note: Published activities cannot be deleted</span></p>`,
        actions: [ActionType.Confirmation]
      }
    ));
    ref.componentInstance.dialogResult.pipe(
      flatMap(result => {
        ref.close();
        if (result === ActionType.Confirmation) {
          ref2 = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
            {
              title: 'Confirm Delete',
              content: `<p><span class="bold">Please confirm your wish to ‘Delete’ this activity.</span></p>`,
              actions: [ActionType.Confirmation]
            }
          ));
          return ref2.componentInstance.dialogResult;
        } else {
          return of(result);
        }
      }),
      flatMap(result => {
        if (ref2) {
          ref2.close();
        }
        if (result === ActionType.Confirmation) {
          return this.examService.delete(activity);
        } else {
          of(null);
        }
      })
    ).subscribe(data => {
      if (data) {
        activity.status = ActivityStatus.Deleted;
        this.notificationsService.success('Success', 'Activity deleted successfully');
        this.onFilterChanged();
      }
    });
  }

  onPreviewClick(exam: Exam) {
    this.router.navigate([RoutesRp.ActivityIntroPreview, exam.id]);
  }

  onViewMetricsClick(item: Exam) {
    // TODO: Course performance should pull exam id from the url
    // Someone want to tell me how this was ever supposed to set a userExam from either a Evaluation or Exam record?
    // this.coursePerformanceService.userExam = item;
    this.router.navigate(['reports/activity-performance']);
    // throw new Error('Not Implemented');
  }

  // TODO: move to permission service
  canUserEdit(exam: Exam) {
    // if the user is a super admin, they can edit
    if (this.sessionService.loggedInUser.roles.indexOf(Role.SuperAdmin) > -1) {
      return 1;
    }

    let isInAuthorList = false;
    if (this.sessionService.loggedInUser && this.sessionService.loggedInUser.id && exam.authors && isArray(exam.authors)) {
      isInAuthorList = (exam.authors.findIndex(author => author.id === this.sessionService.loggedInUser.id) > -1);
    }
    const allowedBlindRoles = [Role.SuperAdmin, Role.Provider, Role.Planner, Role.Editor, Role.Reviewer];
    let canEditBlindReview = false;
    allowedBlindRoles.forEach(allowedRole => {
      if (this.sessionService.loggedInUser.roles.indexOf(allowedRole) > -1) {
        canEditBlindReview = true;
      }
    });
    if (exam.reviewType === ReviewType.Blind && canEditBlindReview && isInAuthorList && exam.status === ActivityStatus.ReadyToReview) {
      return 1;
    } else if (isInAuthorList) {
      return 1;
    }
    return -1;
  }

  onUseAsTemplateClick(exam) {
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm Action',
        content: `Are you sure you wish to use the following activity as a template: <span class="bold">${exam.title}</span>`,
        actions: [ActionType.Confirmation]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      if (result === ActionType.Confirmation) {
        this.showSpinner = true;
        this.router.navigate([RoutesRp.ActivityManagerTemplate, exam.id]);
      }
      ref.close();
    });
  }

  onUnPublishClick(exam: Exam) {
    this.selectedExam = exam;
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm Action',
        content: `Are you sure you wish to unpublish ${exam.title}?`,
        actions: [ActionType.Confirmation]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      this.selectedExam.status = ActivityStatus.UnderConstruction;
      this.examService.save(this.selectedExam).subscribe(data => {
        this.notificationsService.success('Successfully unpublished activity', 'Activity has been set to draft');
        this.ngOnInit();
      });
    });
  }

  onEditExamClick(exam: Exam) {
    this.router.navigate(['/activity-manager/edit', exam.id]);
  }
}
