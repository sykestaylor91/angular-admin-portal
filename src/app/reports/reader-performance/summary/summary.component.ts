import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {ReaderPerformanceService} from '../reader-performance.service';
import {User} from '../../../shared/models/user';
import { Column, ColumnType } from '../../../shared/models/column';
import {ContextMenuItems} from '../../../shared/models/context-menu-items';
import { ChosenActivityService } from '../../../shared/services/chosen-activity.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html'
})
export class ReaderPerformanceSummaryComponent implements OnInit {
  title: string = 'Summary';
  userId: string;
  clientName: string;
  columnsSummary: Column[];

  @Output() setResponses = new EventEmitter();

  User = User;

constructor(public readerPerformanceService: ReaderPerformanceService, private chosenActvityService: ChosenActivityService) {
    }

  ngOnInit() {
this.columnsSummary = [
      {
        type: ColumnType.Text,
        field: 'title',
        width: '50%',
        title: 'Activity Title',
        limit: 6
      },
      {
        type: ColumnType.Date,
        field: 'stat.dateCreated',
        width: '16%',
        title: 'Date Activity Started'
      },
      {
        type: ColumnType.Date,
        field: 'stat.dateCompleted',
        width: '16%',
        title: 'Date Activity Completed'
      },
      {
        type: ColumnType.Date,
        field: 'stat.lastUpdated',
        width: '16%',
        title: 'Date Activity Abandoned',
        dependency: 'stat.status',
        dependencyValue: 'abandoned'
      },
      {
        type: ColumnType.CheckBox,
        field: 'certificateClaimed',
        width: '16%',
        title: 'Was Certificate Claimed'
      },
      {
        type: ColumnType.Text,
        field: 'score',
        width: '16%',
        title: 'Final Score'
      },
      {
        type: ColumnType.Text,
        field: 'elapsedSeconds',
        width: '16%',
        title: 'Lapse Time'
      },
      {
        type: ColumnType.CustomRadio,
        field: 'elapsedSeconds',
        width: '16%',
        title: 'Select'
      }
    ];
  }

  selectedUserExamClickHandler(data) {
    this.readerPerformanceService.setSelectedUserExam(data);
    this.setResponses.emit(null);
    this.chosenActvityService.changeMessage(JSON.stringify(data));
  }

  // TODO Add column to table that denotes final score as a percentage
}
