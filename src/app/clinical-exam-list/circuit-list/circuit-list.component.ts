import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import DialogConfig from '../../shared/models/dialog-config';
import {DialogActionsComponent} from '../../shared/dialog/dialog-actions/dialog-actions.component';
import {finalize} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';
import {CircuitService} from '../../shared/services/circuit.service';
import {CircuitFormComponent} from '../circuit-form/circuit-form.component';
import {ActionType} from '../../shared/models/action-type';
import {Circuit} from '../../shared/models/circuit';
import {Column, ColumnType} from '../../shared/models/column';
import {ContextMenuItems} from '../../shared/models/context-menu-items';


@Component({
  selector: 'app-circuit-list',
  templateUrl: './circuit-list.component.html',
  styleUrls: ['./circuit-list.component.scss']
})
export class CircuitListComponent implements OnInit {

  showCircuitSpinner: boolean = true;
  circuits: Circuit[] = [];
  columns: Column[] = [{
    type: ColumnType.FirstNWordsStripTags,
    field: 'title',
    width: '70%',
    title: 'Circuit title',
    limit: 10
  },
  {
    type: ColumnType.Date,
    field: 'dateCreated',
    width: '30%',
    title: 'Date created'
  }
  ];
  contextMenuItems: string[] = [ContextMenuItems.Edit, ContextMenuItems.Delete, ContextMenuItems.UseAsTemplate];

  constructor(
    private circuitService: CircuitService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getCircuits();
  }

  getCircuits() {
    this.circuitService.query().subscribe(circuits => {
      if (circuits && circuits.length > 0) {
        this.circuits = circuits.filter(circuit => circuit.status !== 'deleted');
      }
      this.showCircuitSpinner = false;
    });
  }

  createCircuitClickHandler() {
    this.router.navigate(['/clinical/circuit-form']);
  }

  editClickHandler(resource) {
    this.router.navigate(['/clinical/circuit-form', resource.id]);
  }

  editCircuitDialog(resource) {
    const dialogRef = this.dialog.open(CircuitFormComponent, {
      height: '80%',
      width: '80%',
      data: {
        circuit: resource,
        formType: 'Edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCircuits();
    });
  }

  useAsBlueprintClickHandler(circuit) {
    circuit.id = null;
    circuit.title = circuit.title + ' - used as a blueprint...';
    this.editCircuitDialog(circuit);
  }

  deleteClickHandler(circuit) {
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this circuit?',
        actions: [ActionType.Confirmation]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      this.deleteCircuit(circuit);
      ref.close();
    });
  }

  deleteCircuit(circuit) {
    this.showCircuitSpinner = true;
    this.circuitService.remove(circuit)
      .pipe(finalize(() => this.showCircuitSpinner = false))
      .subscribe(data => {
        const idx = this.circuits.findIndex(circuitItem => circuitItem.id === circuit.id);
        this.circuits.splice(idx, 1);
        this.notificationsService.success('Success', 'Circuit deleted successfully');
      }, err => {
        this.notificationsService.error(err);
        console.error(err);
      });
  }
}
