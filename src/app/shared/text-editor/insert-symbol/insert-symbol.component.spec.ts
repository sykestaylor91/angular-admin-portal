/* tslint:disable:no-unused-variable max-line-length */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TextEditorInsertSymbolComponent} from './insert-symbol.component';
// import {// NowceSharedModule}from '../../shared.module';
import {HttpClientModule} from '@angular/common/http';

describe('TextEditorInsertSymbolComponent', () => {
  let component: TextEditorInsertSymbolComponent;
  let fixture: ComponentFixture<TextEditorInsertSymbolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        // NowceSharedModule,
        HttpClientModule
      ],
      declarations: [
        TextEditorInsertSymbolComponent
      ],
      providers: [
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextEditorInsertSymbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
