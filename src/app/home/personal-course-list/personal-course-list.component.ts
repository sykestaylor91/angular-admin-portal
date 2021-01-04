import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserExamService} from '../../shared/services/user-exam.service';
import {SessionService} from '../../shared/services/session.service';
import {Role} from '../../shared/models/role';
import {UserCourseService} from '../../shared/services/user-course.service';
import {NotificationsService} from 'angular2-notifications';
import {ActionType} from '../../shared/models/action-type';
import { MatDialog } from '@angular/material/dialog';
import {DialogActionsComponent} from '../../shared/dialog/dialog-actions/dialog-actions.component';
import DialogConfig from '../../shared/models/dialog-config';
import {UserExam} from '../../shared/models/user-exam';
import {ExamType} from '../../shared/models/exam-type';
import {RoutesRp} from '../../shared/models/routes-rp';
import { CertificationService } from '../../shared/services/certification.service';
import { DialogIframeComponent } from '../../shared/dialog/dialog-iframe/dialog-iframe.component';
import { Certificate } from '../../shared/models/certificate';
import { Column, ColumnType } from '../../shared/models/column';
import {ContextMenuItems} from '../../shared/models/context-menu-items';
import {FilterList} from '../../shared/models/filter-list';

enum SortOption {
  NewToOld = 1,
  Name
}

@Component({
  selector: 'app-personal-course-list',
  templateUrl: 'personal-course-list.component.html',
  styleUrls: ['personal-course-list.component.scss']
})
export class PersonalCourseListComponent implements OnInit {
  OSCEExaminations: any[] = [];
  inProgressCourses: UserExam[] = [];
  completedCourses: UserExam[] = [];
  filteredInProgressCourses: UserExam[] = [];
  filteredCompletedCourses: UserExam[] = [];
  private selectedAbandonCourse: UserExam;
  sortOrder = SortOption.NewToOld;
  SortOption = SortOption;
  ExamType = ExamType;
  activityTypes: string[] = Object.keys(ExamType).map(key => ExamType[key]);
  filterTerm: string = '';
  filterByType: string = 'all';
  Role = Role;
  contextMenu: string[] = [ContextMenuItems.ResumeActivity, ContextMenuItems.AbandonActivity];
  columns: Column[] = [
    {
      title: 'Activity type',
      field: 'type',
      width: '30%',
      type: ColumnType.Text
    },
    {
      title: 'Activity title',
      field: 'title',
      width: '30%',
      type: ColumnType.Text
    },
    {
      title: 'Started',
      field: 'dateCreated',
      width: '20%',
      type: ColumnType.Date
    },
    {
      title: 'Status',
      field: 'status',
      width: '15%',
      type: ColumnType.Text
    }
  ];
  filterLists: FilterList[] = [
    {
      label: 'Activity type',
      options: this.activityTypes
    }
  ];

  constructor(private userExamService: UserExamService,
              private sessionService: SessionService,
              private router: Router,
              private dialog: MatDialog,
              private notificationsService: NotificationsService,
              private userCourseService: UserCourseService,
              private certificationService: CertificationService) {
  }

  ngOnInit() {
    // TODO Replace temporary get Exams with real call to account service
     this.constructExamLists();
  }

  constructExamLists() {
    this.userExamService.findByUserId(this.sessionService.loggedInUser.id).subscribe((userExam: UserExam[]) => {
        userExam.forEach((ue) => {
            if (ue.status === 'open' || ue.status === 'paused') {
              this.inProgressCourses.push(ue);
            } else if (ue.status === 'completed') {
              this.completedCourses.push(ue);
            }
        });
      this.sort(this.sortOrder);
    });
  }


  takeCourseClickHandler(userExam) {
    this.router.navigate([RoutesRp.ActivityIntro, userExam.examId]);
  }

  resumeCourseClickHandler(userExam) {
    this.userCourseService.setMode('resume');
    this.userCourseService.currentUserExam = userExam;
    this.router.navigate([RoutesRp.ActivityIntro, userExam.examId]);
  }

  showCertificateClickHandler(userExam) {
    this.certificationService.getCertificateHTML(userExam.examId, userExam.userEvaluationId, userExam.id).subscribe((data: Certificate) => {
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

  printCertificateClickHandler(userExam) {
    this.certificationService.getCertificateHTML(userExam.examId, userExam.userEvaluationId, userExam.id).subscribe((data: Certificate) => {
      const win: Window = window.open();
      win.document.write(data.html);
      win.document.write('<style type=\'text/css\' media=\'print\'>@page { size: landscape; }</style>');
      win.stop();
      setTimeout(() => {
        win.print();
      }, 500);
    });
  }

  onShowAbandonConfirmModel(userExam) {
    this.showConfirmModel('Are you sure you wish to abandon this activity?');
    this.selectedAbandonCourse = userExam;
  }

  showConfirmModel(text) {
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm',
        content: text,
        actions: [ActionType.Confirmation]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      ref.close();
      this.confirmDialogHandler(result === ActionType.Confirmation);
    });
  }

  answeredCount(userExam): number {
    if (userExam.questions && userExam.questions.length) {
      return userExam.questions.length;
    } else {
      return 0;
    }
  }

  correctPercentage(userExam): string {
    let percent = '0';
    if (this.answeredCount(userExam) > 0) {
      percent = (parseInt(userExam.score, 10) / this.answeredCount(userExam) * 100).toFixed(2);
    }
    return percent;
  }

  formatType(type): string {
    return decodeURIComponent(type);
  }

  sort(option: any) {
    option = Number.parseInt(option, null);
    this.sortOrder = option;
    let sort: (a: UserExam, b: UserExam) => number;
    switch (this.sortOrder) {
      case SortOption.Name:
        sort = (a, b) => {
            if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
            if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
            return 0;
        };
        break;
      default:
        sort = (a, b) => {
          if (!a && !b) { return 0; }
          if (!a && b) { return -1; }
          if (a && !b) { return 1; }
          if (a.dateCreated < b.dateCreated) { return 1; }
          if (a.dateCreated > b.dateCreated) { return -1; }
        };
        break;
    }
    this.completedCourses = this.completedCourses.sort(sort);
    this.inProgressCourses = this.inProgressCourses.sort(sort);
    this.onFilterChanged();
  }

  // TODO: move all filtering to single shared component and remove all this junk. This is done in a different way everywhere I see it
  onFilterChanged() {
    this.filteredCompletedCourses = this.completedCourses.slice();
    this.filteredInProgressCourses = this.inProgressCourses.slice();
    if (this.filterTerm) {
      this.filteredCompletedCourses = this.filteredCompletedCourses.filter(v => v.title.toLowerCase().indexOf(this.filterTerm.toLowerCase()) > -1);
      this.filteredInProgressCourses = this.filteredInProgressCourses.filter(v => v.title.toLowerCase().indexOf(this.filterTerm.toLowerCase()) > -1);
    }
    if (this.filterByType && this.filterByType !== 'all') {
      this.filteredCompletedCourses = this.filteredCompletedCourses.filter(v => v.type === this.filterByType || decodeURIComponent(v.type) === this.filterByType);
      this.filteredInProgressCourses = this.filteredInProgressCourses.filter(v => v.type === this.filterByType);
    }
  }

  onClearFilters() {
    this.filterTerm = '';
    this.onFilterChanged();
  }

  confirmDialogHandler(event) {
    if (event) {
      this.inProgressCourses = this.inProgressCourses.filter(course => course.id !== this.selectedAbandonCourse.id);
      this.userCourseService.abandonCourse(this.selectedAbandonCourse);
    }
    this.selectedAbandonCourse = null;
  }
}

