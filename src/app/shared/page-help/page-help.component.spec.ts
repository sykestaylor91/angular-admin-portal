import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PageHelpComponent} from './page-help.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HelpService} from '../services/help.service';
import {instance, mock} from 'ts-mockito';

describe('PageHelpComponent', () => {
  let component: PageHelpComponent;
  let fixture: ComponentFixture<PageHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [PageHelpComponent],
      providers: [
        { provide: HelpService, useValue: instance(mock(HelpService)) }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
