import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {RouterTestingModule} from '@angular/router/testing';
import {instance, mock} from 'ts-mockito';
import {HttpClientModule} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SessionService} from './shared/services/session.service';
import { ConnectionService } from 'ng-connection-service';
import { OfflineService } from './shared/services/offline.service';
import { MatDialog } from '@angular/material/dialog';
import DialogConfig from './shared/models/dialog-config';
import {PermissionCheckDirective} from './shared/directives/permission-check.directive';
import { MatDialogModule } from '@angular/material/dialog';
import {PermissionService} from './shared/services/permission.service';
import {CircuitService} from './shared/services/circuit.service';
import {StationService} from './shared/services/station.service';


describe('AppComponent: AdminPortal', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        RouterTestingModule,
        HttpClientModule,
        MatDialogModule
      ],
      declarations: [
        AppComponent, PermissionCheckDirective
      ],
      providers: [
        {provide: PermissionService, useValue: instance(mock(PermissionService))},
        {provide: CircuitService, useValue: instance(mock(CircuitService))},
        {provide: StationService, useValue: instance(mock(StationService))},
        {provide: DialogConfig, useValue: instance(mock(DialogConfig))},
        {provide: SessionService, useValue: instance(mock(SessionService))},
        {provide: MatDialog, useValue: instance(mock(MatDialog))},
        {provide: ConnectionService, useValue: instance(mock(ConnectionService))},
        {provide: OfflineService, useValue: instance(mock(OfflineService))}
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    // expect(app).toBeTruthy();
  }));
});
