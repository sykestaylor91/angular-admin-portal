import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {NavMenuLinkComponent} from './nav-menu-link.component';

describe('NavMenuLinkComponent', () => {
  let component: NavMenuLinkComponent;
  let fixture: ComponentFixture<NavMenuLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        NavMenuLinkComponent
      ],
      providers: [
      ]
    });
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuLinkComponent);
    component = fixture.componentInstance;
    component.route = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
