import { async, ComponentFixture, TestBed, } from '@angular/core/testing';
import { InjectionToken } from '@angular/core';
import { StationFormComponent } from './station-form.component';
import {instance, mock} from 'ts-mockito';
import {PermissionService} from '../../shared/services/permission.service';
import {ItemService} from '../../shared/services/item.service';
import {StationService} from '../../shared/services/station.service';
import {FormBuilder} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Params} from '@angular/router';
import {Subject} from 'rxjs';

describe('StationFormComponent', () => {
  let component: StationFormComponent;
  let fixture: ComponentFixture<StationFormComponent>;
  let params: Subject<Params>;

  beforeEach(async(() => {
    params = new Subject<Params>();
    TestBed.configureTestingModule({
      declarations: [ StationFormComponent ],
      providers: [
        {provide: PermissionService, useValue: instance(mock(PermissionService))},
        {provide: ItemService, useValue: instance(mock(ItemService))},
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
    fixture = TestBed.createComponent(StationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
