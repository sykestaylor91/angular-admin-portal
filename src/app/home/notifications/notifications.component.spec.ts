import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {NotificationsComponent} from './notifications.component';
import {SessionService} from '../../shared/services/session.service';
import {instance, mock, when} from 'ts-mockito';
import {InvitationService} from '../../shared/services/invitation.service';
import {ProviderMessageService} from '../../shared/services/provider-message.service';
import {SessionServiceStub} from '../../shared/services/testing/session.service.stub';
import {of} from 'rxjs';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  const providerMessageMock = mock(ProviderMessageService);

  beforeEach(async(() => {
    when(providerMessageMock.query()).thenReturn(of(<any>[]));
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        NotificationsComponent
      ],
      providers: [
        {provide: SessionService, useClass: SessionServiceStub},
        {provide: InvitationService, useValue: instance(mock(InvitationService))},
        {provide: ProviderMessageService, useValue: instance(providerMessageMock)},
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
