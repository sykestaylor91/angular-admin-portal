import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CitationService} from '../../services/citation.service';
import {Citation} from '../../models/citation';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-text-editor-citation-library',
  templateUrl: 'citation-library.component.html',
  styleUrls: ['citation-library.component.scss']
})
export class TextEditorCitationLibraryComponent implements OnInit {
  @Input() citationIds: string[];
  @Input() viewAllCitations: boolean;
  @Output() citationLibraryInsert = new EventEmitter<Citation>();
  @Output() doneLoading = new EventEmitter();
  citations: Citation[] = [];
  filteredCitations: any = [];
  filterTerm: string;
  filterTimeout: any;
  noCitationText: string = '';
  private filterDelay: number = 300;

  constructor(private citationService: CitationService) {
  }

  ngOnInit() {
    if (this.viewAllCitations) {
      this.noCitationText = 'There are no citations in your library.';
    } else {
      this.noCitationText = 'No Citations have been used in this activity yet.';
    }
    this.getExamCitations();
  }

  getExamCitations() {
    if (this.viewAllCitations || !this.citationIds) {
      this.citationService.query()
        .pipe(finalize(() => this.doneLoading.emit()))
        .subscribe(citations => {
          this.citations = citations;
          this.filteredCitations = citations;
        });

    } else {
      this.citationService.findMultiple(this.citationIds)
        .pipe(finalize(() => this.doneLoading.emit()))
        .subscribe((citations: Citation[]) => {
          this.citations = citations;
          this.filteredCitations = this.citations;
        });
    }
  }

  insertCitation(citation) {
    this.citationLibraryInsert.emit(citation);
  }

  onFilterKeyUp() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filterCitations();
      this.filterTimeout = null;
    }, this.filterDelay);
  }

  filterCitations() {
    if (!this.filterTerm || (typeof this.filterTerm === 'string' && this.filterTerm.trim() === '')) {
      this.filteredCitations = this.citations;
      return;
    }
    this.filteredCitations = [];
    for (let i = 0; i < this.citations.length; i++) {
      if (this.contains(this.citations[i].text, this.filterTerm)) {
        this.filteredCitations.push(this.citations[i]);
      }
    }
  }

  contains(value, filter): boolean {
    if (value === undefined || value === null) {
      return false;
    }
    return value.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
  }
}
