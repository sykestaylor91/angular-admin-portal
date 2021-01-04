import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {NavSubMenuComponent} from './nav-sub-menu.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('NavSubMenuComponent', () => {
  let component: NavSubMenuComponent;
  let fixture: ComponentFixture<NavSubMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        NavSubMenuComponent
      ],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(NavSubMenuComponent);
    component = fixture.componentInstance;
    component.route = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
