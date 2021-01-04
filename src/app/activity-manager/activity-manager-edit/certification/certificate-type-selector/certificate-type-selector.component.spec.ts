import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateTypeSelectorComponent } from './certificate-type-selector.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('CertificateTypeSelectorComponent', () => {
  let component: CertificateTypeSelectorComponent;
  let fixture: ComponentFixture<CertificateTypeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateTypeSelectorComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
