import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NowceDataListComponent } from './nowce-data-list.component';

describe('NowceDataListComponent', () => {
  let component: NowceDataListComponent;
  let fixture: ComponentFixture<NowceDataListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NowceDataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NowceDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
