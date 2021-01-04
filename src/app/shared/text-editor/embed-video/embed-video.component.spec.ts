/* tslint:disable:no-unused-variable max-line-length */

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TextEditorEmbedVideoComponent} from './embed-video.component';
// import {// NowceSharedModule}from '../../shared.module';
import {HttpClientModule} from '@angular/common/http';

describe('TextEditorEmbedVideoComponent', () => {
  let component: TextEditorEmbedVideoComponent;
  let fixture: ComponentFixture<TextEditorEmbedVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        // NowceSharedModule,
        HttpClientModule
      ],
      declarations: [
        TextEditorEmbedVideoComponent
      ],
      providers: [
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextEditorEmbedVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
