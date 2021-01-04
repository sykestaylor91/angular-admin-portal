import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss']
})
export class DialogHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() closeTitle: string = 'Cancel';
  @Input() showLoading: boolean = false;
  @Input() showClose: boolean = true;
  @Input() showPrevious: boolean = false;
  @Output() closeDialog = new EventEmitter<any>();
  @Output() previousClicked = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  onCloseDialog() {
    this.closeDialog.emit();
  }

  onPreviousClicked() {
    this.previousClicked.emit();
  }
}
