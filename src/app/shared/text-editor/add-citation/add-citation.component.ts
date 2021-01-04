import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CitationService} from '../../services/citation.service';
import {Citation} from '../../models/citation';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-text-editor-add-citation',
  styleUrls: ['add-citation.component.scss'],
  templateUrl: 'add-citation.component.html'
})
export class TextEditorAddCitationComponent implements OnInit {
  @Output() insertCitation = new EventEmitter<Citation>();
  @Output() dismissModal = new EventEmitter<any>();
  @Output() showLoading = new EventEmitter<boolean>();

  matchingCitations: Citation[] = [];
  matchingCitationsFound: boolean = false;
  selectedCitation: Citation;
  citationText: string = '';

  constructor(private citationService: CitationService) {
  }

  ngOnInit(): void {
  }

  async onSaveAndInsertCitation(skipDuplicateCheck: boolean = false) {
    if (this.citationText) {
      let continueSave: boolean = true;
      if (!skipDuplicateCheck && this.citationText && this.citationText.length > 5) {
        this.showLoading.emit(true);
        await this.citationService.findMatch(this.citationText)
          .toPromise()
          .then(citations => {
            if (citations.length > 0) {
              continueSave = false;
              this.matchingCitationsFound = true;
              this.matchingCitations = citations;
            }
          });
        this.showLoading.emit(false);
      }

      if (continueSave) {
        return this.onSaveCitation(new Citation({text: this.citationText}));
      } else {
        this.dismissModal.emit();
      }
    } else {
      this.dismissModal.emit();
    }
  }

  onSaveCitation(newCitation: Citation) {
    return this.citationService.save(newCitation)
      .pipe(finalize(() => this.dismissModal.emit()))
      .subscribe(citation => {
        this.insertCitation.emit(citation);
      });
  }

  onCitationSelected(selectedCitation: Citation) {
    this.onSaveCitation(selectedCitation);
  }

}
