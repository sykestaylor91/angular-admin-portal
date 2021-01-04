import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {instance, mock} from 'ts-mockito';
import { EvaluationParentListComponent } from './evaluation-parent-list.component';
import {ExamService} from '../../../shared/services/exam.service';

describe('EvaluationParentListComponent', () => {
  let component: EvaluationParentListComponent;
  let fixture: ComponentFixture<EvaluationParentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationParentListComponent,
        {provide: ExamService, useValue: instance(mock(ExamService))},
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationParentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
