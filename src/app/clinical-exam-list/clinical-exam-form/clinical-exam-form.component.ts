import {Component, OnInit, Inject} from '@angular/core';
import Utilities from '../../shared/utilities';

import {FormsManagementDirective} from '../../shared/helpers/forms.management.directive';
import {
  FormBuilder,
  FormControl,
  FormArray,
  Validators, FormGroup,
} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {InputType} from '../../shared/models/input-type';
import {ClinicalExam} from '../../shared/models/clinical-exam';
import {Station} from '../../shared/models/station';
import {Circuit} from '../../shared/models/circuit';
import {PermissionService} from '../../shared/services/permission.service';
import {ClinicalExamService} from '../../shared/services/clinical-exam.service';
import {CircuitService} from '../../shared/services/circuit.service';
import {StationService} from '../../shared/services/station.service';

import {AddRemoveResourceComponent} from '../add-remove-resource/add-remove-resource.component';
import {CircuitFormComponent} from '../circuit-form/circuit-form.component';
import {ActivatedRoute} from '@angular/router';

import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';

type OrderBy = 'newToOld' | 'oldToNew';

@Component({
  selector: 'app-clinical-exam-form',
  templateUrl: './clinical-exam-form.component.html',
  styleUrls: ['./clinical-exam-form.component.scss']
})
export class ClinicalExamFormComponent extends FormsManagementDirective implements OnInit {

  clinicalExam: ClinicalExam;
  formType: string = 'Create';

  InputType = InputType;

  // form
  public id: FormControl;
  public title: FormControl;
  public author: FormControl;
  public status: FormControl;
  public comments: FormControl;
  public dateScheduled: FormControl;
  public circuits: string[];
  public circuitList: any[];
  public examinerList: any[];
  public candidateList: any[];
  public stationList: Station[];
  public stationExaminerAllocations: any[] = [];
  public candidateCircuitAllocations: any[];

  // TODO: fetch examiners, candidates and proctors from user service
  examiners: any[] = [{
    id: 100000001,
    name: 'Examiner 1',
    email: 'examiner@example.com',
    dateCreated: new Date(new Date().setDate(new Date().getDate() - 5))
  },
    {
      id: 100000002,
      name: 'Examiner 2',
      email: 'examiner2@example.com',
      dateCreated: new Date(new Date().setDate(new Date().getDate() - 5))
    },
    {
      id: 100000003,
      name: 'Examiner 3',
      email: 'examiner3@example.com',
      dateCreated: new Date(new Date().setDate(new Date().getDate() - 5))
    }];

  candidates: any[] = [{
    id: 100000001,
    name: 'Candidate 1',
    email: 'candidate@example.com',
    dateCreated: new Date(new Date().setDate(new Date().getDate() - 5))
  },
    {
      id: 100000002,
      name: 'Candidate 2',
      email: 'candidate2@example.com',
      dateCreated: new Date(new Date().setDate(new Date().getDate() - 5))
    },
    {
      id: 100000003,
      name: 'Candidate 3',
      email: 'candidate3@example.com',
      dateCreated: new Date(new Date().setDate(new Date().getDate() - 5))
    }];

  candidateFilterTerm: string;

  filteredCandidates: any[];

  currentCandidateOrder: OrderBy = 'newToOld';
  subComponent: boolean = false;
  formLoaded: boolean = false;

  public examCircuits: Circuit[] = [];

  formSubmitted: Boolean = false;

  constructor(private permissionService: PermissionService,
              private clinicalExamService: ClinicalExamService,
              private circuitService: CircuitService,
              private stationService: StationService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<ClinicalExamFormComponent>,
              private notificationsService: NotificationsService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(permissionService);
    this.clinicalExam = data.clinicalExam || new ClinicalExam();
    this.formType = data.formType;

    if (!this.clinicalExam.circuits) {
      this.clinicalExam.circuits = [];
    }
  }

  ngOnInit() {
    if (this.data && this.data.subComponent) {
      this.subComponent = true;
      this.createForm(this.clinicalExam);
      this.populateExamCircuits();
      this.stationService.query().subscribe(stations => {
        if (stations && stations.length > 0) {
          this.stationList = stations.filter(station => station.status !== 'deleted');
        }
      });
    } else {
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.formType = 'Edit';
          this.clinicalExamService.findById(params['id']).subscribe(result => {
            if (result) {
              this.clinicalExam = result;
              this.createForm(this.clinicalExam);
              this.populateExamCircuits();
              this.stationService.query().subscribe(stations => {
                if (stations && stations.length > 0) {
                  this.stationList = stations.filter(station => station.status !== 'deleted');
                }
              });
            } else {
              this.notificationsService.alert('Not found', 'That clinical exam cannot be found.');
            }
          });
        } else {
          this.formType = 'Create';
          this.createForm(this.clinicalExam);
        }
      });
    }
  }

  createForm(clinicalExam: ClinicalExam) {
    this.id = new FormControl(clinicalExam.id, []);
    this.title = new FormControl(clinicalExam.title, [Validators.required]);
    this.dateScheduled = new FormControl(clinicalExam.dateScheduled, []);
    // this.options = this.formBuilder.array([]);
    this.status = new FormControl(clinicalExam.status, []);

    this.form = this.formBuilder.group({
      id: this.id,
      title: this.title,
      dateScheduled: this.dateScheduled,
      status: this.status

    });
    this.formLoaded = true;
  }

  saveChanges() {
    if (this.form.valid) {

      this.clinicalExamService.save(this.constructClinicalExam()).subscribe(data => {
        this.notificationsService.success('Success', 'Clinical exam saved successfully');
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
      errors = errors + 'Title is required.<br>';
    }
    this.notificationsService.error('Form invalid', errors);
  }

  constructClinicalExam() {
    const newClinicalExam = new ClinicalExam();
    if (this.clinicalExam.id) {
      newClinicalExam.id = this.clinicalExam.id;
    }

    newClinicalExam.title = this.title.value;
    newClinicalExam.dateScheduled = this.dateScheduled.value;
    newClinicalExam.status = this.status.value;
    newClinicalExam.comments = this.clinicalExam.comments;

    newClinicalExam.circuits = this.clinicalExam.circuits;
    newClinicalExam.stationExaminerAllocations = this.clinicalExam.stationExaminerAllocations;
    return newClinicalExam;
  }

  removeCircuit(i: number) {
    this.clinicalExam.circuits.splice(i, 1);
    this.populateExamCircuits();
  }

  addCircuitsClickHandler() {

    const dialogRef = this.dialog.open(AddRemoveResourceComponent, {
      disableClose: true,
      height: '80%',
      width: '80%',
      data: {
        selectedItems: this.clinicalExam.circuits,
        sourceList: this.circuitList,
        dialogTitle: 'Circuit list',
        displayProperty: 'title',
        listType: 'id'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.clinicalExam.circuits = result.list;
      this.populateExamCircuits();
    });
  }

  populateExamCircuits() {
    this.examCircuits.splice(0, this.examCircuits.length);

    this.circuitService.query().subscribe(circuits => {
      if (circuits && circuits.length > 0) {
        this.circuitList = circuits.filter(circuit => circuit.status !== 'deleted');
        this.circuitList.forEach((circuit) => {
          if (this.clinicalExam.circuits.indexOf(circuit.id) > -1) {
            this.examCircuits.push(circuit);
          }
        });
      }
    });
  }

  circuitContainsStation(station, circuit) {
    return circuit.stations.indexOf(station.id) > -1;
  }

  updateCandidateFilteredItems(array) {
    this.filteredCandidates = array.sort(Utilities.dateSorter('dateCreated', this.currentCandidateOrder === 'newToOld' ? 'desc' : 'asc'));
  }

  clearCandidateFilters() {
    this.filteredCandidates = this.candidates;
    this.candidateFilterTerm = '';
  }

  addExaminersToStationClickHandler(stationId) {
    if (!this.stationExaminerAllocations[stationId]) {
      this.stationExaminerAllocations[stationId] = [];
    }
    const dialogRef = this.dialog.open(AddRemoveResourceComponent, {
      height: '80%',
      width: '80%',
      data: {
        selectedItems: this.stationExaminerAllocations[stationId],
        sourceList: this.examiners,
        dialogTitle: 'Station examiners',
        displayProperty: 'name'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.stationExaminerAllocations[stationId] = result.list;
    });
  }

  createCircuitClickHandler() {
    const dialogRef = this.dialog.open(CircuitFormComponent, {
      height: '80%',
      width: '80%',
      data: {
        formType: 'Create'
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationsService.info('Circuit added to the exam');
        this.examCircuits.push(result);
        this.clinicalExam.circuits.push(result.id);
      }
    });

  }

  editCircuitClickHandler(resource) {
    const dialogRef = this.dialog.open(CircuitFormComponent, {
      height: '80%',
      width: '80%',
      data: {
        formType: 'Edit',
        circuit: resource
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // re-fetch the list
      this.populateExamCircuits();
    });
  }

  removeCircuitClickHandler(id) {
    alert('todo');
    // TODO: add remove circuit click handler
  }

  editCandidateClickHandler(candidate) {
    alert('todo');
    // TODO: add editCandidateClickHandler
  }

  confirmDeleteCandidateClickHandler(candidate) {
    alert('todo');
    // TODO: add confirmDeleteCandidateClickHandler
  }

  createCandidateClickHandler(e) {
    alert('todo');
    // TODO: add createCandidateClickHandler
  }

  uploadClickHandler(e) {
    alert('todo');
    // TODO: add uploadClickHandler
  }
}
