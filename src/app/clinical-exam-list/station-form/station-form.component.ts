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
import {Station, StationSection} from '../../shared/models/station';
import {Item} from '../../shared/models/item';

import {PermissionService} from '../../shared/services/permission.service';
import {StationService} from '../../shared/services/station.service';
import {ItemService} from '../../shared/services/item.service';

import {AddRemoveResourceComponent} from '../add-remove-resource/add-remove-resource.component';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-station-form',
  templateUrl: './station-form.component.html',
  styleUrls: ['./station-form.component.scss']
})
export class StationFormComponent extends FormsManagementDirective implements OnInit {

  station: Station;
  formType: string = 'Create';

  InputType = InputType;
  subComponent: boolean = false;
  itemList: any;
  formLoaded: boolean = false;

  // form
  public id: FormControl;
  public title: FormControl;
  public intro: FormControl;
  public text: FormControl;
  public keywords: FormControl;
  public dateScheduled: FormControl;
  public subject: FormControl;
  public candidateNotes: FormControl;
  public examinerNotes: FormControl;
  public actorScripts: FormControl;


  formSubmitted: Boolean = false;
  sections: any[] = [];

  constructor(private permissionService: PermissionService,
              private stationService: StationService,
              private itemService: ItemService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<StationFormComponent>,
              private notificationsService: NotificationsService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(permissionService);
    this.station = data.station || new Station();
    this.formType = data.formType;
  }

  ngOnInit() {
    if (this.data && this.data.subComponent) {
      this.subComponent = true;
      this.createForm(this.station);
      this.itemService.query().subscribe(items => {
        if (items && items.length > 0) {
          this.itemList = items.filter(item => item.status !== 'deleted');
        }
      });
    } else {
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.formType = 'Edit';
          this.stationService.findById(params['id']).subscribe(result => {
            if (result) {
              this.station = result;
              this.createForm(this.station);
              this.itemService.query().subscribe(items => {
                if (items && items.length > 0) {
                  this.itemList = items.filter(item => item.status !== 'deleted');
                }
              });
            } else {
              this.notificationsService.alert('Not found', 'The station you requested cannot be found.');
            }
          });
        } else {
          this.formType = 'Create';
          this.createForm(this.station);
        }
      });
    }
  }

  createForm(station: Station) {

    this.id = new FormControl(station.id, []);
    this.title = new FormControl(station.title, [
      Validators.required
    ]);
    this.keywords = new FormControl(station.keywords, []);
    this.intro = new FormControl(station.intro, []);
    this.text = new FormControl(station.text);
    this.dateScheduled = new FormControl(station.dateScheduled, []);
    this.subject = new FormControl(station.subject, []);
    this.candidateNotes = new FormControl(station.candidateNotes, []);
    this.examinerNotes = new FormControl(station.examinerNotes, []);
    this.actorScripts = new FormControl(station.actorScripts, []);

    this.form = this.formBuilder.group({

      id: this.id,
      title: this.title,
      keywords: this.keywords,
      intro: this.intro,
      text: this.text,
      dateScheduled: this.dateScheduled,
      candidateNotes: this.candidateNotes,
      subject: this.subject,
      examinerNotes: this.examinerNotes,
      actorScripts: this.actorScripts

    });

    this.sections = station.sections;

    this.formLoaded = true;
  }

  saveChanges() {
    if (this.form.valid) {
      this.stationService.save(this.constructStation()).subscribe(data => {
        this.notificationsService.success('Success', 'Station saved successfully');

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

  closeDialog() {
    this.dialogRef.close();
  }

  errorMessage() {
    let errors = '';
    if (!this.title.value) {
      errors = errors + 'Station title is required.<br>';
    }
    if (!this.text.value) {
      errors = errors + 'Text is required.<br>';
    }
    this.notificationsService.error('Form invalid', errors);
  }

  constructStation() {
    const newStation = new Station();
    if (this.station.id) {
      newStation.id = this.station.id;
    }
    newStation.title = this.title.value;
    newStation.keywords = this.keywords.value;
    newStation.examinerNotes = this.examinerNotes.value;
    newStation.intro = this.intro.value;
    newStation.text = this.text.value;
    newStation.dateScheduled = this.dateScheduled.value;
    newStation.candidateNotes = this.candidateNotes.value;
    newStation.subject = this.subject.value;
    newStation.actorScripts = this.actorScripts.value;

    newStation.sections = this.sections;

    newStation.comments = this.station.comments;
    return newStation;
  }

  addSectionClickHandler() {
    this.sections.push(new StationSection());
  }

  removeSectionClickHandler(i) {
    // TODO: add confirm modal
    this.sections.splice(i, 1);
  }

  addItemsClickHandler(i) {
    // TODO: ensure sections is an array
    if (!this.sections[i].items) {
      this.sections[i].items = [];
    }
    const dialogRef = this.dialog.open(AddRemoveResourceComponent, {
      height: '80%',
      width: '80%',
      data: {
        selectedItems: this.sections[i].items,
        sourceList: this.itemList,
        dialogTitle: 'Items in section',
        displayProperty: 'text',
        sectionIndex: i
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.sections[i].items = result.list;

    });
  }

  onDropSuccess(i, items) {
  }
}
