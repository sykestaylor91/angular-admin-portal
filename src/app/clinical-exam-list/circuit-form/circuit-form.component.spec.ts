import { async, ComponentFixture, TestBed, } from '@angular/core/testing';
import { InjectionToken } from '@angular/core';
import { CircuitFormComponent } from './circuit-form.component';
import {instance, mock} from 'ts-mockito';
import {PermissionService} from '../../shared/services/permission.service';
import {CircuitService} from '../../shared/services/circuit.service';
import {StationService} from '../../shared/services/station.service';
import {FormBuilder} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Params} from '@angular/router';
import {Subject} from 'rxjs';

describe('CircuitFormComponent', () => {
 let component: CircuitFormComponent;
 let fixture: ComponentFixture<CircuitFormComponent>;
 let params: Subject<Params>;

 beforeEach(async(() => {
   params = new Subject<Params>();
   TestBed.configureTestingModule({
     declarations: [ CircuitFormComponent ],
     providers: [
       {provide: PermissionService, useValue: instance(mock(PermissionService))},
       {provide: CircuitService, useValue: instance(mock(CircuitService))},
       {provide: StationService, useValue: instance(mock(StationService))},
       {provide: FormBuilder, useValue: instance(mock(FormBuilder))},
       {provide: MatDialogRef, useValue: instance(mock(MatDialogRef))},
       {provide: MatDialog, useValue: instance(mock(MatDialog))},
       {provide: ActivatedRoute, useValue: { params: params }},
       {provide: MAT_DIALOG_DATA, useValue: instance(mock(InjectionToken))},
       {provide: NotificationsService, useValue: instance(mock(NotificationsService))}
     ]
   })
   .compileComponents();
 }));

 beforeEach(() => {
   fixture = TestBed.createComponent(CircuitFormComponent);
   component = fixture.componentInstance;
   fixture.detectChanges();
 });

 it('should create', () => {
   expect(component).toBeTruthy();
 });
});
