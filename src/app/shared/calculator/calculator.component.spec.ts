import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {instance, mock} from 'ts-mockito';
import { CalculatorComponent } from './calculator.component';
import {PermissionService} from '../services/permission.service';
import {NotificationsService} from 'angular2-notifications';
import {EventTrackingService} from '../services/event-tracking.service';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatorComponent ],
      providers: [
        {provide: NotificationsService, useValue: instance(mock(NotificationsService))},
        {provide: EventTrackingService, useValue: instance(mock(EventTrackingService))}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
