import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangeHistoryInputComponent} from './change-history-input.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {instance, mock} from 'ts-mockito';
import {PermissionService} from '../services/permission.service';
import { MatDialog } from '@angular/material/dialog';

describe('ChangeHistoryInputComponent', () => {
  const permissionMock = mock(PermissionService);
  let component: ChangeHistoryInputComponent;
  let fixture: ComponentFixture<ChangeHistoryInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeHistoryInputComponent],
      providers: [
        {provide: PermissionService, useValue: instance(permissionMock)},
        {provide: MatDialog, useValue: instance(mock(MatDialog))}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeHistoryInputComponent);
    component = fixture.componentInstance;
    component.resourceElement = 'test';
    component.selectedResource = <any>{test: ''};
    component.formGroup = new FormGroup({test: new FormControl('')}, null, null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
