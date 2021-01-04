import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialQuestionFormComponent } from './serial-question-form.component';

describe('SerialQuestionFormComponent', () => {
  let component: SerialQuestionFormComponent;
  let fixture: ComponentFixture<SerialQuestionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialQuestionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
