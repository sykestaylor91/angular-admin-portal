import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Router} from '@angular/router';
import {SessionService} from '../../shared/services/session.service';
import {InvitationService} from '../../shared/services/invitation.service';
import {ProviderMessageService} from '../../shared/services/provider-message.service';
import {User} from '../../shared/models/user';
import {Role} from '../../shared/models/role';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  // TODO include reader course expiry
  // TODO order notifications by date
  // TODO include eligibility for certificates (for readers)
  // TODO: use materials dialog

  @Input() show: boolean;
  @Output() notificationCount: EventEmitter<number> = new EventEmitter<number>();

  readerMessage: boolean = false;
  teamMessage: boolean = false;
  notifications: any = [];
  user;

  public title = 'Home';
  private teamMessages: any = [];
  private readerMessages: any = [];

  constructor(private router: Router,
              private sessionService: SessionService,
              private invitationService: InvitationService,
              private providerMessageService: ProviderMessageService) {
    this.sessionService.sessionUser.subscribe((sessionUser: User) => {
      this.user = sessionUser;
    });
  }

  ngOnInit() {
    this.notifications = [];
    if (this.user) {
      if (this.user.roles.indexOf(Role.Reader) > -1) {
        this.createReaderNotifications();
      } else {
        this.createProviderNotifications();
      }
      this.providerMessageService.query().subscribe(data => {
        this.sortMessages(this.orderByDate(data));
      });
    }
  }

  sortMessages(allMessages) {
    const that = this;
    allMessages.forEach(function (message) {
      if (message.type === 'team') {
        that.teamMessages.push(message);
      } else if (message.type === 'readers') {
        that.readerMessages.push(message);
      }
    });
    if (allMessages.length > 0) {
      if (this.user.roles.indexOf(Role.Reader) > -1) {
        this.notifications.push(this.readerMessages[0]);
      } else {
        this.notifications.push(this.teamMessages[0]);
      }
    }
    this.notificationCount.emit(this.notifications.length);
  }

  createReaderNotifications() {
    // TODO make this process use real data
    this.createExpiringCourseNotifications();
  }

  createProviderNotifications() {
    this.createDeclarationNotifications();
    this.createInvitationNotifications();
  }

  createInvitationNotifications() {
    const that = this;
    const currentDate = new Date();
    this.invitationService.query().subscribe(invitationData => {
      if (invitationData) {
        invitationData.forEach(function (invitation) {
          const expiry = new Date(invitation.expiryDate);
          if (expiry < currentDate && invitation.status === 'active') { // REVERSE THIS FOR DEMONSTRATIONS (should be < )
            that.newInvitationNotification(invitation);
          }
        });
      }
      this.notificationCount.emit(this.notifications.length);
    });
  }

  newInvitationNotification(invitation) {
    const invitationNotification = {
      'content': '',
      'type': 'Invitation'
    };
    invitationNotification.content = `Contributor ${User.fullName(invitation.firstName, invitation.lastName)} has failed to respond to their invitation`;
    this.notifications.push(invitationNotification);
  }

  createDeclarationNotifications() {
    const currentDate = new Date();
    const citationExpiry = new Date(this.sessionService.loggedInUser.citationDeclarationUpdate);
    const credentialExpiry = new Date(this.sessionService.loggedInUser.credentialDeclarationUpdate);
    const disclosureExpiry = new Date(this.sessionService.loggedInUser.disclosureDeclarationUpdate);
    if (citationExpiry < currentDate) { // REVERSE THIS FOR DEMONSTRATIONS (should be < )
      this.newDeclarationNotification('Citation');
    }
    if (credentialExpiry < currentDate) { // REVERSE THIS FOR DEMONSTRATIONS (should be < )
      this.newDeclarationNotification('Credential');
    }
    if (disclosureExpiry < currentDate) { // REVERSE THIS FOR DEMONSTRATIONS (should be < )
      this.newDeclarationNotification('Disclosure');
    }
  }

  newDeclarationNotification(declaration) {
    const declarationNotification = {
      'content': '',
      'type': declaration
    };
    declarationNotification.content = declaration + ' declarations need updating';
    this.notifications.push(declarationNotification);
  }

  viewNotification(type) {
    switch (type) {
      case 'Citation':
        this.router.navigate(['/citations']);
        break;
      case 'Disclosure':
        this.router.navigate(['/contributor/disclosure/edit']);
        break;
      case 'Credential':
        this.router.navigate(['/contributor/credentials']);
        break;
      case 'Invitation':
        this.router.navigate(['/contributor/invitation']);
        break;
    }
  }

  orderByDate(array) {
    array.sort(function (b, a) {
      return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
    });
    return array;
  }

  createExpiringCourseNotifications() {
  }

}
