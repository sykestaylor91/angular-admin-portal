import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclosureEditComponent } from './disclosure-edit.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {UserService} from '../../../../shared/services/user.service';
import {instance, mock} from 'ts-mockito';
import {DialogService} from '../../../../shared/services/dialog.service';
import {DisclosureService} from '../../../../shared/services/disclosure.service';
import {DisclosureEditService} from '../../disclosure-edit.service';

describe('DisclosureEditComponent', () => {
  let component: DisclosureEditComponent;
  let fixture: ComponentFixture<DisclosureEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclosureEditComponent ],
      providers: [
        {provide: UserService, useValue: instance(mock(UserService))},
        {provide: DialogService, useValue: instance(mock(DialogService))},
        {provide: DisclosureService, useValue: instance(mock(DisclosureService))},
        {provide: DisclosureEditService, useValue: instance(mock(DisclosureEditService))}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclosureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
