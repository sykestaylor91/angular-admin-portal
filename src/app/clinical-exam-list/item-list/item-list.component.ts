import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import DialogConfig from '../../shared/models/dialog-config';
import {DialogActionsComponent} from '../../shared/dialog/dialog-actions/dialog-actions.component';
import {finalize} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';
import {ItemService} from '../../shared/services/item.service';
import {AnswerFormatService} from '../../shared/services/answer-format.service';
import {ItemFormComponent} from '../item-form/item-form.component';
import {AnswerFormatFormComponent} from '../answer-format-form/answer-format-form.component';
import {ActionType} from '../../shared/models/action-type';
import {Item} from '../../shared/models/item';
import {AnswerFormat} from '../../shared/models/answer-format';
import {Column, ColumnType} from '../../shared/models/column';
import {ContextMenuItems} from '../../shared/models/context-menu-items';
type OrderBy = 'newToOld' | 'oldToNew';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  showItemSpinner: boolean = true;

  items: Item[] = [];
  itemColumns: Column[] = [{
    type: ColumnType.FirstNWordsStripTags,
    field: 'title',
    width: '50%',
    title: 'Item title',
    limit: 10
  },
  {
    type: ColumnType.FirstNWordsStripTags,
    field: 'text',
    width: '25%',
    title: 'Item text',
    limit: 10
  },
  {
    type: ColumnType.Date,
    field: 'dateCreated',
    width: '25%',
    title: 'Date created'
  }];
  contextMenuItems: string[] = [
    ContextMenuItems.Edit,
    ContextMenuItems.Delete,
    ContextMenuItems.UseAsTemplate];

  currentItemOrder: OrderBy = 'newToOld';
  showAnswerFormatSpinner: boolean = true;

  answerFormats: AnswerFormat[] = [];
  answerFormatColumns: Column[] = [{
    type: ColumnType.FirstNWordsStripTags,
    field: 'title',
    width: '70%',
    title: 'Answer format title',
    limit: 10
  },
    {
      type: ColumnType.Date,
      field: 'dateCreated',
      width: '30%',
      title: 'Date created'
    }
  ];

  constructor(
    private itemService: ItemService,
    private answerFormatService: AnswerFormatService,
    private notificationsService: NotificationsService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.getFilteredItems();
    this.getFilteredAnswerFormats();
  }

  getFilteredItems() {
    this.itemService.query().subscribe(items => {

      if (items && items.length > 0) {
        this.items = items.filter(item => item.status !== 'deleted');
      }
      this.showItemSpinner = false;
    });
  }

  getFilteredAnswerFormats() {
    this.answerFormatService.query().subscribe(answerFormats => {
      if (answerFormats && answerFormats.length > 0) {
        this.answerFormats = answerFormats.filter(answerFormat => answerFormat.status !== 'deleted');
      }
      this.showAnswerFormatSpinner = false;
    });
  }

  createItemClickHandler() {
    this.router.navigate(['/clinical/item-form']);
  }

  editItemClickHandler(resource) {
    this.router.navigate(['/clinical/item-form', resource.id]);
  }

  editItemDialog(resource) {
    const dialogRef = this.dialog.open(ItemFormComponent, {
      height: '80%',
      width: '80%',
      data: {
        item: resource,
        formType: 'Edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getFilteredItems();
    });

  }

  useItemAsBlueprintClickHandler(item) {
    item.id = null;
    item.title += ' - used as a blueprint...';
    this.editItemDialog(item);
  }

  deleteItemClickHandler(item) {
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this item?',
        actions: [ActionType.Confirmation]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      this.deleteItem(item);
      ref.close();
    });
  }

  deleteItem(item) {
    this.showItemSpinner = true;
    this.itemService.remove(item)
      .pipe(finalize(() => this.showItemSpinner = false))
      .subscribe(data => {
        const idx = this.items.findIndex(itemItem => itemItem.id === item.id);
        this.items.splice(idx, 1);
        this.notificationsService.success('Success', 'Item deleted successfully');
      }, err => {
        this.notificationsService.error(err);
        console.error(err);
      });
  }

  createAnswerFormatClickHandler() {
    this.router.navigate(['/clinical/answer-format-form']);
  }

  editAnswerFormatClickHandler(resource) {
    this.router.navigate(['/clinical/answer-format-form', resource.id]);
  }

  editAnswerFormatDialog(resource) {
    const dialogRef = this.dialog.open(AnswerFormatFormComponent, {
      height: '80%',
      width: '80%',
      data: {
        answerFormat: resource,
        formType: 'Edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getFilteredAnswerFormats();
    });
  }

  useAnswerFormatAsBlueprintClickHandler(answerFormat) {
    answerFormat.id = null;
    answerFormat.title = answerFormat.title + ' - used as a blueprint...';
    this.editAnswerFormatDialog(answerFormat);
  }

  deleteAnswerFormatClickHandler(answerFormat) {
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this answerFormat?',
        actions: [ActionType.Confirmation]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      this.deleteAnswerFormat(answerFormat);
      ref.close();
    });
  }

  deleteAnswerFormat(answerFormat) {
    this.showAnswerFormatSpinner = true;
    this.answerFormatService.remove(answerFormat)
      .pipe(finalize(() => this.showAnswerFormatSpinner = false))
      .subscribe(data => {
        const idx = this.answerFormats.findIndex(answerFormatItem => answerFormatItem.id === answerFormat.id);
        this.answerFormats.splice(idx, 1);
        this.notificationsService.success('Success', 'AnswerFormat deleted successfully');
      }, err => {
        this.notificationsService.error(err);
        console.error(err);
      });
  }
}
