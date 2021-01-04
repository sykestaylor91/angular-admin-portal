import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ExamType} from '../../../shared/models/exam-type';
import {ChangeHistoryTexteditorComponent} from '../../../shared/change-history-texteditor/change-history-texteditor.component';
import {assertRequired, assertVisible} from '../../../../../test-util';
import {IntroductionComponent} from './introduction.component';
import {instance, mock} from 'ts-mockito';
import {PermissionService} from '../../../shared/services/permission.service';
import { MatDialogModule } from '@angular/material/dialog';

describe('IntroductionComponent', () => {
 const permissionMock = mock(PermissionService);
 const css = {
   needs: '[formcontrolname=\'needs\']',
   educationObjectives: '[formcontrolname=\'educationObjectives\']',
   introduction: '[formcontrolname=\'introduction\']'
 };

 beforeEach(async(() => {
   TestBed.configureTestingModule({
     imports: [MatDialogModule],
     declarations: [IntroductionComponent, ChangeHistoryTexteditorComponent],
     providers: [
       {provide: PermissionService, useValue: instance(permissionMock)}
     ],
     schemas: [NO_ERRORS_SCHEMA]
   });
 }));

  it('should create', () => {
    const fixture = TestBed.createComponent(IntroductionComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

 // it('Should require correct items for Custom Activity', () => {
 //   const fixture = getFixture(ExamType.Other);
 //   assertVisible(fixture, ['needs', 'educationObjectives'], css);
 //   assertRequired(fixture, ['needs', 'educationObjectives'], css);
 // });
 //
 // it('Should require correct items for non-accredited Learning Study / Self Assesment', () => {
 //   const fixture = getFixture(ExamType.SelfAssessment);
 //   assertVisible(fixture, ['needs', 'educationObjectives', 'introduction'], css);
 //   assertRequired(fixture, ['needs', 'educationObjectives'], css);
 // });
 //
 // it('Should require correct items for accredited Learning Study / Self Assesment', () => {
 //   const fixture = getFixture(ExamType.SelfAssessment, true);
 //   assertVisible(fixture, ['needs', 'educationObjectives', 'introduction'], css);
 //   assertRequired(fixture, ['needs', 'educationObjectives'], css);
 // });
 //
 // it('Should require correct items for Exam or Assessment', () => {
 //   const fixture = getFixture(ExamType.ExamOrAssessment);
 //   assertVisible(fixture, ['needs', 'educationObjectives', 'introduction'], css);
 //   assertRequired(fixture, <any>[], css);
 // });
 //
 // it('Should require correct items for Revision or Refresher', () => {
 //   const fixture = getFixture(ExamType.RevisionOrRefresher);
 //   assertVisible(fixture, ['needs', 'educationObjectives', 'introduction'], css);
 //   assertRequired(fixture, <any>[], css);
 // });
 //
 // it('Should require correct items for Pre Activity', () => {
 //   const fixture = getFixture(ExamType.PreActivity);
 //   assertVisible(fixture, ['introduction'], css);
 //   assertRequired(fixture, <any>[], css);
 // });
 //
 // it('Should require correct items for Post Activity', () => {
 //   const fixture = getFixture(ExamType.PostActivity);
 //   assertVisible(fixture, ['introduction'], css);
 //   assertRequired(fixture, <any>[], css);
 // });

 function getFixture(type: ExamType, isAccredited: Boolean = false): ComponentFixture<IntroductionComponent> {
   const fixture = TestBed.createComponent(IntroductionComponent);
   const component = fixture.componentInstance;
   component.selectedExam = <any>{type: encodeURIComponent(type)};
   component.form = new FormGroup({
     certificationFormGroup: new FormGroup({
       accreditedCertificate: new FormControl(isAccredited)
     }, null, null)
   }, null, null);
   fixture.detectChanges();
   return fixture;
 }
});
