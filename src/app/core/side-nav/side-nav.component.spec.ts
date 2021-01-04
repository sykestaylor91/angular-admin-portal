import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {SideNavComponent} from './side-nav.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ProviderOrgService} from '../../shared/services/provider-org.service';
import {instance, mock} from 'ts-mockito';
import {SessionService} from '../../shared/services/session.service';
import {SessionServiceStub} from '../../shared/services/testing/session.service.stub';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;
  const providerOrgMock = mock(ProviderOrgService);

  beforeEach(async(() => {
    const providerOrgInst = instance(providerOrgMock);
    providerOrgInst.provider = <any>{logo: ''};
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        SideNavComponent
      ],
      providers: [
        {provide: ProviderOrgService, useValue: providerOrgInst},
        {provide: SessionService, useClass: SessionServiceStub}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
