import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTableComponent } from './grid-table.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CheckMarkPipe} from '../pipes/check-mark.pipe';
import {FirstNCharsPipe} from '../pipes/first-n-chars.pipe';

describe('GridTableComponent', () => {
  let component: GridTableComponent;
  let fixture: ComponentFixture<GridTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridTableComponent, CheckMarkPipe, FirstNCharsPipe ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTableComponent);
    component = fixture.componentInstance;
    component.config = <any>{};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
