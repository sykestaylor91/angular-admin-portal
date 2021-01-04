import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExamType} from '../../../shared/models/exam-type';
import {ChangeHistoryInputComponent} from '../../../shared/change-history-input/change-history-input.component';
import {assertRequired, assertVisible} from '../../../../../test-util';
import {TextEditorComponent} from '../../../shared/text-editor/text-editor.component';
import {CitationService} from '../../../shared/services/citation.service';
import {instance, mock} from 'ts-mockito';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import {QuillEditorComponent} from 'ngx-quill';
import {GeneralInformationComponent} from './general-information.component';
import {PermissionService} from '../../../shared/services/permission.service';
import {IntroductionComponent} from '../introduction/introduction.component';

describe('GeneralInformationComponent', () => {
 const css = {
   title: '#title',
   subtitle: '#subtitle',
   providerCourseId: '#providerCourseId',
   estimatedCompletionTime: '#estimatedCompletionTime',
   normalModeAllowed: 'mat-checkbox[formcontrolname=\'normalModeAllowed\']',
   studyModeAllowed: 'mat-checkbox[formcontrolname=\'studyModeAllowed\']',
   examModeAllowed: 'mat-checkbox[formcontrolname=\'examModeAllowed\']',
   welcomeMessage: 'app-text-editor[ng-reflect-name=\'welcomeMessage\']',
   disclosureOfCommercialSupport: 'app-text-editor[ng-reflect-name=\'disclosureOfCommercialSupport\']',
   plannedPublicationDate: '#plannedPublicationDate',
   plannedExpireDate: '#plannedExpireDate',
   targetAudience: '#targetAudience',
   disclaimer: 'app-text-editor[ng-reflect-name=\'disclaimer\']',
   reviewType: 'select[ng-reflect-name=\'reviewType\']'
 };

 beforeEach(async(() => {
   TestBed.configureTestingModule({
     imports: [FormsModule, ReactiveFormsModule, MatDialogModule, MatCheckboxModule],
     declarations: [GeneralInformationComponent, ChangeHistoryInputComponent, TextEditorComponent, QuillEditorComponent],
     providers: [
       {provide: CitationService, useValue: instance(mock(CitationService))},
       {provide: PermissionService, useValue: instance(mock(PermissionService))}
     ],
     schemas: [NO_ERRORS_SCHEMA]
   });
 }));

  it('should create', () => {
    const fixture = TestBed.createComponent(IntroductionComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

//  it('Should require correct items for Custom Activity', () => {
//    const fixture = getFixture(ExamType.Other);
//    assertVisible(fixture, ['title', 'subtitle', 'providerCourseId', 'estimatedCompletionTime', 'normalModeAllowed', 'studyModeAllowed', 'examModeAllowed', 'welcomeMessage', 'disclosureOfCommercialSupport', 'plannedPublicationDate', 'plannedExpireDate', 'targetAudience', 'disclaimer', 'reviewType'], css);
//    assertRequired(fixture, <any>['estimatedCompletionTime', 'title', 'disclosureOfCommercialSupport', 'welcomeMessage', 'plannedExpireDate'], css);
//  });
//
//  it('Should require correct items for non-accredited Learning Study / Self Assesment', () => {
//    const fixture = getFixture(ExamType.SelfAssessment);
//    assertVisible(fixture, ['title', 'subtitle', 'providerCourseId', 'estimatedCompletionTime', 'normalModeAllowed', 'studyModeAllowed', 'examModeAllowed', 'welcomeMessage', 'disclosureOfCommercialSupport', 'plannedPublicationDate', 'plannedExpireDate', 'targetAudience', 'disclaimer', 'reviewType'], css);
//    assertRequired(fixture, <any>['title', 'welcomeMessage', 'plannedExpireDate'], css);
//  });
//
//  it('Should require correct items for accredited Learning Study / Self Assesment', () => {
//    const fixture = getFixture(ExamType.SelfAssessment, true);
//    assertVisible(fixture, ['title', 'subtitle', 'providerCourseId', 'estimatedCompletionTime', 'normalModeAllowed', 'studyModeAllowed', 'examModeAllowed', 'welcomeMessage', 'disclosureOfCommercialSupport', 'plannedPublicationDate', 'plannedExpireDate', 'targetAudience', 'disclaimer', 'reviewType'], css);
//    assertRequired(fixture, <any>['estimatedCompletionTime', 'title', 'disclosureOfCommercialSupport', 'welcomeMessage', 'plannedExpireDate', 'providerCourseId', 'targetAudience'], css);
//  });
//
//  it('Should require correct items for Exam or Assessment', () => {
//    const fixture = getFixture(ExamType.ExamOrAssessment);
//    assertVisible(fixture, ['title', 'subtitle', 'providerCourseId', 'estimatedCompletionTime', 'normalModeAllowed', 'studyModeAllowed', 'examModeAllowed', 'welcomeMessage', 'disclosureOfCommercialSupport', 'plannedPublicationDate', 'plannedExpireDate', 'targetAudience', 'disclaimer', 'reviewType'], css);
//    assertRequired(fixture, <any>['estimatedCompletionTime', 'title', 'disclosureOfCommercialSupport', 'welcomeMessage', 'plannedExpireDate'], css);
//  });
//
//  it('Should require correct items for Revision or Refresher', () => {
//    const fixture = getFixture(ExamType.RevisionOrRefresher);
//    assertVisible(fixture, ['title', 'subtitle', 'providerCourseId', 'estimatedCompletionTime', 'welcomeMessage', 'disclosureOfCommercialSupport', 'plannedPublicationDate', 'plannedExpireDate', 'targetAudience', 'disclaimer', 'reviewType'], css);
//    assertRequired(fixture, <any>['title'], css);
//  });
//
//  it('Should require correct items for Survey', () => {
//    const fixture = getFixture(ExamType.Survey);
//    assertVisible(fixture, ['title', 'subtitle', 'providerCourseId', 'estimatedCompletionTime', 'welcomeMessage', 'disclosureOfCommercialSupport', 'plannedPublicationDate', 'plannedExpireDate', 'targetAudience', 'disclaimer', 'reviewType'], css);
//    assertRequired(fixture, <any>['title', 'plannedExpireDate'], css);
//  });
//
//  it('Should require correct items for Pre Activity', () => {
//    const fixture = getFixture(ExamType.PreActivity);
//    assertVisible(fixture, ['title', 'subtitle', 'providerCourseId', 'welcomeMessage', 'plannedPublicationDate', 'plannedExpireDate', 'targetAudience', 'disclaimer'], css);
//    assertRequired(fixture, <any>['title'], css);
//  });
//
//  it('Should require correct items for Post Activity', () => {
//    const fixture = getFixture(ExamType.PostActivity);
//    assertVisible(fixture, ['title', 'subtitle', 'providerCourseId', 'welcomeMessage', 'plannedPublicationDate', 'plannedExpireDate', 'targetAudience', 'disclaimer'], css);
//    assertRequired(fixture, <any>['title'], css);
//  });
//
//  function getFixture(type: ExamType, isAccredited: Boolean = false): ComponentFixture<GeneralInformationComponent> {
//    const fixture = TestBed.createComponent(GeneralInformationComponent);
//    const component = fixture.componentInstance;
//    component.selectedExam = <any>{type: encodeURIComponent(type)};
//    component.form = new FormGroup({
//      certificationFormGroup: new FormGroup({
//        accreditedCertificate: new FormControl(isAccredited),
//        accreditationType: new FormControl('A'),
//        accreditingBody: new FormControl('ACPE')
//      }, null, null)
//    }, null, null);
//    fixture.detectChanges();
//    return fixture;
//  }
});
