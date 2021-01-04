import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {instance, mock} from 'ts-mockito';
import { StationListComponent } from './station-list.component';
import {NotificationsService} from 'angular2-notifications';
import {StationService} from '../../shared/services/station.service';
import { Router} from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {Subject} from 'rxjs';

describe('StationListComponent', () => {
 let component: StationListComponent;
 let fixture: ComponentFixture<StationListComponent>;
  const query = function() { return  new Subject(); };

 beforeEach(async(() => {
   TestBed.configureTestingModule({
     declarations: [ StationListComponent ],
     providers: [
       {provide: NotificationsService, useValue: instance(mock(NotificationsService))},
       {provide: StationService, useValue: { query: query }},
       {provide: MatDialogRef, useValue: instance(mock(MatDialogRef))},
       {provide: MatDialog, useValue: instance(mock(MatDialog))},
       {provide: Router, useValue: instance(mock(Router))}
       ]
   })
   .compileComponents();
 }));

 beforeEach(() => {
   fixture = TestBed.createComponent(StationListComponent);
   component = fixture.componentInstance;
   fixture.detectChanges();
 });

 it('should create', () => {
   expect(component).toBeTruthy();
 });
});
