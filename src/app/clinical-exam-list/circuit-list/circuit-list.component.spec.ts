import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {instance, mock} from 'ts-mockito';
import { CircuitListComponent } from './circuit-list.component';
import {NotificationsService} from 'angular2-notifications';
import {CircuitService} from '../../shared/services/circuit.service';
import { Router} from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {Subject} from 'rxjs';

describe('CircuitListComponent', () => {
 let component: CircuitListComponent;
 let fixture: ComponentFixture<CircuitListComponent>;
  const data: Subject<any> = new Subject();
  const query = function() { return  new Subject(); };

 beforeEach(async(() => {
   TestBed.configureTestingModule({
     declarations: [ CircuitListComponent ],
     providers: [
       {provide: NotificationsService, useValue: instance(mock(NotificationsService))},
       {provide: CircuitService, useValue: { query: query }},
       {provide: MatDialogRef, useValue: instance(mock(MatDialogRef))},
       {provide: MatDialog, useValue: instance(mock(MatDialog))},
       {provide: Router, useValue: instance(mock(Router))}
     ]
   })
   .compileComponents();
 }));

 beforeEach(() => {
   fixture = TestBed.createComponent(CircuitListComponent);
   component = fixture.componentInstance;
   fixture.detectChanges();
 });

 it('should create', () => {
   expect(component).toBeTruthy();
 });
});
