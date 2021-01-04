import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-text-editor-embed-video',
  templateUrl: 'embed-video.component.html'
})
export class TextEditorEmbedVideoComponent implements OnInit {
  @Output() insertEmbed = new EventEmitter<string>();
  videoSource: string;

  ngOnInit() {
  }

  confirmEmbed() {
    this.insertEmbed.emit(this.videoSource);
  }

}
