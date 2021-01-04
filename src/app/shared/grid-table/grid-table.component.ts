import {Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {GridTableConfig} from './grid-table.config';
import {ColumnDataType, GridColumn} from './grid.column';
import Utilities from '../utilities';

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss']
})

// TODO: remove and use nowce-data-list instead
export class GridTableComponent implements OnInit {
  @Input() columnMetaData: GridColumn[];
  @Input() config: GridTableConfig;
  @Input() dataList: any[];
  @Input() showLoading: boolean = false;
  @Output() rowClicked = new EventEmitter<any>();

  ColumnDataType = ColumnDataType;

  @ContentChild('menuRef') menuRef: TemplateRef<any>;
  @ContentChild('radioRef') radioRef: TemplateRef<any>;
  @ContentChild('detailsRow') detailsRowRef: TemplateRef<any>;

  constructor() {
  }

  ngOnInit() {
    this.columnMetaData = Utilities.deepClone(this.columnMetaData);
  }

  onRowClicked(row: any) {
    this.rowClicked.emit(row);
  }
}
