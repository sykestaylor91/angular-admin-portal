import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExamType} from '../../../shared/models/exam-type';
import {ChangeHistoryInputComponent} from '../../../shared/change-history-input/change-history-input.component';
import {assertRequired, assertVisible} from '../../../../../test-util';
import {DesignationsComponent} from './designations.component';
import {PermissionService} from '../../../shared/services/permission.service';
import {instance, mock} from 'ts-mockito';
import {MaterialModule} from '../../../shared/material.module';

describe('DesignationsComponent', () => {
  const permissionMock = mock(PermissionService);
  const css = {
    tokens: '#tokens',
    price: '#price',
    publishDisclosures: 'mat-radio-group[ng-reflect-name=\'publishDisclosures\']',
    designation: '#designation',
    mocStatement: '#mocStatement',
    passRate: '#passRate',
    levelOfDifficulty: '#levelOfDifficulty',
    otherOption: 'option[value=\'other\']',
    maxAnswerAttempts: '#maxAnswerAttempts',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MaterialModule],
      declarations: [DesignationsComponent, ChangeHistoryInputComponent],
      providers: [{provide: PermissionService, useValue: instance(permissionMock)}],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  it('Tokens should match price, unless tokens is changed manually', () => {
    const fixture = getFixture(ExamType.Other);
    fixture.componentInstance.designationFormGroup.get('price').patchValue('3');
    expect(fixture.componentInstance.designationFormGroup.get('tokens').value).toEqual('3');
    fixture.componentInstance.designationFormGroup.get('tokens').patchValue('4');
    fixture.componentInstance.designationFormGroup.get('price').patchValue('5');
    expect(fixture.componentInstance.designationFormGroup.get('tokens').value).toEqual('4');
    fixture.componentInstance.designationFormGroup.get('tokens').patchValue('5');
    fixture.componentInstance.designationFormGroup.get('price').patchValue('15');
    expect(fixture.componentInstance.designationFormGroup.get('tokens').value).toEqual('15');
  });

 it('Should require correct items for Custom Activity', () => {
   const fixture = getFixture(ExamType.Other);
   assertVisible(fixture, ['tokens', 'price', 'publishDisclosures', 'designation', 'mocStatement', 'passRate', 'levelOfDifficulty', 'otherOption', 'maxAnswerAttempts'], css);
   assertRequired(fixture, ['publishDisclosures', 'passRate', 'maxAnswerAttempts'], css);
 });

 it('Should require correct items for non-accredited Learning Study / Self Assessment', () => {
   const fixture = getFixture(ExamType.SelfAssessment);
   assertVisible(fixture, ['tokens', 'price', 'publishDisclosures', 'designation', 'mocStatement', 'passRate', 'levelOfDifficulty', 'otherOption', 'maxAnswerAttempts'], css);
   assertRequired(fixture, ['publishDisclosures', 'passRate', 'maxAnswerAttempts'], css);
 });

  it('Should require correct items for accredited Learning Study / Self Assesment', () => {
    const fixture = getFixture(ExamType.SelfAssessment, true);
    assertVisible(fixture, ['tokens', 'price', 'publishDisclosures', 'designation', 'mocStatement', 'passRate', 'levelOfDifficulty', 'otherOption', 'maxAnswerAttempts'], css);
    assertRequired(fixture, ['publishDisclosures', 'passRate', 'designation', 'otherOption', 'maxAnswerAttempts'], css);
    expect(fixture.componentInstance.designationFormGroup.get('publishDisclosures').value).toEqual(true);
  });

  it('Should require correct items for Exam or Assessment', () => {
    const fixture = getFixture(ExamType.ExamOrAssessment);
    assertVisible(fixture, [ 'publishDisclosures', 'designation', 'mocStatement', 'passRate', 'levelOfDifficulty', 'otherOption', 'maxAnswerAttempts'], css);
    assertRequired(fixture, ['publishDisclosures', 'designation', 'otherOption'], css);
  });

  it('Should require correct items for Revision or Refresher', () => {
    const fixture = getFixture(ExamType.RevisionOrRefresher);
    assertVisible(fixture, ['tokens', 'price', 'mocStatement', 'levelOfDifficulty', 'maxAnswerAttempts'], css);
    assertRequired(fixture, <any>[], css);
  });

  it('Should require correct items for Pre Activity', () => {
    const fixture = getFixture(ExamType.PreActivity);
    assertVisible(fixture, <any>[], css);
    assertRequired(fixture, <any>[], css);
  });

  it('Should require correct items for Post Activity', () => {
    const fixture = getFixture(ExamType.PostActivity);
    assertVisible(fixture, <any>[], css);
    assertRequired(fixture, <any>[], css);
  });

  function getFixture(type: ExamType, isAccredited: Boolean = false): ComponentFixture<DesignationsComponent> {
    const fixture = TestBed.createComponent(DesignationsComponent);
    const component = fixture.componentInstance;
    component.selectedExam = <any>{type: encodeURIComponent(type)};
    component.form = new FormGroup({
      certificationFormGroup: new FormGroup({
        accreditedCertificate: new FormControl(isAccredited),
        accreditationType: new FormControl('A'),
        accreditingBody: new FormControl('random')
      }, null, null)
    }, null, null);
    fixture.detectChanges();
    return fixture;
  }
});
