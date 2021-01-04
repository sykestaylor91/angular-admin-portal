import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExamType} from '../../../shared/models/exam-type';
import {ChangeHistoryInputComponent} from '../../../shared/change-history-input/change-history-input.component';
import {assertRequired, assertVisible} from '../../../../../test-util';
import {CitationService} from '../../../shared/services/citation.service';
import {instance, mock} from 'ts-mockito';
import {CertificationComponent} from './certification.component';
import {CertificateTypeSelectorComponent} from './certificate-type-selector/certificate-type-selector.component';
import {PermissionService} from '../../../shared/services/permission.service';
import {MaterialModule} from '../../../shared/material.module';

describe('CertificationComponent', () => {
  const css = {
    certificate: 'app-certificate-type-selector[ng-reflect-name=\'certificate\']',
    accreditedCertificate: 'app-certificate-type-selector[ng-reflect-name=\'accreditedCertificate\']',
    providerCertificate: 'app-certificate-type-selector[ng-reflect-name=\'providerCertificate\']',
    accreditingBody: 'select[ng-reflect-name=\'accreditingBody\']',
    accreditationType: 'mat-radio-group[ng-reflect-name=\'accreditationType\']',
    accreditingOrganizationName: '#accreditingOrganizationName',
    coProvider: '#coProvider',
    creditType: 'select[ng-reflect-name=\'creditType\']',
    otherCreditType: '#otherCreditType',
    learningFormat: 'select[ng-reflect-name=\'learningFormat\']',
    otherLearningFormat: '#otherLearningFormat',
    numberOfCredits: '#numberOfCredits',
    lastCreditAwardedDate: '#lastCreditAwardedDate',
    providerNumber: '#providerNumber'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MaterialModule],
      declarations: [CertificationComponent, ChangeHistoryInputComponent, CertificateTypeSelectorComponent],
      providers: [
        {provide: CitationService, useValue: instance(mock(CitationService))},
        {provide: PermissionService, useValue: instance(mock(PermissionService))}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  // it('Should require correct items for Custom Activity', () => {
  //   const fixture = getFixture(ExamType.Other);
  //   assertVisible(fixture, ['certificate'], css);
  //   fixture.componentInstance.certificationFormGroup.get('certificate').patchValue(true);
  //   assertVisible(fixture, ['certificate', 'accreditedCertificate', 'providerCertificate', 'providerNumber'], css);
  //   fixture.componentInstance.certificationFormGroup.get('accreditedCertificate').patchValue(true);
  //   assertVisible(fixture, ['certificate', 'accreditedCertificate', 'providerCertificate', 'accreditingBody', 'accreditationType', 'creditType', 'numberOfCredits', 'lastCreditAwardedDate', 'learningFormat', 'coProvider', 'providerNumber'], css);
  //   assertRequired(fixture, <any>['accreditationType', 'creditType', 'numberOfCredits', 'lastCreditAwardedDate', 'learningFormat'], css);
  // });

  // it('Should require correct items for non-accredited Learning Study / Self Assesment', () => {
  //   const fixture = getFixture(ExamType.SelfAssessment);
  //   assertVisible(fixture, ['certificate'], css);
  //   fixture.componentInstance.certificationFormGroup.get('certificate').patchValue(true);
  //   assertVisible(fixture, ['certificate', 'accreditedCertificate', 'providerCertificate', 'providerNumber'], css);
  //   fixture.componentInstance.certificationFormGroup.get('accreditedCertificate').patchValue(false);
  //   fixture.componentInstance.certificationFormGroup.get('providerCertificate').patchValue(true);
  //   assertVisible(fixture, ['certificate', 'accreditedCertificate', 'providerCertificate', 'accreditingBody', 'otherLearningFormat', 'providerNumber', 'coProvider'], css);
  //   fixture.componentInstance.certificationFormGroup.get('accreditingBody').patchValue('ACCME');
  //   assertVisible(fixture, ['certificate', 'accreditedCertificate', 'providerCertificate', 'accreditingBody', 'accreditationType', 'creditType', 'numberOfCredits', 'lastCreditAwardedDate', 'learningFormat', 'coProvider', 'providerNumber'], css);
  //   assertRequired(fixture, <any>['accreditationType', 'creditType', 'numberOfCredits', 'lastCreditAwardedDate', 'learningFormat'], css);
  // });

  // it('Should require correct items for accredited Learning Study / Self Assesment', () => {
  //   const fixture = getFixture(ExamType.SelfAssessment, true);
  //   assertVisible(fixture, ['certificate'], css);
  //   fixture.componentInstance.certificationFormGroup.get('certificate').patchValue(true);
  //   assertVisible(fixture, ['certificate', 'accreditedCertificate', 'providerCertificate', 'providerNumber'], css);
  //   fixture.componentInstance.certificationFormGroup.get('accreditedCertificate').patchValue(true);
  //   assertVisible(fixture, ['certificate', 'accreditedCertificate', 'providerCertificate', 'accreditingBody', 'accreditationType', 'creditType', 'numberOfCredits', 'lastCreditAwardedDate', 'learningFormat', 'coProvider', 'providerNumber'], css);
  //   assertRequired(fixture, <any>['accreditationType', 'creditType', 'numberOfCredits', 'lastCreditAwardedDate', 'learningFormat'], css);
  // });

  // it('Should require correct items for Exam or Assessment', () => {
  //   const fixture = getFixture(ExamType.ExamOrAssessment);
  //   assertVisible(fixture, <any>[], css);
  //   assertRequired(fixture, <any>[], css);
  // });

  it('Should require correct items for Revision or Refresher', () => {
    const fixture = getFixture(ExamType.RevisionOrRefresher);
    assertVisible(fixture, [], css);
    fixture.componentInstance.certificationFormGroup.get('certificate').patchValue(true);
    assertVisible(fixture, [ ], css);
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

  function getFixture(type: ExamType, isAccredited: Boolean = false): ComponentFixture<CertificationComponent> {
    const fixture = TestBed.createComponent(CertificationComponent);
    const component = fixture.componentInstance;
    component.selectedExam = <any>{type: encodeURIComponent(type)};
    component.form = new FormGroup({
      certificationFormGroup: new FormGroup({
        accreditedCertificate: new FormControl(isAccredited)
        , accreditingBody: new FormControl('random')
      }, null, null)
    }, null, null);
    fixture.detectChanges();
    return fixture;
  }
});
