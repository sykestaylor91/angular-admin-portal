import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditorComponent } from './dialog-editor.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {instance, mock} from 'ts-mockito';

describe('DialogEditorComponent', () => {
  let component: DialogEditorComponent;
  let fixture: ComponentFixture<DialogEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditorComponent ],
      providers: [
        {provide: MatDialogRef, useValue: instance(mock(MatDialogRef))},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
