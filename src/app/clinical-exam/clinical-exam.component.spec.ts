import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicalExamComponent } from './clinical-exam.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {StationService} from '../shared/services/station.service';
import {AnswerFormatService} from '../shared/services/answer-format.service';
import {NotificationsService} from 'angular2-notifications';
import {instance, mock} from 'ts-mockito';
import {PermissionService} from '../shared/services/permission.service';
import {CircuitService} from '../shared/services/circuit.service';
import {Subject} from 'rxjs';


describe('ClinicalExamComponent', () => {
 let component: ClinicalExamComponent;
 let fixture: ComponentFixture<ClinicalExamComponent>;
 const params: Subject<Params> = new Subject();

  beforeEach(async(() => {
   TestBed.configureTestingModule({
     declarations: [ ClinicalExamComponent ],
     providers: [
       {provide: PermissionService, useValue: instance(mock(PermissionService))},
       {provide: CircuitService, useValue: instance(mock(CircuitService))},
       {provide: StationService, useValue: instance(mock(StationService))},
       {provide: AnswerFormatService, useValue: instance(mock(AnswerFormatService))},
       {provide: NotificationsService, useValue: instance(mock(NotificationsService))},
       {provide: ActivatedRoute, useValue: { params: params }},
       {provide: Router, useValue: { params: params }}
     ]
   })
   .compileComponents();
 }));

 beforeEach(() => {
   fixture = TestBed.createComponent(ClinicalExamComponent);
   component = fixture.componentInstance;
   fixture.detectChanges();
 });
 //
 // it('should create', () => {
 //   expect(component).toBeTruthy();
 // });
});
