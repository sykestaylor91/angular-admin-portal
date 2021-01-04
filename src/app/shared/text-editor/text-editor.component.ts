import {
  ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, NgZone, OnInit, Output,
  ViewChild
} from '@angular/core';
import {AbstractControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {TextEditorDialogComponent} from './text-editor-dialog.component';
import {MediaType} from '../models/media-type';
import {InputType} from '../models/input-type';
import {Citation} from '../models/citation';
import DialogConfig from '../models/dialog-config';
import {DialogActionsComponent} from '../dialog/dialog-actions/dialog-actions.component';
import {ActionType} from '../models/action-type';
import {CitationService} from '../services/citation.service';
import Utilities from '../utilities';
import {CustomAccessorHandlerDirective} from '../helpers/custom-accessor.handler.directive';
import {QuillEditorComponent} from 'ngx-quill';
import {CitationBlot} from './citation-blot';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
import VideoResize from 'quill-video-resize-module';
import {Media} from '../models/media';

Quill.register('blots/inline', CitationBlot);
Quill.register('modules/imageResize', ImageResize);

Quill.register('modules/videoResize', VideoResize);

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    }
  ]
})
export class TextEditorComponent extends CustomAccessorHandlerDirective implements OnInit {
  @HostBinding('class.full-screen') isFullScreen: boolean = false;

  @Input() resourceElement: string;
  @Input() selectedResource: any;
  @Input() inputType: InputType = InputType.Text;
  @Input() min: number = 1;
  @Input() max: number = Number.MAX_SAFE_INTEGER;
  @Input() step: number = 1;
  @Input() maxLength: number = -1;
  @Input() label: string;
  @Input() fieldName: string;
  @Input() units: string = '';
  @Input() tooltip: string;
  @Input() cssClass: string = '';
  @Input() placeholder: string;
  @Input() formGroup: AbstractControl;
  @Input() showCommentChangeHistory: boolean = true;
  @Input() originalValue: string;
  @Input() hideIfDisabled: boolean = false;
  @Input() formControlName: string;
  @Input() errorLabel: string;
  // editor
  @Input() showVideo: boolean = false;
  @Input() showPdf: boolean = false;
  @Input() showAudio: boolean = false;
  @Input() showCitation: boolean = false;
  @Input() showImage: boolean = false;
  @Input() showMedia: boolean = false;
  @Input() showSource: boolean = false;
  @Input() showFullScreen: boolean = false;
  @Input() startFullScreen: boolean = false;
  @Input() setFocus: boolean = false;
  @Input() hint: string;
  @Input() showToolbar: boolean = false;

  @Output() closeFullScreenDialog: EventEmitter<any> = new EventEmitter();

  @ViewChild(QuillEditorComponent) private qEditor: QuillEditorComponent;

  MediaType = MediaType;

  citation: string;
  data: any;
  sourceCode: string;
  showSpinner: boolean = false;
  currentValue: string;
  private hasFormGroup: boolean = false;
  private currentControl: AbstractControl | null;
  private required: boolean = null;
  showHint: boolean = false;
  showFocused: boolean = false;
  InputType = InputType;

  private txtArea: any;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private citationService: CitationService,
              private dialog: MatDialog,
              private zone: NgZone) {
    super();
  }

  setFocused() {
    this.showFocused = true;
  }

  setBlurred() {
    this.showFocused = false;
  }


  ngOnInit() {
    if (this.startFullScreen) {
      this.isFullScreen = !this.isFullScreen;
    }
    // this.initializeEditor();
  }

  editorCreated(quill) {
    // this.qEditor = quill;
    if (this.setFocus) {
      this.qEditor.quillEditor.focus();
    }

    this.txtArea = document.createElement('textarea');
    this.txtArea.className = 'text-area-source';
    this.txtArea.style.display = 'none';
    const htmlEditor = this.qEditor.quillEditor.addContainer('ql-custom');
    htmlEditor.appendChild(this.txtArea);

    const nativeTooltipShow = quill.theme.tooltip.show;

    quill.theme.tooltip.show = () => {
      const linkRange = quill.theme.tooltip['linkRange'];
      const start = linkRange.index;
      const length = linkRange.length;
      const tooltip = quill.getContents(start, length);

      const link = tooltip.ops[0].attributes.link;
      const citationIdx = link.indexOf('/citation/');

      if (citationIdx > -1) {
        const citationId = link.substring(citationIdx + 10);
        this.openCitationDialog(citationId);
      } else {
        nativeTooltipShow.call(quill.theme.tooltip);
      }
    };
  }

  get isRequiredCustom(): boolean {
    if (this.isRequired) {
      return this.isRequired;
    }

    let tempRequired: boolean;
    if (this.currentControl && this.currentControl.validator && this.currentControl.validator({} as AbstractControl)) {
      tempRequired = this.currentControl.validator({} as AbstractControl).required;
    } else {
      tempRequired = false;
    }

    if (tempRequired !== this.required) {
      this.required = tempRequired;
     // this.changeDetectorRef.detectChanges();
    }

    return this.required;
  }

  get hasErrorCustom(): boolean {
    if (this.hasError) {
      return this.hasError;
    }

    if (this.currentControl && this.currentControl.enabled) {
      return !this.currentControl.valid;
    }
    return false;
  }

  get isHiddenCustom(): boolean {
    if (!this.hideIfDisabled) {
      return this.isHidden;
    }

    return this.isHidden || (this.currentControl && this.currentControl.disabled);
  }

  get optionalMaxLength(): number | undefined {
    if (this.maxLength > -1) {
      return this.maxLength;
    }
    if (this.inputType === InputType.Number) {
      return (this.max + '').length;
    }
    return undefined;
  }

  getOriginalValue() {
    return this.originalValue || this.selectedResource[this.resourceElement] || '';
  }

  onUpdateValue(value: string | number | null): void {
    this.qEditor.writeValue(value);
    console.log('***** UPDATE VALUE');
    this.propagateChange(value);
  }

  onUseThisVersionClicked(value: string): void {
    this.writeValue(value);
    this.onUpdateValue(value);
  }

  // initializeEditor() {
  //   this.qEditor.onEditorCreated.subscribe(editor => {
  //     if (this.setFocus) {
  //       this.qEditor.quillEditor.focus();
  //     }
  //
  //     this.txtArea = document.createElement('textarea');
  //     this.txtArea.className = 'text-area-source';
  //     this.txtArea.style.display = 'none';
  //     const htmlEditor = this.qEditor.quillEditor.addContainer('ql-custom');
  //     htmlEditor.appendChild(this.txtArea);
  //
  //     const nativeTooltipShow = editor.theme.tooltip.show;
  //
  //     editor.theme.tooltip.show = () => {
  //       const linkRange = editor.theme.tooltip['linkRange'];
  //       const start = linkRange.index;
  //       const length = linkRange.length;
  //       const tooltip = editor.getContents(start, length);
  //
  //       const link = tooltip.ops[0].attributes.link;
  //       const citationIdx = link.indexOf('/citation/');
  //
  //       if (citationIdx > -1) {
  //         const citationId = link.substring(citationIdx + 10);
  //         this.openCitationDialog(citationId);
  //       } else {
  //         nativeTooltipShow.call(editor.theme.tooltip);
  //       }
  //     };
  //   });
  // }

  async openCitationDialog(citationId: string) {
    let citation: Citation = null;

    await this.citationService.find(citationId)
      .toPromise()
      .then(c => citation = c);

    if (citation) {
      this.zone.run(() => {
        const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
          {
            title: `Citation`,
            content: citation.text,
            actions: [ActionType.Close],
            trustHtml: true
          }
        ));
        ref.componentInstance.dialogResult.subscribe(() => {
          ref.close();
        });
      });
    }
  }

  writeValue(value: any) {
    if (!value) {
      value = '';
    }

    super.writeValue(value);
  }

  onEditorChange(value) {
    console.log('onEditorChange: ', value);
    this.propagateChange(value);
  }

  openDialog(type: MediaType): void {
    const dialogRef = this.dialog.open(TextEditorDialogComponent, DialogConfig.textEditorDialogConfig({
      type,
      citations: this.selectedResource ? this.selectedResource.citations || [] : []
    }));
    dialogRef.afterClosed().subscribe(result => {
      this.handleDialogResponse(result, type);
    });
    dialogRef.afterClosed().subscribe(() => this.qEditor.quillEditor.focus());
  }

  handleDialogResponse(response, type: MediaType) {
    if (type && response) {
      switch (type) {
        case MediaType.Image:
          const imgElement = `<figure><img src="${response.thumbnail}" title="${response.title}" /><figcaption>${response.caption}</figcaption></figure>`;
          this.insertHtml(imgElement);
          break;
        case MediaType.Audio:
          const audioElement = `<iframe src="assets/audio-player.html?src=${response.thumbnail}&title=${response.title}" width="100" height="50"/>`;
          this.insertHtml(audioElement);
          break;
        case MediaType.Pdf:
          const pdfElement = `<a href="${response.thumbnail}" target="_blank"><img src="assets/images/file-pdf-solid.png"/> ${response.title}</a>`;
          this.insertHtml(pdfElement);
          break;
        case MediaType.Symbols:
          this.insertHtml(response);
          break;
        case MediaType.EmbedVideo:
        case MediaType.Video:
          const mediaElement = `<iframe src="assets/media-player.html?src=${response.thumbnail}&title=${response.title}" />`;
          this.insertHtml(mediaElement);
          break;
        case MediaType.Citation:
          this.insertCitation(response);
          break;
        default:
          this.insertText(response);
      }
      this.propagateChange(this.qEditor.quillEditor.root.innerHTML);
    }
  }

  insertCitation(citation: Citation) {
    if (citation) {
      const citationIdx = this.selectedResource.citations.findIndex(cid => cid === citation.id);
      let citationText = citationIdx + '';
      if (citationIdx === -1) {
        this.selectedResource.citations.push(citation.id);
        citationText = Utilities.getTextFromHtml(citation.text).substring(0, 10);
        if (citationText.length === 10) {
          citationText = citationText.substring(0, 7) + '...';
        }
        citationText = 'Temp: ' + citationText;
      }

      const insertedCitation = `<span>&nbsp;<a href="/citation/${citation.id}"><citation>${citationText}</citation></a>&nbsp;</span>`;
      this.insertHtml(insertedCitation);
    }
  }

  embedMedia(media: Media, type: MediaType = MediaType.Video) {
    if (media) {
      this.qEditor.quillEditor.insertEmbed(this.editorCursorIndex, type, media.uri || media.thumbnail, 'user');
    }
  }

  insertHtml(html) {
    if (html) {
      this.qEditor.quillEditor.clipboard.dangerouslyPasteHTML(this.editorCursorIndex, html);
    }
  }

  insertText(media) {
    if (media) {
      this.qEditor.quillEditor.insertText(this.editorCursorIndex, media);
    }
  }

  onViewSourceClicked() {
    this.txtArea.value = this.getValue();

    if (this.txtArea.style.display === '') {
      super.writeValue(this.txtArea.value);
    }
    this.txtArea.style.display = this.txtArea.style.display === 'none' ? '' : 'none';
  }

  onToggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
  }

  private get editorCursorIndex(): number {
    // this.qEditor.quillEditor.focus();  -- appears this is no longer needed but in case we are having issues i'm leaving for now
    return this.qEditor.quillEditor.getSelection(true).index;
  }

  getValue(): string {
    return this.qEditor.quillEditor.root.innerHTML;
  }
}
