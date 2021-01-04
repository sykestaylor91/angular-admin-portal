import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Column, ColumnType } from '../../shared/models/column';

@Component({
  selector: 'app-add-remove-resource',
  templateUrl: 'add-remove-resource.component.html'
})
export class AddRemoveResourceComponent implements OnInit {

  selectedItems: any[] = [];
  sourceList: any[] = [];
  listType: string;
  dialogTitle: string;
  createNew: boolean = false;
  displayProperty: string;

  columns: Column[];

  constructor(private dialogRef: MatDialogRef<AddRemoveResourceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.selectedItems = data.selectedItems;
    this.sourceList = data.sourceList;
    this.dialogTitle = data.dialogTitle;
    this.displayProperty = data.displayProperty;
    this.listType = data.listType;
  }

  ngOnInit() {
    if (!this.selectedItems) {
      this.selectedItems = [];
    }
    this.columns = [{
      type: ColumnType.Text,
      field: this.displayProperty,
      width: '60%',
      title: this.displayProperty,
      limit: 10
    },
    {
      type: ColumnType.Date,
      field: 'dateCreated',
      width: '20%',
      title: 'Date created'
    },
    {
      type: ColumnType.AddRemoveButton,
      width: '20%'
    }
    ];
  }

  closeDialog() {
    this.dialogRef.close({ list: this.selectedItems });
  }
}
