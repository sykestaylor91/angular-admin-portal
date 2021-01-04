import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {PublicationService} from '../../../shared/services/publication.service';
import {SessionService} from '../../../shared/services/session.service';
import {Publication} from '../../../shared/models/publication';
import {NotificationsService} from 'angular2-notifications';
import {LoggingService} from '../../../shared/services/logging.service';

@Component({
  selector: 'app-add-my-publication',
  templateUrl: 'add-my-publication.component.html'
})
export class AddMyPublicationComponent implements OnInit {
  title = 'Add Publication';
  publicationText: string = '';
  user: any;

  @Output() saved = new EventEmitter<Publication>();
  @Output() cancel = new EventEmitter<boolean>();

  constructor(private publicationService: PublicationService,
              private notificationsService: NotificationsService,
              private sessionService: SessionService) {
  }

  ngOnInit() {
    this.user = this.sessionService.loggedInUser;
    if (this.publicationService.selectedPublication) {
      this.publicationText = this.publicationService.selectedPublication.text;
    }
  }

  saveClickHandler() {
    this.publicationService.save(this.createPublication()).subscribe(data => {
      this.saved.emit(data);
      this.notificationsService.success('Success', 'Publication saved successfully');
    });
  }

  cancelClickHandler() {
    this.cancel.emit(true);
  }

  createPublication() {
    const newPublication = new Publication();
    if (this.user) {
      newPublication.userId = this.user.id; // current user
      newPublication.text = this.publicationText;
    } else {
      LoggingService.warn('Cant assign current user to publication');
    }
    return newPublication;
  }

}
