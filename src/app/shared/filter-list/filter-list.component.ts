import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-filter-list',
  templateUrl: 'filter-list.component.html'
})


// TODO: remove and use nowce-data-list instead
export class FilterListComponent implements OnInit, OnChanges {
  @Input() public data: any;
  @Input() public filterTerm: string = '';
  @Input() public filterType: string = 'all';
  @Output() filterOccurrence = new EventEmitter<any>();
  public filteredArray: any = [];
  public filterTimeout: any;
  private filterDelay: number = 300;
  private typeFilterActive: boolean = false;
  private textFilterActive: boolean = false;

  constructor() {
  }

  ngOnChanges(changes) {
    this.onFilterKeyUp();
  }

  ngOnInit() {
    this.filteredArray = this.data;
    this.filterOccurrence.emit(this.filteredArray);
  }

  filterByType() {
    const type = this.filterType;
    if (type === 'all') {
      this.filteredArray = this.data;
      this.typeFilterActive = false;
      if (this.textFilterActive) {
        this.filterCoursesBySearchTerm();
      }
    } else if (type !== '') {
      if (this.textFilterActive && !this.typeFilterActive) {
        const additionalFilter = [];
        for (let i = 0; i < this.filteredArray.length; i++) {
          if (this.contains(this.filteredArray[i].type, type)) {
            additionalFilter.push(this.filteredArray[i]);
          }
        }
        this.filteredArray = additionalFilter;
      } else if (this.textFilterActive && this.typeFilterActive) {
        this.filteredArray = [];
        for (let i = 0; i < this.data.length; i++) {
          if (this.contains(this.data[i].type, type)) {
            this.filteredArray.push(this.data[i]);
          }
        }
        this.typeFilterActive = false;
        this.filterCoursesBySearchTerm();
        this.typeFilterActive = true;
      } else {
        this.filteredArray = [];
        for (let i = 0; i < this.data.length; i++) {
          if (this.contains(this.data[i].type, type)) {
            this.filteredArray.push(this.data[i]);
          }
        }
      }
      this.typeFilterActive = true;
    }
    this.filterOccurrence.emit(this.filteredArray);

  }

  onFilterKeyUp() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filterCoursesBySearchTerm();
      this.filterTimeout = null;
    }, this.filterDelay);
  }

  filterCoursesBySearchTerm() {
    if (!this.filterTerm || (typeof this.filterTerm === 'string' && this.filterTerm.trim() === '')) {
      this.textFilterActive = false;
      if (this.typeFilterActive) {
        this.filteredArray = this.data;
        this.filterOccurrence.emit(this.filteredArray);

      } else {
        this.filteredArray = this.data;
        this.filterOccurrence.emit(this.filteredArray);
      }
      return;
    } else {
      this.filteredArray = [];
      for (let i = 0; i < this.data.length; i++) {
        for (const property in this.data[i]) {
          if (this.data[i].hasOwnProperty(property)) {
            if (this.contains(this.data[i][property], this.filterTerm)) {
              if (this.filteredArray.indexOf(this.data[i]) < 0) {
                this.filteredArray.push(this.data[i]);
              }
            }
          }
        }
      }
      this.filterOccurrence.emit(this.filteredArray);
    }
    this.textFilterActive = true;
  }

  contains(value, filter): boolean {
    if (value === undefined || value === null) {
      return false;
    }
    return value.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
  }

}
