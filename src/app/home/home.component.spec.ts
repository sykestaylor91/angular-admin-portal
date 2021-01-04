/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {HomeComponent} from './home.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SessionService} from '../shared/services/session.service';
import {SessionServiceStub} from '../shared/services/testing/session.service.stub';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        HomeComponent
      ],
      providers: [
        {provide: SessionService, useClass: SessionServiceStub}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Title should be Home', () => {
    expect(component.title).toEqual('Home');
  });

});
