import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExamType} from '../../../shared/models/exam-type';
import {ChangeHistoryInputComponent} from '../../../shared/change-history-input/change-history-input.component';
import {assertRequired, assertVisible} from '../../../../../test-util';
import {LearningMaterialComponent} from './learning-material.component';
import {TextEditorComponent} from '../../../shared/text-editor/text-editor.component';
import {CitationService} from '../../../shared/services/citation.service';
import {instance, mock} from 'ts-mockito';
import { MatDialogModule } from '@angular/material/dialog';
import {QuillEditorComponent} from 'ngx-quill';
import {PermissionService} from '../../../shared/services/permission.service';
import {IntroductionComponent} from '../introduction/introduction.component';
//
describe('LearningMaterialComponent', () => {
 const permissionMock = mock(PermissionService);
 const css = {
   heading: '[formcontrolname=\'heading\']',
   loe: '[formcontrolname=\'loe\']',
   text: 'app-text-editor[ng-reflect-name=\'text\']'
 };

 beforeEach(async(() => {
   TestBed.configureTestingModule({
     imports: [FormsModule, ReactiveFormsModule, MatDialogModule],
     declarations: [LearningMaterialComponent, ChangeHistoryInputComponent, TextEditorComponent, QuillEditorComponent],
     providers: [
       {provide: CitationService, useValue: instance(mock(CitationService))},
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
 //   assertVisible(fixture, ['heading', 'loe', 'text'], css);
 //   assertRequired(fixture, <any>[], css);
 // });

 // it('Should require correct items for non-accredited Learning Study / Self Assesment', () => {
 //   const fixture = getFixture(ExamType.SelfAssessment);
 //   assertVisible(fixture, ['heading', 'loe', 'text'], css);
 //   assertRequired(fixture, <any>[], css);
 // });
 //
 // it('Should require correct items for accredited Learning Study / Self Assesment', () => {
 //   const fixture = getFixture(ExamType.SelfAssessment, true);
 //   assertVisible(fixture, ['heading', 'loe', 'text'], css);
 //   assertRequired(fixture, <any>['heading', 'loe', 'text'], css);
 // });

 it('Should require correct items for Exam or Assessment', () => {
   const fixture = getFixture(ExamType.ExamOrAssessment);
   assertVisible(fixture, <any>[], css);
   assertRequired(fixture, <any>[], css);
 });

 // it('Should require correct items for Revision or Refresher', () => {
 //   const fixture = getFixture(ExamType.RevisionOrRefresher);
 //   assertVisible(fixture, ['heading', 'loe', 'text'], css);
 //   assertRequired(fixture, <any>[], css);
 // });

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

 function getFixture(type: ExamType, isAccredited: Boolean = false): ComponentFixture<LearningMaterialComponent> {
   const fixture = TestBed.createComponent(LearningMaterialComponent);
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
