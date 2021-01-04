import {Component, EventEmitter, Output} from '@angular/core';
import {PublicationService} from '../../../shared/services/publication.service';
import {Publication} from '../../../shared/models/publication';

@Component({
  selector: 'app-edit-publication',
  templateUrl: './edit-publication.component.html'
})
export class EditPublicationComponent {
  @Output() saved = new EventEmitter<Publication>();
  @Output() cancel = new EventEmitter<boolean>();

  publicationText: string;

  constructor(private publicationService: PublicationService) {
  }

  displayEditPublication() {
    this.publicationText = this.publicationService.selectedPublication.text;
  }

  saveClickHandler() {
    this.publicationService.save(this.createPublication()).subscribe(publication => {
      this.saved.emit(publication);
    });
  }

  dismissModal() {
    this.cancel.emit(true);
  }

  createPublication() {
    const newPublication = new Publication();
    newPublication.text = this.publicationText;
    newPublication.id = this.publicationService.selectedPublication.id;
    newPublication.status = 'active';

    this.publicationText = '';
    return newPublication;
  }

}
