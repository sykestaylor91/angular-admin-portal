import { async, ComponentFixture, TestBed, TestComponentRenderer} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {anyString, instance, mock, when} from 'ts-mockito';
import {ExamType} from '../../../shared/models/exam-type';
import {ChangeHistoryInputComponent} from '../../../shared/change-history-input/change-history-input.component';
import {assertRequired, assertVisible} from '../../../../../test-util';
import {PermissionService} from '../../../shared/services/permission.service';
import {CourseQuestionsComponent} from './course-questions.component';
import {QuestionService} from '../../../shared/services/question.service';
import {Question} from '../../../shared/models/question';
import {FirstNCharsPipe} from '../../../shared/pipes/first-n-chars.pipe';
import { MatDialog } from '@angular/material/dialog';
import {  MatMenuModule } from '@angular/material/menu';
import {of} from 'rxjs';
import {Router} from '@angular/router';

describe('CourseQuestionsComponent', () => {
  const questionMock = mock(QuestionService);
  const permissionMock = mock(PermissionService);
  const css = {
    revealAnswers: '#revealAnswers',
    rightOption: '#revealAnswers option[value=\'right\']',
    wrongOption: '#revealAnswers option[value=\'right\']',
    completeOption: '#revealAnswers option[value=\'complete\']',
    neverOption: '#revealAnswers option[value=\'never\']',
    studyOption: '#revealAnswers option[value=\'study\']'
  };

  beforeEach(async(() => {
    when(questionMock.findById(anyString())).thenReturn(of(new Question()));
    TestBed.configureTestingModule({
      imports: [MatMenuModule],
      declarations: [ CourseQuestionsComponent, ChangeHistoryInputComponent, FirstNCharsPipe],
      providers: [
        {provide: QuestionService, useValue: instance(questionMock)},
        {provide: PermissionService, useValue: instance(permissionMock)},
        {provide: MatDialog, useValue: instance(mock(MatDialog))},
        {provide: Router, useValue: instance(mock(Router))},
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  it('Should require correct items for Custom Activity', () => {
    const fixture = getFixture(ExamType.Other);
    assertVisible(fixture, ['revealAnswers', 'rightOption', 'wrongOption', 'completeOption', 'neverOption', 'studyOption'], css);
    assertRequired(fixture, [], css);
  });

  it('Should require correct items for Learning Study / Self Assesment', () => {
    const fixture = getFixture(ExamType.SelfAssessment);
    assertVisible(fixture, ['revealAnswers', 'rightOption', 'wrongOption', 'completeOption', 'neverOption', 'studyOption'], css);
    assertRequired(fixture, [], css);
  });

  it('Should require correct items for Exam or Assessment', () => {
    const fixture = getFixture(ExamType.ExamOrAssessment);
    assertVisible(fixture, [], css);
    assertRequired(fixture, [], css);
  });

  it('Should require correct items for Revision or Refresher', () => {
    const fixture = getFixture(ExamType.RevisionOrRefresher);
    assertVisible(fixture, ['revealAnswers', 'rightOption', 'wrongOption', 'completeOption'], css);
    assertRequired(fixture, [], css);
  });

  it('Should require correct items for Pre Activity', () => {
    const fixture = getFixture(ExamType.PreActivity);
    assertVisible(fixture, [], css);
    assertRequired(fixture, <any>[], css);
  });

  it('Should require correct items for Post Activity', () => {
    const fixture = getFixture(ExamType.PostActivity);
    assertVisible(fixture, [], css);
    assertRequired(fixture, <any>[], css);
  });

  function getFixture(type: ExamType, isAccredited: Boolean = false): ComponentFixture<CourseQuestionsComponent> {
    const fixture = TestBed.createComponent(CourseQuestionsComponent);
    const component = fixture.componentInstance;
    component.selectedExam = <any>{type: encodeURIComponent(type)};
    component.form = new FormGroup({
      certificationFormGroup:  new FormGroup({
        accreditedCertificate: new FormControl(isAccredited)
      }, null, null)
    }, null, null);
    fixture.detectChanges();
    return fixture;
  }
});
