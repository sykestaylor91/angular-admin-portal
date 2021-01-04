import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {NO_ERRORS_SCHEMA} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {times, random, some} from 'lodash';
import {By} from '@angular/platform-browser';
import {PreActivityInformationContentComponent} from './pre-activity-information-content.component';
import {SafeHtmlPipe} from '../pipes/safe-html.pipe';
import {anyString, instance, mock, when} from 'ts-mockito';
import {RolePipe} from '../pipes/role.pipe';
import {DisclosureService} from '../services/disclosure.service';
import {UserService} from '../services/user.service';
import {MediaService} from '../services/media.service';
import {CitationService} from '../services/citation.service';
import {ProviderOrgService} from '../services/provider-org.service';
import {CredentialService} from '../services/credential.service';
import {User} from '../models/user';
import {of} from 'rxjs';

describe('PreActivityInformationContentComponent', () => {
  const providerService = instance(mock(ProviderOrgService));
  const userServiceMock = mock(UserService);
  const citationServiceMock = mock(CitationService);
  const mediaServiceMock = mock(MediaService);

  const fullDataSet = {
    'id': '147ca237644645eaac7480e9e7c2aca0',
    'dateCreated': '2018-05-29T02:12:51.831Z',
    'lastUpdated': '2018-05-29T02:12:51.831Z',
    'version': 0,
    'userId': '9fed44cc988e4a659dfeaf8500340fff',
    'title': 'title' + randStr(),
    'subtitle': 'subtitle' + randStr(),
    'type': 'Learning%20based%20self-assessment',
    'questions': ['28809008cc0a4e1288dc83bc299d1e05', 'ede9104cf8c246d283f4a0ef245daca3', '71845d277ed54df0b3ca09cf6825310e', '15131e3dfecc456d8fde255d8a8d950d', 'c490b963d57d4dcc8f5f5575e781e4bd'],
    'status': 'draft',
    'reviewerNotes': [],
    'providerCourseId': 'abc123',
    'universalActivityNumber': 'def456',
    'welcomeMessage': '<p>welcomeMessage' + randStr() + '</p>',
    'disclosureOfCommercialSupport': '<p>disclosureOfCommercialSupport' + randStr() + '</p>',
    'plannedPublicationDate': '2018-05-30',
    'plannedExpireDate': '2018-05-31',
    'estimatedCompletionTime': random(120).toString(10),
    'courseImage': '84f9c15c31c14a419e4707f8219fac02',
    'disclaimer': '<p>disclaimer' + randStr() + '</p>',
    'normalMode': true,
    'studyMode': true,
    'examMode': null,
    'targetAudience': 'targetAudience' + randStr(),
    'followOnActivity': 'b2c8132fca4340ebb42f306f8a2c39a7',
    'certificate': true,
    'accreditingBody': 'ACPE',
    'accreditedCertificate': true,
    'providerCertificate': true,
    'accreditationType': 'Q',
    'coProvider': 'coProvider' + randStr(),
    'creditType': 'practice-CPE-activity',
    'numberOfCredits': random(10).toString(10),
    'lastCreditAwardedDate': '2018-06-30',
    'learningFormat': 'homeLive',
    'tokens': random(120).toString(10),
    'price': random(120).toString(10),
    'publishDisclosures': 'true',
    'designation': 'ce_cme_moc',
    'mocStatement': 'mocStatement' + randStr(),
    'passRate': random(100).toString(10),
    'levelOfDifficulty': 'levelOfDifficulty' + randStr(),
    'includeStatementOfVerification': false,
    'introduction': '<p>introduction' + randStr() + '</p>',
    'educationObjectives': '<p>educationObjectives' + randStr() + '</p>',
    'learningMaterial': [{
      'heading': 'heading' + randStr(),
      'loe': 'loe' + randStr(),
      'text': '<p>text' + randStr() + '</p>'
    }],
    'copyright': '<p>copyright' + randStr() + '</p>',
    'republicationRequest': 'republicationRequest' + randStr(),
    'otherInformation': '<p>otherInformation' + randStr() + '</p>',
    'readerSupport': 'readerSupport' + randStr(),
    'authorNotes': [],
    'citations': [],
    'comments': {},
    'needs': '<p>needs' + randStr() + '</p>',
    'changeHistory': {},
    'disclosures': [],
    'authors': [],
    'reviewType': 'open',
    'withdrawnDate': null
  };

  beforeEach(async(() => {
    when(userServiceMock.findById(anyString())).thenCall((args) => of(<User>{id: args[0], username: randStr(), firstName: randStr(), lastName: randStr()}));
    when(citationServiceMock.queryByExam(anyString())).thenReturn(of([]));
    when(mediaServiceMock.findById(anyString())).thenReturn(<any>of({}));
    providerService.provider = {
      name: randStr(),
      fullAddress: randStr()
    };
    TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ PreActivityInformationContentComponent, SafeHtmlPipe, RolePipe ],
      providers: [
        {provide: DisclosureService, useValue: instance(mock(DisclosureService)) },
        {provide: UserService, useValue: instance(userServiceMock) },
        {provide: CitationService, useValue: instance(citationServiceMock) },
        {provide: ProviderOrgService, useValue: providerService },
        {provide: CredentialService, useValue: instance(mock(CredentialService)) },
        {provide: MatDialogRef, useValue: instance(mock(MatDialogRef)) },
        {provide: MAT_DIALOG_DATA, useValue: {content: fullDataSet}},
        {provide: MediaService, useValue: instance(mediaServiceMock) }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  it('Should require correct items', () => {
    const fixture = getFixture();
    assertMainTitle([fullDataSet.title + ', ' + fullDataSet.subtitle], fixture);
    assertSectionTitles(['Publisher statement', 'Disclosures'], fixture);
    assertText([fullDataSet.providerCourseId, fullDataSet.universalActivityNumber, (Number(fullDataSet.estimatedCompletionTime) % 60) + ' mins',
      fullDataSet.disclosureOfCommercialSupport, /*Expire Date*/'May 31, 2018', fullDataSet.targetAudience, fullDataSet.disclaimer,
      fullDataSet.numberOfCredits + ' Practice Based CPE Activity', /*lastCreditsAwarded*/'June 30, 2018', /*Learning Format*/'Home & Live',
      fullDataSet.price, fullDataSet.disclosureOfCommercialSupport, fullDataSet.accreditingBody, fullDataSet.passRate + '%',
      fullDataSet.levelOfDifficulty, fullDataSet.copyright, fullDataSet.republicationRequest, fullDataSet.readerSupport,
      fullDataSet.otherInformation], fixture);
  });

  function getFixture(): ComponentFixture<PreActivityInformationContentComponent> {
    const fixture = TestBed.createComponent(PreActivityInformationContentComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return fixture;
  }

  function assertMainTitle<T>(text: string[], fixture: ComponentFixture<T>) {
    const fdBodyElements = fixture.debugElement.queryAll(By.css('.course-title'));
    text.forEach(t => {
      expect(some(fdBodyElements.map(e => {
        const div = document.createElement('h1');
        div.innerHTML = t;
        const resolvedText = div.textContent || div.innerText || '';
        return e.nativeElement.textContent.indexOf(t) > -1 || e.nativeElement.textContent.indexOf(resolvedText) > -1;
      }))).toBeTruthy('Expected to find text ' + t);
    });
  }

  function assertSectionTitles<T>(text: string[], fixture: ComponentFixture<T>) {
    const fdBodyElements = fixture.debugElement.queryAll(By.css('.fd-section-title'));
    text.forEach(t => {
      expect(some(fdBodyElements.map(e => {
        const div = document.createElement('div');
        div.innerHTML = t;
        const resolvedText = div.textContent || div.innerText || '';
        return e.nativeElement.textContent.indexOf(t) > -1 || e.nativeElement.textContent.indexOf(resolvedText) > -1;
      }))).toBeTruthy('Expected to find text ' + t);
    });
  }

  function assertText<T>(text: string[], fixture: ComponentFixture<T>) {
    const fdBodyElements = fixture.debugElement.queryAll(By.css('.fd-body'));
    text.forEach(t => {
      expect(some(fdBodyElements.map(e => {
        const div = document.createElement('div');
        div.innerHTML = t;
        const resolvedText = div.textContent || div.innerText || '';
        return e.nativeElement.textContent.indexOf(t) > -1 || e.nativeElement.textContent.indexOf(resolvedText) > -1;
      }))).toBeTruthy('Expected to find text ' + t);
    });
  }

  function randStr(length: number = 10): string {
    return times(length, () => random(35).toString(36)).join('');
  }


});
