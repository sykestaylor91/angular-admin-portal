import {Component, OnInit, Inject} from '@angular/core';
import {FormsManagementDirective} from '../../shared/helpers/forms.management.directive';
import {
  FormBuilder,
  FormControl,
  FormArray,
  Validators, FormGroup,
} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {InputType} from '../../shared/models/input-type';
import {Circuit} from '../../shared/models/circuit';
import {Station} from '../../shared/models/station';
import {PermissionService} from '../../shared/services/permission.service';
import {CircuitService} from '../../shared/services/circuit.service';
import {StationService} from '../../shared/services/station.service';
import DialogConfig from '../../shared/models/dialog-config';
import {DialogActionsComponent} from '../../shared/dialog/dialog-actions/dialog-actions.component';
import {ActionType} from '../../shared/models/action-type';
import {StationFormComponent} from '../station-form/station-form.component';
import {AddRemoveResourceComponent} from '../add-remove-resource/add-remove-resource.component';

import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-circuit-form',
  templateUrl: './circuit-form.component.html',
  styleUrls: ['./circuit-form.component.scss']
})
export class CircuitFormComponent extends FormsManagementDirective implements OnInit {

  circuit: Circuit;
  formType: string = 'Create';

  InputType = InputType;
  subComponent: boolean = false;
  formLoaded: boolean = false;

  // form
  public id: FormControl;
  public title: FormControl;
  public intro: FormControl;
  public text: FormControl;
  public keywords: FormControl;
  public dateScheduled: FormControl;
  public additionalInfo: FormControl;
  public candidateNotes: FormControl;
  public examinerNotes: FormControl;
  public actorScripts: FormControl;
  public stations: FormControl;

  formSubmitted: Boolean = false;
  circuitStations: Station[] = [];
  stationList: Station[] = [];

  constructor(private permissionService: PermissionService,
              private circuitService: CircuitService,
              private stationService: StationService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CircuitFormComponent>,
              private notificationsService: NotificationsService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(permissionService);
    this.circuit = data.circuit || new Circuit();
    this.formType = data.formType;
  }

  ngOnInit() {
    if (this.data && this.data.subComponent) {
      this.subComponent = true;
      this.populateCircuitStations();
      this.createForm(this.circuit);
    } else {
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.formType = 'Edit';
          this.circuitService.findById(params['id']).subscribe(result => {
            if (result) {
              this.circuit = result;
              this.populateCircuitStations();
              this.createForm(this.circuit);
            } else {
              this.notificationsService.alert('Not Found', 'The circuit you requested cannot be found.');
            }
          });
        } else {
          this.formType = 'Create';
          this.createForm(this.circuit);
        }
      });
    }
  }

// TODO: ensure stations are the right order
  populateCircuitStations() {
    this.circuitStations.splice(0, this.circuitStations.length);
    this.stationService.query().subscribe(stations => {
      if (stations && stations.length > 0) {
        this.stationList = stations.filter(station => station.status !== 'deleted');
        this.stationList.forEach((station) => {
          if (this.stationIsInCircuit(station)) {
            this.circuitStations.push(station);
          }
        });
      }
    });
  }

  createForm(circuit: Circuit) {

    this.id = new FormControl(circuit.id, []);
    this.title = new FormControl(circuit.title, [
      Validators.required
    ]);
    this.keywords = new FormControl(circuit.keywords, []);
    this.intro = new FormControl(circuit.intro, []);
    this.text = new FormControl(circuit.text);
    this.dateScheduled = new FormControl(circuit.dateScheduled, []);
    this.additionalInfo = new FormControl(circuit.additionalInfo, []);
    this.candidateNotes = new FormControl(circuit.candidateNotes, []);
    this.examinerNotes = new FormControl(circuit.examinerNotes, []);
    this.actorScripts = new FormControl(circuit.actorScripts, []);
    this.stations = new FormControl(circuit.stations, []);

    this.form = this.formBuilder.group({
      id: this.id,
      title: this.title,
      keywords: this.keywords,
      intro: this.intro,
      text: this.text,
      dateScheduled: this.dateScheduled,
      candidateNotes: this.candidateNotes,
      additionalInfo: this.additionalInfo,
      examinerNotes: this.examinerNotes,
      actorScripts: this.actorScripts,
      stations: this.stations
    });
    this.formLoaded = true;
  }

  saveChanges() {
    if (this.form.valid) {
      this.circuitService.save(this.constructCircuit()).subscribe(data => {
        this.notificationsService.success('Success', 'Circuit saved successfully');
        if (this.subComponent) {
          this.dialogRef.close(data);
        }
      }, err => {
        this.notificationsService.error(err);
        console.error(err);
      });
    } else {
      this.errorMessage();
    }
  }

  errorMessage() {
    let errors = '';
    if (!this.title.value) {
      errors = errors + 'Circuit title is required.<br>';
    }
    if (!this.text.value) {
      errors = errors + 'Text is required.<br>';
    }
    this.notificationsService.error('Form invalid', errors);
  }

  constructCircuit() {
    const newCircuit = new Circuit();
    if (this.circuit.id) {
      newCircuit.id = this.circuit.id;
    }
    newCircuit.title = this.title.value;
    newCircuit.keywords = this.keywords.value;
    newCircuit.examinerNotes = this.examinerNotes.value;
    newCircuit.intro = this.intro.value;
    newCircuit.text = this.text.value;
    newCircuit.dateScheduled = this.dateScheduled.value;
    newCircuit.candidateNotes = this.candidateNotes.value;
    newCircuit.additionalInfo = this.additionalInfo.value;
    newCircuit.actorScripts = this.actorScripts.value;
    newCircuit.stations = this.stations.value;
    newCircuit.comments = this.circuit.comments;
    return newCircuit;
  }

  stationIsInCircuit(station) {
    return (this.circuit.stations) ? this.circuit.stations.includes(station.id) : false;
  }

  onDropSuccess(item) {
    this.form.get('stations').setValue(this.circuitStations.map(station => station.id));
  }

  editStationClickHandler(resource) {
    const dialogRef = this.dialog.open(StationFormComponent, {
      height: '80%',
      width: '80%',
      data: {
        station: resource,
        formType: 'Edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.populateCircuitStations();
      this.form.get('stations').setValue(this.circuitStations.map(station => station.id));
    });
  }

  createStationClickHandler() {
    const dialogRef = this.dialog.open(StationFormComponent, {
      height: '80%',
      width: '80%',
      data: {
        formType: 'Create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result ) {
        this.notificationsService.info('Station added to the circuit');
        this.circuitStations.push(result);
        this.circuit.stations.push(result.id);
        this.form.get('stations').setValue(this.circuitStations.map(station => station.id));
      }
    });

  }

  removeStationClickHandler(station) {

    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm Delete',
        content: 'Are you sure you want to remove this station?',
        actions: [ActionType.Confirmation]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      const index = this.circuitStations.indexOf(station);
      this.circuitStations.splice(index, 1);
      this.circuit.stations.splice(this.circuit.stations.indexOf(station.id));
      this.form.get('stations').setValue(this.circuitStations.map(circuitStation => circuitStation.id));
      ref.close();
    });

  }

  openPreviewNewWindow(station) {
    window.open(`/clinical-exam/${station.id}`);
  }

  addStationsClickHandler() {
    const dialogRef = this.dialog.open(AddRemoveResourceComponent, {
      disableClose: true,
      height: '80%',
      width: '80%',
      data: {
        selectedItems: this.circuit.stations,
        sourceList: this.stationList,
        dialogTitle: 'Stations in this circuit',
        displayProperty: 'title'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.circuit.stations = result.list;
      this.populateCircuitStations();
    });
  }
}
