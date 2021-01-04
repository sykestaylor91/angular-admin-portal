import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityManagerTemplateHeaderComponent } from './activity-manager-template-header.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

describe('ActivityManagerTemplateHeaderComponent', () => {
  let component: ActivityManagerTemplateHeaderComponent;
  let fixture: ComponentFixture<ActivityManagerTemplateHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ ActivityManagerTemplateHeaderComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityManagerTemplateHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
