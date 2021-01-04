import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CitationService} from '../shared/services/citation.service';
import {Citation} from '../shared/models/citation';

@Component({
  selector: 'app-citation-lookup',
  templateUrl: './citation-lookup.component.html'
})
export class CitationLookupComponent implements OnInit {
  citation: Citation;

  constructor(private citationService: CitationService,
              private router: Router) {
  }

  ngOnInit() {
    const citationId = this.router.url.slice(10);
    if (this.router.url) {
      this.citationService.find(citationId).subscribe((citation: Citation) => {
        this.citation = citation;
      });
    }
  }

}
