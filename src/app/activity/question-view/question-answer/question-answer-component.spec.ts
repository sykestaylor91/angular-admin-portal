import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionAnswerComponent } from './question-answer.component';
import {RouterTestingModule} from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import {instance, mock} from 'ts-mockito';


describe('QuestionAnswerComponent', () => {
  let component: QuestionAnswerComponent;
  let fixture: ComponentFixture<QuestionAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ QuestionAnswerComponent ],
      providers: [
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
