import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {SessionService} from '../../shared/services/session.service';
import {PublicationService} from '../../shared/services/publication.service';
import {UserService} from '../../shared/services/user.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {EditPublicationComponent} from './edit-publication/edit-publication.component';
import {NotificationsService} from 'angular2-notifications';
import {Publication} from '../../shared/models/publication';
import {cloneDeep} from 'lodash';
import {User} from '../../shared/models/user';
import {LoggingService} from '../../shared/services/logging.service';

@Component({
  selector: 'app-publications',
  templateUrl: 'publications.component.html',
  styleUrls: ['publications.component.scss']
})
export class PublicationsComponent implements OnInit {
  title = 'Publications';
  author: any;
  publications: Publication[];
  showEditPublication: boolean = false;
  filteredPublications: Publication[] = [];
  filterTerm: string;
  filterTimeout: any;

  User = User;

  @ViewChild(EditPublicationComponent) private childEditPublicationComponent: EditPublicationComponent;
  @ViewChild('modal') private modal: ModalDirective;

  private filterDelay: number = 300;
  private readonly deleted = 'deleted';

  constructor(private router: Router,
              public sessionService: SessionService,
              private notificationsService: NotificationsService,
              private publicationService: PublicationService,
              private userService: UserService) {
  }

  ngOnInit() {
    if (this.sessionService.loggedInUser) {
      this.author = this.sessionService.loggedInUser; // current user
      // TODO: This needs to simply pass deleted flag to backend instead of client-side filtering...
      this.publicationService.findByUserId(this.author.id).subscribe(data => {
        this.publications = data;
        this.filteredPublications = this.publications;
      });
    } else {
      LoggingService.warn('Cant get current user');
    }
  }

  finishClickHandler() {
    this.sessionService.loggedInUser.citationDeclarationUpdate = this.getDeclarationDate();
    this.userService.save(this.sessionService.loggedInUser).subscribe();
    this.router.navigate(['/']);
    this.notificationsService.success('Publications Saved', 'Your publications have been saved');
  }

  getDeclarationDate() {
    const expirationDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
    return expirationDate.toString();
  }

  showEditPublicationClickHandler() {
    this.showEditPublication = true;
  }

  onSaved(publication) {
    this.showEditPublication = false;

    const tempPublications = cloneDeep(this.publications);
    tempPublications.push(publication);

    this.publications = [];
    this.filteredPublications = [];

    this.publications = tempPublications;
    this.filteredPublications = tempPublications;
  }

  onCancel() {
    this.showEditPublication = false;
  }

  editPublicationClickHandler(publication, index: number) {
    this.publicationService.selectedPublication = publication;
    this.modal.show();
    this.childEditPublicationComponent.displayEditPublication();
  }

  editOnSave(publication) {
    this.dismissModal();
    for (let i = 0; i < this.publications.length; i++) {
      if (this.publications[i].id === publication.id) {
        this.publications[i] = publication;
        break;
      }
    }
  }

  dismissModal() {
    this.modal.hide();
  }

  onFilterKeyUp() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filterPublications();
      this.filterTimeout = null;
    }, this.filterDelay);
  }

  filterPublications() {
    if (!this.filterTerm || (typeof this.filterTerm === 'string' && this.filterTerm.trim() === '')) {
      this.filteredPublications = this.publications;
      return;
    }
    this.filteredPublications = [];
    for (let i = 0; i < this.publications.length; i++) {
      if (this.contains(this.publications[i].text, this.filterTerm)) {
        this.filteredPublications.push(this.publications[i]);
      }
    }
  }

  contains(value, filter): boolean {
    if (value === undefined || value === null) {
      return false;
    }
    return value.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
  }

  deletePublicationClickHandler(publication: Publication, index: number) {
    if (confirm('Are you sure you want to delete this publication?')) {
      publication.status = this.deleted;

      const tempPublications = cloneDeep(this.publications);
      tempPublications.splice(index, 1);

      this.publicationService.save(publication).subscribe(data => {
        this.filteredPublications = [];
        this.publications = [];

        this.filteredPublications = tempPublications;
        this.publications = tempPublications;

        this.notificationsService.success('Success', 'Publication deleted');
      });
    }
  }

}
