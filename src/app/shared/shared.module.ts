import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageHelpComponent} from './page-help/page-help.component';
import {TextEditorComponent} from './text-editor/text-editor.component';
import {TextEditorDialogComponent} from './text-editor/text-editor-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ShowHtmlPipe} from './pipes/show-html.pipe';
import {SharedSelectMediaComponent} from './upload-insert-media/shared-select-media/shared-select-media.component';
import {ChangeHistoryInputComponent} from './change-history-input/change-history-input.component';
import {ChangeHistoryTexteditorComponent} from './change-history-texteditor/change-history-texteditor.component';
import {CommentChangeHistoryComponent} from './comment-change-history/comment-change-history.component';
import {DialogCommentComponent} from './comment-change-history/dialog-comment/dialog-comment.component';
import {DialogChangeHistoryComponent} from './comment-change-history/dialog-change-history/dialog-change-history.component';
import {TextEditorEmbedVideoComponent} from './text-editor/embed-video/embed-video.component';
import {TextEditorInsertSymbolComponent} from './text-editor/insert-symbol/insert-symbol.component';
import {TextEditorAddCitationComponent} from './text-editor/add-citation/add-citation.component';
import {TextEditorCitationLibraryComponent} from './text-editor/citation-library/citation-library.component';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {FilterListComponent} from './filter-list/filter-list.component';
import {RolePipe} from './pipes/role.pipe';
import {FirstNWordsPipe} from './pipes/first-n-words.pipe';
import {StripTagsPipe} from './pipes/strip-tags.pipe';
import {UserExamStatusPipe} from './pipes/user-exam-status.pipe';
import {BasketComponent} from './basket/basket.component';
import {PreActivityInformationComponent} from './pre-activity-information/pre-activity-information.component';
import {FirstNCharsPipe} from './pipes/first-n-chars.pipe';
import {UploadInsertMediaComponent} from './upload-insert-media/upload-insert-media.component';
import {MaterialModule} from './material.module';
import {ActivityStatusPipe} from './pipes/activity-status.pipe';
import {CheckMarkPipe} from './pipes/check-mark.pipe';
import {BlankPipe} from './pipes/blank.pipe';
import {SafeHtmlPipe} from './pipes/safe-html.pipe';
import {SafeUrlPipe} from './pipes/safe-url.pipe';
import {TimerPipe} from './pipes/timer.pipe';
import {UploadInsertMediaDialogComponent} from './upload-insert-media/upload-insert-media-dialog.component';
import {SharedUploadMediaComponent} from './upload-insert-media/shared-upload-media/shared-upload-media.component';
import {PreActivityInformationContentComponent} from './pre-activity-information/pre-activity-information-content.component';
import {PermissionCheckDirective} from './directives/permission-check.directive';
import {CustomFormsModule} from 'ng2-validation';
import {FocusDirective} from './directives/focus.directive';
import {DialogHeaderComponent} from './dialog/dialog-header/dialog-header.component';
import {GridTableComponent} from './grid-table/grid-table.component';
import {DialogActionsComponent} from './dialog/dialog-actions/dialog-actions.component';
import {DialogEditorComponent} from './dialog/dialog-editor/dialog-editor.component';
import {DialogIframeComponent} from './dialog/dialog-iframe/dialog-iframe.component';
import {DialogPdfComponent} from './dialog/dialog-pdf/dialog-pdf.component';
import {SecurityDialogComponent} from './security-dialog/security-dialog.component';
import {CalculatorComponent} from './calculator/calculator.component';

import {ChatComponent} from './chat/chat.component';
import {NowceDataListComponent} from './nowce-data-list/nowce-data-list.component';
import {DndModule} from 'ng2-dnd';
import {SortableModule} from 'ngx-bootstrap';
import {TableModule} from 'primeng/table';
import {DebounceDirective} from './directives/debounce.directive';
import {RouterModule} from '@angular/router';
import {QuillModule} from 'ngx-quill';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {DataViewModule} from 'primeng/dataview';
import {PanelModule} from 'primeng/panel';

import { AvatarModule } from 'ngx-avatar';


@NgModule({
  imports: [
    CommonModule,
    CustomFormsModule,
    DataViewModule,
    QuillModule.forRoot(),
    FormsModule,
    MaterialModule,
    PanelModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    DndModule,
    SortableModule,
    TableModule,
    PdfViewerModule,
    AvatarModule
  ],
  declarations: [
    ActivityStatusPipe,
    BasketComponent,
    CalculatorComponent,
    CheckMarkPipe,
    BlankPipe,
    DebounceDirective,
    DialogActionsComponent,
    DialogEditorComponent,
    DialogHeaderComponent,
    DialogIframeComponent,
    SecurityDialogComponent,
    UserExamStatusPipe,
    FilterListComponent,
    NowceDataListComponent,
    FirstNCharsPipe,
    FirstNWordsPipe,
    FocusDirective,
    FocusDirective,
    GridTableComponent,
    LoadingSpinnerComponent,
    PageHelpComponent,
    PermissionCheckDirective,
    ChangeHistoryInputComponent,
    ChangeHistoryTexteditorComponent,
    CommentChangeHistoryComponent,
    DialogCommentComponent,
    DialogChangeHistoryComponent,
    PreActivityInformationComponent,
    PreActivityInformationContentComponent,
    RolePipe,
    SafeHtmlPipe,
    SafeUrlPipe,
    SharedSelectMediaComponent,
    SharedUploadMediaComponent,
    ShowHtmlPipe,
    StripTagsPipe,
    TextEditorAddCitationComponent,
    TextEditorCitationLibraryComponent,
    TextEditorComponent,
    TextEditorDialogComponent,
    TextEditorEmbedVideoComponent,
    TextEditorInsertSymbolComponent,
    TimerPipe,
    UploadInsertMediaComponent,
    UploadInsertMediaDialogComponent,
    DialogEditorComponent,
    DialogIframeComponent,
    DialogPdfComponent,
    SecurityDialogComponent,
    ChatComponent,
  ],
  exports: [
    ActivityStatusPipe,
    DialogActionsComponent,
    BasketComponent,
    CalculatorComponent,
    CheckMarkPipe,
    BlankPipe,
    CommonModule,
    DebounceDirective,
    DialogHeaderComponent,
    UserExamStatusPipe,
    FilterListComponent,
    NowceDataListComponent,
    FirstNCharsPipe,
    FirstNWordsPipe,
    FocusDirective,
    GridTableComponent,
    LoadingSpinnerComponent,
    PageHelpComponent,
    PermissionCheckDirective,
    ChangeHistoryInputComponent,
    ChangeHistoryTexteditorComponent,
    CommentChangeHistoryComponent,
    DialogCommentComponent,
    DialogChangeHistoryComponent,
    PreActivityInformationComponent,
    PreActivityInformationContentComponent,
    RolePipe,
    SafeHtmlPipe,
    SafeUrlPipe,
    SharedUploadMediaComponent,
    ShowHtmlPipe,
    StripTagsPipe,
    TextEditorAddCitationComponent,
    TextEditorCitationLibraryComponent,
    TextEditorComponent,
    TextEditorDialogComponent,
    TextEditorEmbedVideoComponent,
    TextEditorInsertSymbolComponent,
    TimerPipe,
    UploadInsertMediaComponent,
    ChatComponent,
  ],
  entryComponents: [
    CalculatorComponent,
    DialogActionsComponent,
    DialogEditorComponent,
    DialogIframeComponent,
    DialogPdfComponent,
    SecurityDialogComponent,
    PreActivityInformationContentComponent,
    TextEditorDialogComponent,
    UploadInsertMediaDialogComponent,
    DialogCommentComponent,
    DialogChangeHistoryComponent
  ]
})
export class SharedModule {
}
