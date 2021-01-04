
import {Router} from '@angular/router';
import {ExamService} from '../../../shared/services/exam.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
import {Exam, ReviewType} from '../../../shared/models/exam';
import {SessionService} from '../../../shared/services/session.service';
import {Role} from '../../../shared/models/role';
import {NotificationsService} from 'angular2-notifications';
import {ActivityStatus} from '../../../shared/models/activity-status';
import {isArray} from 'lodash';
import {ContextMenuItems} from '../../../shared/models/context-menu-items';
import {Column, ColumnType} from '../../../shared/models/column';


@Component({
  selector: 'app-evaluation-parent-list',
  templateUrl: './evaluation-parent-list.component.html',
  styleUrls: ['./evaluation-parent-list.component.scss']
})

export class EvaluationParentListComponent implements OnInit {

  showSpinner: boolean = false;
  filteredList: Exam[] = [];
  filterTerm: string;
  filterTimeout: any;
  createNew: boolean = false;
  private filterDelay: number = 300;
  private parents: Exam[] = [];
  title: string;
  contextMenu: string[] = [
    ContextMenuItems.Edit,
    ContextMenuItems.Delete,
    ContextMenuItems.Preview];

  columns: Column[] = [{
    type: ColumnType.FirstNWordsStripTags,
    field: 'title',
    width: '55%',
    title: 'Parent activity',
    limit:  15
  },
  {
    type: ColumnType.Date,
    field: 'dateCreated',
    width: '20%',
    title: 'Date created'
  },
    {
      type: ColumnType.Date,
      field: 'lastUpdated',
      width: '20%',
      title: 'Last updated'
    }];

  constructor(public examService: ExamService,
              private sessionService: SessionService,
              public router: Router,
              public dialogRef: MatDialogRef<EvaluationParentListComponent>,
              public dialog: MatDialog,
              private notificationsService: NotificationsService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
      this.parents = data.parents;
      this.title = 'Parents of: ' + data.title;
  }

  onResponseClick(response) {
    this.dialogRef.close(response);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  editCourseClickHandler(exam) {
    if (this.canUserEdit(exam)) {
      window.open(`/activity-manager/edit/${exam.id}`);
    } else {
      this.notificationsService.error('Error', 'You don\'t have permission to edit this activity');
    }
  }

  canUserEdit(exam: Exam) {
    // if the user is a super admin, they can edit
    if (this.sessionService.loggedInUser.roles.indexOf(Role.SuperAdmin) > -1) {
      return 1;
    }

    let isInAuthorList = false;
    if (this.sessionService.loggedInUser && this.sessionService.loggedInUser.id && exam.authors && isArray(exam.authors)) {
      isInAuthorList = (exam.authors.findIndex(author => author.id === this.sessionService.loggedInUser.id) > -1);
    }
    const allowedBlindRoles = [Role.SuperAdmin, Role.Provider, Role.Planner, Role.Editor, Role.Reviewer ];
    let canEditBlindReview = false;
    allowedBlindRoles.forEach( allowedRole => {
      if ( this.sessionService.loggedInUser.roles.indexOf(allowedRole) > -1 ) {
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
}

