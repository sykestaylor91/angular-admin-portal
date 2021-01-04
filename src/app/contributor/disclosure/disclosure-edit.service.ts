import {Injectable} from '@angular/core';
import {SessionService} from '../../shared/services/session.service';
import {DisclosureService} from '../../shared/services/disclosure.service';
import {Observable} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {Disclosure} from '../../shared/models/disclosure';

@Injectable()
export class DisclosureEditService {

  constructor(private notificationsService: NotificationsService,
              private disclosureService: DisclosureService,
              private sessionService: SessionService) {
  }

  deleteDisclosure(disclosure, disclosuresArray): Disclosure[] {
    disclosure.status = Disclosure.DELETED;
    this.disclosureService.save(disclosure).subscribe(data => {
      this.notificationsService.success('Success', 'You have permanently deleted a disclosure');
    });
    for (let i = disclosuresArray.length - 1; i >= 0; i--) {
      if (disclosuresArray[i].id === disclosure.id) {
        disclosuresArray.splice(i, 1);
      }
    }
    return disclosuresArray;
  }

  saveForm(disclosure: Disclosure): Observable<Disclosure> {
    if (!disclosure.userId && this.disclosureService.selectedContributorId) {
      disclosure.userId = this.disclosureService.selectedContributorId;
    } else if (!disclosure.userId && !this.disclosureService.selectedContributorId) {
      disclosure.userId = this.sessionService.loggedInUser.id;
    }

    return this.disclosureService.save(disclosure);
  }

}
