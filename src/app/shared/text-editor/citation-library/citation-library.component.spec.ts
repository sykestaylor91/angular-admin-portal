/* tslint:disable:no-unused-variable max-line-length */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TextEditorCitationLibraryComponent} from './citation-library.component';
// import {// NowceSharedModule}from '../../shared.module';
import {HttpClientModule} from '@angular/common/http';

describe('TextEditorCitationLibraryComponent', () => {
  let component: TextEditorCitationLibraryComponent;
  let fixture: ComponentFixture<TextEditorCitationLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        // NowceSharedModule,
        HttpClientModule
      ],
      declarations: [
        TextEditorCitationLibraryComponent
      ],
      providers: [
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextEditorCitationLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
