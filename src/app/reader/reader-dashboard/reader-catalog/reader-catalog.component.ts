import Utilities from '../../../shared/utilities';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivityItem} from '../../../core/models/activity';
import {Column, ColumnType} from '../../../shared/models/column';
import {Component, OnInit, ViewChild} from '@angular/core';
import {CoursePerformanceService} from '../../../reports/course-performance/course-performance.service';
import {ExamService, IncludeStatuses} from '../../../shared/services/exam.service';
import {Exam} from '../../../shared/models/exam';
import { MatDialog } from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';
import {Role} from '../../../shared/models/role';
import {SessionService} from '../../../shared/services/session.service';
import {SpinnerManagement} from '../../../shared/models/spinner-management';
import {ActivityStatus} from '../../../shared/models/activity-status';
import {Params} from '@angular/router';
import {Observable, zip, of} from 'rxjs';
import {ExamType} from '../../../shared/models/exam-type';
import {MediaService} from '../../../shared/services/media.service';
import {environment} from '../../../../environments/environment';
import {map, finalize, tap} from 'rxjs/operators';
import {isObject} from 'rxjs/internal/util/isObject';
import { Media } from '../../../shared/models/media';
import { ActivityManagerListComponent } from '../../../activity-manager/activity-manager-list/activity-manager-list.component';
import { PreActivityInformationComponent } from '../../../shared/pre-activity-information/pre-activity-information.component';
import AccreditationTableConfigurations from '../../../shared/models/accreditation-table-configurations';
import { DesignationOptions } from '../../../shared/models/designation-options';
import LearningFormatOptions from '../../../shared/models/learning-format-options';
import {RoutesRp} from '../../../shared/models/routes-rp';
import { UserExamService } from '../../../shared/services/user-exam.service';
import { UserExam } from '../../../shared/models/user-exam';
import { UserExamStatus } from '../../../shared/models/user-exam-status';

@Component({
  selector: 'app-reader-catalog',
  templateUrl: 'reader-catalog.component.html',
  styleUrls: ['reader-catalog.component.scss']
})
export class ReaderCatalogComponent extends SpinnerManagement implements OnInit {
  @ViewChild(PreActivityInformationComponent) private childPreActivityInformationComponent: PreActivityInformationComponent;

  title: string = 'Create and Manage Activities';
  selectedExam: Exam;
  filterTerm: string;
  activityTypes: string[] = Object.keys(ExamType).map(key => ExamType[key]);
  filterByTypeSelect: ExamType | 'all' = 'all';
  activityStatuses:  string[] = Object.keys(ActivityStatus).map(key => ActivityStatus[key]);
  filterByStatusSelect: string = 'all';
  exams: ActivityItem[] = [];
  filteredExams: ActivityItem[] = [];
  mediaList: Media[] = [];
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

  static creditSorter(a: Exam, b: Exam): number {
    return parseInt(a.numberOfCredits, 10) - parseInt(b.numberOfCredits, 10);
  }

  constructor(private sessionService: SessionService,
              private examService: ExamService,
              private notificationsService: NotificationsService,
              private routes: Router,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private mediaService: MediaService,
              private userExamService: UserExamService,
              private coursePerformanceService: CoursePerformanceService) {
    super();
  }

  ngOnInit() {
    this.initializeRouteListener();
  }

  initializeRouteListener() {
    const result: Observable<[Params, Params]> = zip(
      this.route.params,
      this.route.queryParams
    );

    result
      .pipe(
        tap(value => {
          const params = value[0];
          const queryParams = value[1] = {} ? {[ActivityStatus.Deleted]: true} : value[1];
          const activityStatus: ActivityStatus = params.activityStatus as ActivityStatus;
          this.loadExams(activityStatus, queryParams);
        })
      )
      .subscribe();
  }

  loadExams(activityStatus: ActivityStatus = ActivityStatus.NotSet, inclusions: IncludeStatuses = {[ActivityStatus.Deleted]: false}) {
    this.showSpinner = true;
    this.mediaService.query().subscribe(mediaList => this.mediaList = mediaList);
    this.examService
      .getExamsMetaBy(activityStatus, inclusions)
      .pipe(
        map(e => e.filter(exam => exam.status === ActivityStatus.Published)),
        finalize(() => this.showSpinner = false)
      )
      .subscribe(exams => {
        this.filteredExams = this.exams = exams.sort(Utilities.dateSorter('lastUpdated', 'desc'));
        this.filteredExams.forEach((exam) => {
          const accreditingBody = exam.accreditingBody;
          const accreditationType = exam.accreditationType;
          AccreditationTableConfigurations.getAccreditationTable(accreditingBody).forEach((item) => {
            // if (item && item.key === accreditationType) {
            //   this.setupCreditTypeDisplay(item, exam);
            // }
          });
          this.setupCanRetake(exam);
        });

        return this.filteredExams;
      });
  }

  setupCanRetake(exam: any) {
    this.userExamService.findByExamId(exam.id).subscribe((userExams: UserExam[]) => {
      if (userExams && userExams.length > 0) {
        exam.canRetake = userExams.some((userExam) => (userExam.status === UserExamStatus.Completed || userExam.status === UserExamStatus.Abandoned) && userExam.userId === this.sessionService.loggedInUser.id);
        exam.canResume = userExams.some((userExam) => userExam.status === (UserExamStatus.Open || userExam.status === UserExamStatus.Paused) && userExam.userId === this.sessionService.loggedInUser.id);

        if (exam.canResume) { exam.canRetake = false; }
      } else {
        exam.canRetake = false;
        exam.canResume = false;
      }
    });
  }

  // setupCreditTypeDisplay(item, exam) {
  //   const creditTypeOption = item.value.creditTypeOptions.find((option) => option.key === exam.creditType);
  //   if (creditTypeOption) {
  //     if (exam.creditType === 'other') {
  //       exam.creditTypeDisplay = exam.otherCreditType;
  //     } else {
  //       exam.creditTypeDisplay = creditTypeOption.value.label;
  //     }
  //     exam.creditTypeDisplayWithTrademark = this.substituteCopyRightedNames(exam.creditTypeDisplay);
  //   }
  // }
  //
  // setupDesignationDisplay(exam) {
  //   exam.designationDisplay = '---';
  //   if (exam.designation === 'other') {
  //     exam.designationDisplay = exam.mocStatement;
  //   } else if (exam.designation) {
  //     const options = DesignationOptions.filter((option) => exam.designation === option.key);
  //     if (options.length > 0) {
  //       exam.designationDisplay = options[0].value;
  //     }
  //   }
  // }

  setupActivityTypeDisplay(exam) {
    exam.learningFormatDisplay = LearningFormatOptions.nameForOption(exam.learningFormat);
  }

  substituteCopyRightedNames(strValue: string) {
    const amaPra1 = 'AMA PRA Category 1 Credit™';
    const amaPra2 = 'AMA PRA Category 2 Credit™';
    const amaPra1s = 'AMA PRA Category 1 Credit(s)™';
    const amaPra2s = 'AMA PRA Category 2 Credit(s)™';

    strValue = strValue.split(amaPra1).join('<em>' + amaPra1 + '</em>');
    strValue = strValue.split(amaPra2).join('<em>' + amaPra2 + '</em>');
    strValue = strValue.split(amaPra1s).join('<em>' + amaPra1s + '</em>');
    strValue = strValue.split(amaPra2s).join('<em>' + amaPra2s + '</em>');

    return strValue;
  }

  getImageFromList(mediaId) {
    const media: Media[] = this.mediaList.filter(m => m.id === mediaId);
    // TODO: don't hardcode the s3 bucket address
    return media.length > 0 ?
      `https://s3.amazonaws.com/nowce-development/${media[0].id}.${media[0].contentType}` :
      'assets/images/missing-image.png';
  }

  getImage(image) {
    if (typeof image === 'string' && image.length > 0) {
      return this.mediaService.findById(image)
        .pipe(map(data => `${environment.mediaUrl}${data.id}.${data.contentType}`));

    } else if (isObject(image) && (image as Media).id) {
      return of((image as Media).thumbnail);
    }

    return of('');
  }


  takeCourseClickHandler(exam) {
    this.routes.navigate([RoutesRp.ActivityIntro, exam.id]);
  }

  displayReadMoreClickHandler(exam) {
    this.examService.findById(exam.id).subscribe((ex) => {
      const dialogData = {
        content: ex,
        title: 'About this activity',
        dimensions: [80, 80],
        actions: []
      };
      this.childPreActivityInformationComponent.openDialog(dialogData);
    });
  }
}
