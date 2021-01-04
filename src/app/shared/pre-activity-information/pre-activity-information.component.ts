import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {PreActivityInformationContentComponent} from './pre-activity-information-content.component';
import DialogConfig from '../models/dialog-config';

@Component({
  selector: 'app-pre-activity-information',
  template: ''
})
export class PreActivityInformationComponent implements OnInit {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() dimensions: any[] = [];
  @Input() actions: any[] = [];
  @Input() data: any;
  @Output() response = new EventEmitter<boolean>();

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openDialog(data?: any) {
    if (data) {
      this.data = data;
    }

    const dialogData = DialogConfig.largeDialogBaseConfig(
      {
        content: this.data.content,
        title: this.data.title,
        actions: this.data.actions
      }
    );
    const ref = this.dialog.open(PreActivityInformationContentComponent, dialogData);
    ref.afterClosed().subscribe(result => {
      this.response.emit(result);
    });
  }
}

