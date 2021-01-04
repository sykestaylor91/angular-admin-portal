// /* tslint:disable:no-unused-variable */
// import {TestBed} from '@angular/core/testing';
// import {HttpClientModule} from '@angular/common/http';
// import {MediaService} from '../services/media.service';
// import {CitationService} from '../services/citation.service';
// import {CourseManagerService} from '../../course-manager/course-manager.service';
// import {TextEditorComponent} from './text-editor.component';
// import {
//   MockMediaService,
//   MockCitationsService,
//   MockCourseManagerService
// } from '../services/testing';
//
//
// describe('TextEditorComponent', () => {
//
//   let fixture;
//   let component: any;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientModule
//       ],
//       declarations: [TextEditorComponent],
//       providers: [
//         {provide: MediaService, useClass: MockMediaService},
//         {provide: CitationService, useClass: MockCitationsService},
//         {provide: CourseManagerService, useClass: MockCourseManagerService}
//       ]
//     });
//
//     fixture = TestBed.overrideComponent(TextEditorComponent, {
//       set: {
//         template: '<span>Override component</span>'
//       }})
//       .createComponent(TextEditorComponent);
//       component = fixture.componentInstance;
//
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//
//   it('should Show / hide source', () => {
//     component.viewSource = true;
//     component.toolbarViewSourceClickHandler();
//     expect(component.viewSource).toEqual(false);
//     component.viewSource = false;
//     component.toolbarViewSourceClickHandler();
//     expect(component.viewSource).toEqual(true);
//   });
//
// });
