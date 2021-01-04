import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClinicalAnalysisComponent} from './clinical-analysis.component';

describe('ClinicalAnalysisComponent', () => {
  let component: ClinicalAnalysisComponent;
  let fixture: ComponentFixture<ClinicalAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClinicalAnalysisComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
