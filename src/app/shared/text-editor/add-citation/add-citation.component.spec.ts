/* tslint:disable:no-unused-variable max-line-length */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TextEditorAddCitationComponent} from './add-citation.component';
// import {// NowceSharedModule}from '../../shared.module';

describe('TextEditorAddCitationComponent', () => {
  let component: TextEditorAddCitationComponent;
  let fixture: ComponentFixture<TextEditorAddCitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        // // NowceSharedModule
      ],
      declarations: [
        TextEditorAddCitationComponent
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextEditorAddCitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
