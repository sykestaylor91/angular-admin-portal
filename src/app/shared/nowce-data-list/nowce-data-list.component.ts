import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Column, ColumnType } from '../models/column';
import { ContextMenuItems } from '../models/context-menu-items';
import { Exam, ContributorInviteStatus, Author } from '../models/exam';
import {Role} from '../../shared/models/role';
import {NewAuthorEvent} from '../../activity-manager/activity-manager-edit/course-contributors/new-author-event';
import {FilterList} from '../models/filter-list';

@Component({
  selector: 'app-nowce-data-list',
  templateUrl: './nowce-data-list.component.html',
  styleUrls: ['./nowce-data-list.component.scss']
})

export class NowceDataListComponent implements OnInit {
  @Input() cols: Column[] = [];
  @Input() dataArray: any[];
  @Input() rowOptions: number[] = [5, 10, 20];
  @Input() contextMenu: string[] = [];
  @Input() frozenCols: string[] = [];
  @Input() customButtonLabel: string = '';
  @Input() showPagination: boolean = true;
  @Input() selectedItems: any[] = [];
  @Input() customMenuLabel: string = '';
  @Input() saveType: string = 'object';
  @Input() lookupList: string[] = [];
  @Input() selectedExam: Exam;
  @Input() contextMenuHide: {} = {};
  ContextMenuItems = ContextMenuItems;
  @Input() filterLists: FilterList[] = [];
  // TODO: make dynamic
  @Output() editClicked = new EventEmitter<any>();
  @Output() deleteClicked = new EventEmitter<any>();
  @Output() useAsTemplateClicked = new EventEmitter<any>();
  @Output() previewClicked = new EventEmitter<any>();
  @Output() metricsClicked = new EventEmitter<any>();
  @Output() unPublishClicked = new EventEmitter<any>();
  @Output() addRemoveClicked = new EventEmitter<any>();
  @Output() customButtonClicked = new EventEmitter<any>();
  @Output() customMenuClicked = new EventEmitter<any>();
  @Output() alternativeFormSaveClicked = new EventEmitter<any>();
  @Output() resumeActivityClicked = new EventEmitter<any>();
  @Output() abandonActivityClicked = new EventEmitter<any>();
  @Output() newAuthorSelected = new EventEmitter<NewAuthorEvent>();
  columnType = ColumnType;
  role = Role;
  alternativeSelectedLookUp: Role;
  alternativeForm: string;
  search_key: string;
  originDataArray: any[];
  filterModelArray: string[] = [];
  searchChipsArray: string[] = [];

  constructor() {
  }

  public ngOnInit() {
      this.originDataArray = this.dataArray;
  }

  editClickHandler(itemClicked) {
    this.editClicked.emit(itemClicked);
  }

  deleteClickHandler(itemClicked) {
    this.deleteClicked.emit(itemClicked);
  }

  useAsTemplateClickHandler(itemClicked) {
    this.useAsTemplateClicked.emit(itemClicked);
  }

  previewClickHandler(itemClicked) {
    this.previewClicked.emit(itemClicked);
  }

  metricsClickHandler(itemClicked) {
    this.metricsClicked.emit(itemClicked);
  }

  unPublishClickHandler(itemClicked) {
    this.unPublishClicked.emit(itemClicked);
  }

  customClickHandler(data) {
    this.customButtonClicked.emit(data);
  }

  customMenuClickHandler(data) {
    this.customMenuClicked.emit(data);
  }

  itemInList(item) {
    for (let i = 0; i < this.selectedItems?.length; i++) {
      if (this.selectedItems[i] === item || this.selectedItems[i] === item.id || this.selectedItems[i].id === item.id) {
        return true;
      }
    }
    return false;
  }

  addToListClickHandler(item) {
    if (this.saveType && this.saveType === 'object') {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.push(item.id);
    }
  }

  removeFromListClickHandler(item) {
    for (let i = this.selectedItems?.length - 1; i >= 0; i--) {
      if (this.selectedItems[i].id === item.id || this.selectedItems[i] === item.id) {
        this.selectedItems.splice(i, 1);
        break;
      }
    }
  }

  toggleForm(id) {
    this.alternativeForm = (this.alternativeForm === id) ? '' : id ;
  }

  alternativeFormSaveClickedHandler(itemClicked) {
    const newAuthor: Author = {id: itemClicked.id, role: this.alternativeSelectedLookUp, invited: new Date(), status: ContributorInviteStatus.Invited};
    this.newAuthorSelected.emit({author: newAuthor, user: itemClicked});
    this.dataArray.splice(itemClicked);
    this.alternativeForm = '';
  }

  resumeActivityClickHandler(data) {
    this.resumeActivityClicked.emit(data);
  }

  abandonActivityClickHandler(data) {
    this.abandonActivityClicked.emit(data);
  }

  isLessThan( operandOne, operandTwo) {
    return (parseInt(operandOne, null) <= parseInt(operandTwo, null));
  }

  dataFilter() {
      this.dataArray = this.originDataArray.filter(row => {
          if (this.checkTbRowBySearchKey(row) && this.checkTbRowByFilterDropdowns(row)) {
              return true;
          } else {
              return false;
          }
      });
  }

  private checkTbRowBySearchKey(row) {
    let extendedSearchChips = [];
    extendedSearchChips = this.searchChipsArray.filter(chip => true);
    if (this.search_key) {
        extendedSearchChips.push(this.search_key);
    }
    if (extendedSearchChips.length === 0) {
        return true;
    }

    for (const chip of extendedSearchChips) {
        let status = false;
        for (const col of this.cols) {
            if (row[col['field']] && row[col['field']].toLowerCase().indexOf(chip) !== -1) {
              status = true;
              break;
            }
        }
        if (!status) {
            return false;
        }
    }

    return true;
  }

  private checkTbRowByFilterDropdowns(row) {
    for (const filter of this.filterLists) {
        if (!filter.selected) {
            continue;
        }
        const filterValue = row[filter.dataPropertyName] ? row[filter.dataPropertyName].toLowerCase() : '';
        // Lowercase or decodeURI and check
        if (filterValue.indexOf(filter.selected.toLowerCase()) === -1 && decodeURI(filterValue).indexOf( decodeURI(filter.selected.toLowerCase())) === -1) {
            return false;
        }
    }

    return true;
  }

  chipsAndFilter() {
      if (this.searchChipsArray.indexOf(this.search_key) !== -1) {
          return;
      }
      this.searchChipsArray.push(this.search_key);
      this.search_key = '';
      this.dataFilter();
  }

  clearSearchKey() {
    this.search_key = '';
    this.dataFilter();
  }

  removeSearchChip(removedChip) {
      this.searchChipsArray = this.searchChipsArray.filter(chip => chip !== removedChip);
      this.dataFilter();
  }

  clearSearches() {
      this.searchChipsArray = [];
      this.dataFilter();
  }

}
