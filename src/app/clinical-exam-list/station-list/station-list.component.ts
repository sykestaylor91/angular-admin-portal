import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import DialogConfig from '../../shared/models/dialog-config';
import {DialogActionsComponent} from '../../shared/dialog/dialog-actions/dialog-actions.component';
import {finalize} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';
import {StationService} from '../../shared/services/station.service';
import {StationFormComponent} from '../station-form/station-form.component';
import {ActionType} from '../../shared/models/action-type';
import {Station} from '../../shared/models/station';
import {Column, ColumnType} from '../../shared/models/column';
import {ContextMenuItems} from '../../shared/models/context-menu-items';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})
export class StationListComponent implements OnInit {

  stationFilterTerm: string;
  showStationSpinner: boolean = true;

  stations: Station[] = [];
  columns: Column[] = [{
    type: ColumnType.FirstNWordsStripTags,
    field: 'title',
    width: '70%',
    title: 'Station title',
    limit: 10
  },
  {
    type: ColumnType.Date,
    field: 'dateCreated',
    width: '30%',
    title: 'Date created'
  }
  ];
  contextMenuItems: string[] = [ContextMenuItems.Edit, ContextMenuItems.Delete, ContextMenuItems.UseAsTemplate, ContextMenuItems.Preview];

  constructor(
    private stationService: StationService,
    private notificationsService: NotificationsService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.getStations();
  }

  getStations() {
    this.stationService.query().subscribe(stations => {
      if (stations && stations.length > 0) {
        this.stations = stations.filter(station => station.status !== 'deleted');
      }
      this.showStationSpinner = false;
    });
  }

  createStationClickHandler() {
    this.router.navigate(['/clinical/station-form']);
  }

  editClickHandler(resource) {
    this.router.navigate(['/clinical/station-form', resource.id]);
  }

  editStationDialog(resource) {
    const dialogRef = this.dialog.open(StationFormComponent, {
      height: '80%',
      width: '80%',
      data: {
        station: resource,
        formType: 'Edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStations();
    });
  }

  useAsBlueprintClickHandler(station) {
    station.id = null;
    station.title = station.title + ' - used as a blueprint...';
    this.editStationDialog(station);
  }

  deleteClickHandler(station) {
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this station?',
        actions: [ActionType.Confirmation]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      this.deleteStation(station);
      ref.close();
    });
  }

  deleteStation(station) {
    this.showStationSpinner = true;
    this.stationService.remove(station)
      .pipe(finalize(() => this.showStationSpinner = false))
      .subscribe(data => {
        const idx = this.stations.findIndex(stationItem => stationItem.id === station.id);
        this.stations.splice(idx, 1);
        this.notificationsService.success('Success', 'Station deleted successfully');
      }, err => {
        this.notificationsService.error(err);
        console.error(err);
      });
  }

  showExaminerView(station) {
    window.open(`/clinical-exam/${station.id}`);
  }
}
