import {Component, OnInit} from '@angular/core';
import {EvaluationService} from '../../shared/services/evaluation.service';
import {ExamService} from '../../shared/services/exam.service';
import {Evaluation} from '../../shared/models/evaluation';
import {Exam} from '../../shared/models/exam';
import {EvaluationListColumns} from './evaluation-list-columns';
import {ColumnType} from '../../shared/models/column';
import Utilities from '../../shared/utilities';
import {ActivityStatus} from '../../shared/models/activity-status';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {RoutesRp} from '../../shared/models/routes-rp';
import { MatDialog } from '@angular/material/dialog';
import {EvaluationParentListComponent} from './evaluation-parent-list/evaluation-parent-list.component';
import {ContextMenuItems} from '../../shared/models/context-menu-items';

export interface ActivityParentExams {
  [key: string]: Exam[];
}

@Component({
  selector: 'app-evaluation-questions',
  templateUrl: 'evaluation-list.component.html'
})
export class EvaluationListComponent implements OnInit {
  evaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];
  filterTerm: String = '';
  columns = EvaluationListColumns;
  sort = 'newToOld';
  canDelete: boolean = true;
  showSpinner: boolean = true;
  exams: Exam[] = [];
  ColumnType = ColumnType;
  activityParentExams: ActivityParentExams = {};

  contextMenu: string[] = [
    ContextMenuItems.Edit,
    ContextMenuItems.Delete,
    ContextMenuItems.Preview];

  constructor(private evaluationService: EvaluationService,
              private examService: ExamService,
              private notificationService: NotificationsService,
              private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit() {
    // console.log('**** get exams');

    this.evaluationService.getAllEvaluationsMetaData().subscribe(evaluations => {
      this.evaluations = evaluations.filter(evaluation => evaluation.status !== ActivityStatus.Deleted);
      this.applyFilters();
      this.showSpinner = false;
      this.examService.getExams().subscribe( exams => {
        this.exams = exams;
        this.showSpinner = false;
        this.setUpExamAssociations();
      });
    });


  }

  applyFilters() {
    this.filteredEvaluations = this.evaluations.slice();
    this.filteredEvaluations = this.filteredEvaluations.sort(Utilities.dateSorter('lastUpdated', this.sort === 'newToOld' ? 'desc' : 'asc'));
    if (!this.filterTerm || this.filterTerm === '') {
      return;
    } else {
      const searchTerm = this.filterTerm.toLowerCase();
      this.filteredEvaluations = this.evaluations.filter(evaluation => {
        return (evaluation.title && evaluation.title.toLowerCase().indexOf(searchTerm) > -1) ||
          (evaluation.subtitle && evaluation.subtitle.toLowerCase().indexOf(searchTerm) > -1);
      });
    }
  }
  setUpExamAssociations() {
    this.evaluations.forEach( evaluation => {
      this.exams.forEach(exam => {
        if (exam.postActivityEvaluation === evaluation.id) {
          if (!this.activityParentExams[evaluation.id])  {
            this.activityParentExams[evaluation.id] = [];
          }
          this.activityParentExams[evaluation.id].push(exam);
        }
      });
    });
  }

  showAssociatedExams(evaluation) {
    this.dialog.open(EvaluationParentListComponent, {
        height: '80%',
        width: '80%',
        data: {
          title: evaluation.title,
          parents: this.activityParentExams[evaluation.id]
        }
      }
    );
  }

  editClicked(evaluation) {
    // add permission check
    this.router.navigate(['/activity-manager/evaluation/edit/', evaluation.id]);
  }

  onClearFilters() {
    this.filterTerm = '';
    this.applyFilters();
  }

  onDeleteClick(evaluation: Evaluation) {
    evaluation.status = ActivityStatus.Deleted;
    this.evaluationService.save(evaluation).subscribe(() => {
      this.evaluations = this.evaluations.filter(e => e.status !== ActivityStatus.Deleted);
      this.applyFilters();
      this.notificationService.success('Success', 'Evaluation deleted successfully');
    });
  }

  createNewEvaluation() {
    this.router.navigate(['/activity-manager/evaluation/new']);
  }

  onPreviewClick(evaluation: Evaluation) {
    this.router.navigate([RoutesRp.EvaluationPreview, evaluation.id]);
  }

}
