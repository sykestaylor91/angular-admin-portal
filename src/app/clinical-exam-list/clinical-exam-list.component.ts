import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import DialogConfig from '../shared/models/dialog-config';
import {Router} from '@angular/router';
import {DialogActionsComponent} from '../shared/dialog/dialog-actions/dialog-actions.component';
import {finalize} from 'rxjs/operators';
import {ClinicalExamService} from '../shared/services/clinical-exam.service';
import {NotificationsService} from 'angular2-notifications';
import {ClinicalExamFormComponent} from './clinical-exam-form/clinical-exam-form.component';
import {ActionType} from '../shared/models/action-type';
import {ClinicalExam} from '../shared/models/clinical-exam';
import {Column, ColumnType} from '../shared/models/column';
import {ContextMenuItems} from '../shared/models/context-menu-items';

@Component({
  selector: 'app-clinical-exam-list',
  templateUrl: './clinical-exam-list.component.html',
  styleUrls: ['./clinical-exam-list.component.scss']
})
export class ClinicalExamListComponent implements OnInit {

  clinicalExamFilterTerm: string;
  showClinicalExamSpinner: boolean = true;

  clinicalExams: ClinicalExam[] = [];
  columns: Column[] = [{
    type: ColumnType.FirstNWordsStripTags,
    field: 'title',
    width: '40%',
    title: 'Clinical exam title',
    limit: 10
  },
  {
    type: ColumnType.Date,
    field: 'dateScheduled',
    width: '20%',
    title: 'Date scheduled',
  },
  {
    type: ColumnType.Date,
    field: 'dateCreated',
    width: '20%',
    title: 'Date created'
  },
  {
    type: ColumnType.Text,
    field: 'status',
    width: '20%',
    title: 'Status'
  }];
  contextMenuItems: string[] = [ContextMenuItems.Edit, ContextMenuItems.Delete, ContextMenuItems.UseAsTemplate, ContextMenuItems.Preview];

  constructor(
    private clinicalExamService: ClinicalExamService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getFilteredExams();
  }

  getFilteredExams() {
    this.clinicalExamService.query().subscribe(clinicalExams => {
      if (clinicalExams && clinicalExams.length > 0) {
        this.clinicalExams = clinicalExams.filter(clinicalExam => clinicalExam.status !== 'deleted');
      }
      this.showClinicalExamSpinner = false;
    });
  }

  createClinicalExamClickHandler() {
    this.router.navigate(['/clinical/clinical-exam-form']);
  }

  editClickHandler(resource) {
    this.router.navigate(['/clinical/clinical-exam-form', resource.id]);
  }

  editDialogClickHandler(resource) {
    const dialogRef = this.dialog.open(ClinicalExamFormComponent, {
      height: '80%',
      width: '80%',
      data: {
        clinicalExam: resource,
        formType: 'Edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getFilteredExams();
    });

  }

  useAsBlueprintClickHandler(clinicalExam) {
    clinicalExam.id = null;
    clinicalExam.title = clinicalExam.title + ' - used as a blueprint...';
    this.editDialogClickHandler(clinicalExam);
  }

  deleteClinicalExamClickHandler(clinicalExam) {
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this ClinicalExam?',
        actions: [ActionType.Confirmation]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      this.deleteClinicalExam(clinicalExam);
      ref.close();
    });
  }

  deleteClinicalExam(clinicalExam) {
    this.showClinicalExamSpinner = true;
    this.clinicalExamService.remove(clinicalExam)
      .pipe(finalize(() => this.showClinicalExamSpinner = false))
      .subscribe(data => {
        const idx = this.clinicalExams.findIndex(ClinicalExamItem => ClinicalExamItem.id === clinicalExam.id);
        this.clinicalExams.splice(idx, 1);
        this.notificationsService.success('Success', 'ClinicalExam deleted successfully');
      }, err => {
        this.notificationsService.error(err);
        console.error(err);
      });
  }

  goToClinicalExamClickHandler(clinicalExam) {
    // TODO: add this
    this.notificationsService.error('TODO', 'Needs implementing');
  }
}
