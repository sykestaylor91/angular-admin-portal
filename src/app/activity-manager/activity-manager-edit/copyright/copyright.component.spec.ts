import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {CopyrightComponent} from './copyright.component';
import {ExamService} from '../../../shared/services/exam.service';
import {instance, mock, when} from 'ts-mockito';
import {EvaluationService} from '../../../shared/services/evaluation.service';
import {ExamType} from '../../../shared/models/exam-type';
import {ChangeHistoryInputComponent} from '../../../shared/change-history-input/change-history-input.component';
import {assertRequired, assertVisible} from '../../../../../test-util';
import {PermissionService} from '../../../shared/services/permission.service';
import { MatDialogModule } from '@angular/material/dialog';
import {of} from 'rxjs';
//
// describe('CopyrightComponent', () => {
//  const examMock = mock(ExamService);
//  const evaluationMock = mock(EvaluationService);
//  const permissionMock = mock(PermissionService);
//  const css = {
//    copyright: '[formcontrolname=\'copyright\']',
//    republicationRequest: '#republicationRequest',
//    otherInformation: '[formcontrolname=\'otherInformation\']',
//    postActivityEvaluation: '[formcontrolname=\'postActivityEvaluation\']',
//    readerSupport: '#readerSupport',
//    followOnActivity: '[formcontrolname=\'followOnActivity\']'
//  };
//
//  beforeEach(async(() => {
//    when(examMock.getExamsMetaBy()).thenReturn(of([]));
//    when(evaluationMock.getAllEvaluationsMetaData()).thenReturn(of([]));
//    TestBed.configureTestingModule({
//      imports: [MatDialogModule],
//      declarations: [ CopyrightComponent, ChangeHistoryInputComponent ],
//      providers: [
//        {provide: ExamService, useValue: instance(examMock)},
//        {provide: PermissionService, useValue: instance(permissionMock)},
//        {provide: EvaluationService, useValue: instance(evaluationMock)},
//      ],
//      schemas: [ NO_ERRORS_SCHEMA ]
//    });
//  }));
//
//  it('Should require correct items for Custom Activity', () => {
//    const fixture = getFixture(ExamType.Other);
//    assertVisible(fixture, ['copyright', 'republicationRequest', 'otherInformation', 'postActivityEvaluation', 'readerSupport', 'followOnActivity'], css);
//    assertRequired(fixture, ['copyright', 'readerSupport'], css);
//  });
//
//  it('Should require correct items for non-accredited Learning Study / Self Assesment', () => {
//    const fixture = getFixture(ExamType.SelfAssessment);
//    assertVisible(fixture, ['copyright', 'republicationRequest', 'otherInformation', 'postActivityEvaluation', 'readerSupport', 'followOnActivity'], css);
//    assertRequired(fixture, ['copyright', 'readerSupport'], css);
//  });
//
//  it('Should require correct items for accredited Learning Study / Self Assesment', () => {
//    const fixture = getFixture(ExamType.SelfAssessment, true);
//    assertVisible(fixture, ['copyright', 'republicationRequest', 'otherInformation', 'postActivityEvaluation', 'readerSupport', 'followOnActivity'], css);
//    assertRequired(fixture, ['copyright', 'republicationRequest', 'readerSupport', 'postActivityEvaluation'], css);
//  });
//
//  it('Should require correct items for Exam or Assessment', () => {
//    const fixture = getFixture(ExamType.ExamOrAssessment);
//    assertVisible(fixture, ['copyright', 'republicationRequest', 'otherInformation', 'postActivityEvaluation', 'readerSupport', 'followOnActivity'], css);
//    assertRequired(fixture, ['copyright', 'readerSupport'], css);
//  });
//
//  it('Should require correct items for Revision or Refresher', () => {
//    const fixture = getFixture(ExamType.RevisionOrRefresher);
//    assertVisible(fixture, ['copyright', 'republicationRequest', 'otherInformation', 'postActivityEvaluation', 'readerSupport', 'followOnActivity'], css);
//    assertRequired(fixture, [], css);
//  });
//
//  it('Should require correct items for Survey', () => {
//    const fixture = getFixture(ExamType.Survey);
//    assertVisible(fixture, ['copyright', 'otherInformation', 'postActivityEvaluation', 'followOnActivity'], css);
//    assertRequired(fixture, <any>[], css);
//  });
//
//  it('Should require correct items for Pre Activity', () => {
//    const fixture = getFixture(ExamType.PreActivity);
//    assertVisible(fixture, ['copyright', 'followOnActivity'], css);
//    assertRequired(fixture, ['followOnActivity'], css);
//  });
//
//  it('Should require correct items for Post Activity', () => {
//    const fixture = getFixture(ExamType.PostActivity);
//    assertVisible(fixture, ['copyright', 'postActivityEvaluation'], css);
//    assertRequired(fixture, <any>[], css);
//  });
//
//  function getFixture(type: ExamType, isAccredited: Boolean = false): ComponentFixture<CopyrightComponent> {
//    const fixture = TestBed.createComponent(CopyrightComponent);
//    const component = fixture.componentInstance;
//    component.selectedExam = <any>{type: encodeURIComponent(type)};
//    component.form = new FormGroup({
//      certificationFormGroup:  new FormGroup({
//        accreditedCertificate: new FormControl(isAccredited)
//      }, null, null)
//    }, null, null);
//    fixture.detectChanges();
//    return fixture;
//  }
// });
