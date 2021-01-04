import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SimpleRegistrationComponent} from './simple-registration.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import * as Chance from 'chance';
import {instance, mock} from 'ts-mockito';
import {PermissionService} from '../shared/services/permission.service';
import {UserService} from '../shared/services/user.service';
import {NotificationsService} from 'angular2-notifications';

import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';


describe('SimpleRegistrationComponent', () => {
  const permissionMock = mock(PermissionService);
  const userMock = mock(UserService);
  const notificationsMock = mock(NotificationsService);
  const routerMock = mock(Router);
  const activatedRouteMock = mock(ActivatedRoute  );
  const chance: any = new Chance();
  let component: SimpleRegistrationComponent;
  let fixture: ComponentFixture<SimpleRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        SimpleRegistrationComponent
      ],
      providers: [
        {provide: PermissionService, useValue: instance(permissionMock)},
        {provide: UserService, useValue: instance(userMock) },
        {provide: NotificationsService, useValue: instance(notificationsMock) },
        {provide: Router, useValue: instance(routerMock) },
        {provide: ActivatedRoute, useValue: instance(activatedRouteMock) }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default with a bad form state', () => {
    expect(component.isValid).toBeFalsy();
    expect(component.isControlValid('firstName')).toBeFalsy();

    component.form.controls['firstName'].patchValue(chance.name());
    expect(component.isControlValid('firstName')).toBeTruthy();

  });

  it('should be a valid form with all fields entered', () => {

  //  expect(component.isValid).toBeFalsy();
/*
    component.form.controls['organization'].patchValue(chance.name());
    component.form.controls['activity'].patchValue(chance.name());
    component.form.controls['firstName'].patchValue(chance.name());
    component.form.controls['familyName'].patchValue(chance.name());
    component.form.controls['email'].patchValue(chance.email());
    component.form.controls['phone'].patchValue(chance.phone());

    component.form.controls['password'].patchValue('Matt1234!');
    component.form.controls['confirmPassword'].patchValue('Matt1234!');
*/
    // expect(component.isControlValid('organization')).toBeTruthy();
    // expect(component.isControlValid('activity')).toBeTruthy();
    // expect(component.isControlValid('firstName')).toBeTruthy();
    // expect(component.isControlValid('familyName')).toBeTruthy();
    // expect(component.isControlValid('email')).toBeTruthy();
    // expect(component.isControlValid('phone')).toBeTruthy();

    // expect(component.isValid).toBeTruthy();
  });

  // it('invalid email should not be valid', () => {
    // expect(component.isControlValid('email')).toBeFalsy();
    // component.form.controls['email'].patchValue(chance.name);
    // expect(component.isControlValid('email')).toBeFalsy();
  // });
});
