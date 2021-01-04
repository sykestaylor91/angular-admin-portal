import {Component, Inject, OnInit} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {Router} from '@angular/router';
import {SessionService} from '../../shared/services/session.service';
import {UserService} from '../../shared/services/user.service';
import {InvitationService} from '../../shared/services/invitation.service';
import {Invitation} from '../../shared/models/invitation';
import {NotificationsService} from 'angular2-notifications';
import {ActionType} from '../../shared/models/action-type';
import { MatDialog } from '@angular/material/dialog';
import {DialogActionsComponent} from '../../shared/dialog/dialog-actions/dialog-actions.component';
import DialogConfig from '../../shared/models/dialog-config';
import {User} from '../../shared/models/user';
import {Role} from '../../shared/models/role';
import {LoggingService} from '../../shared/services/logging.service';
import {DOCUMENT} from '@angular/common';
import {EmailTemplate} from '../../shared/models/email-template';
import {EmailService} from '../../shared/services/email.service';

@Component({
  selector: 'app-invitation',
  templateUrl: 'invitation.component.html'
})
export class InvitationComponent implements OnInit {
  title = 'Invite authors, reviewers and other contributors';
  formSubmitted: Boolean = false;
  inviteFormGroup: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  permissionLevel: FormControl;
  accessLevels: any;
  invitations: Invitation[];
  activeInvitations: Invitation[];
  currentDate: Date = new Date();

  User = User;
  users: User[] = [];

  private selectedInvitation: Invitation;

  private superAdminAccessLevels: any[] = [
      {
          'id': 'provider',
          'access': 'Provider',
          'rights': 'Senior most member of the team. Plans & designs activity, invites & manages contributors, configures all settings & content management'
      },
      {
          'id': 'planner',
          'access': 'Planner',
          'rights': 'Senior member of the activity team. Plans & designs activity, invites & manages contributors, configures all settings & content management'
      },
      {
          'id': 'media_admin',
          'access': 'Media admin',
          'rights': 'Access media library to add and edit media items'
      },
      {
          'id': 'reviewer',
          'access': 'Reviewer',
          'rights': 'Comment on content and suggest changes'
      },
      {
          'id': 'author',
          'access': 'Author',
          'rights': 'As \'Reviewer\' + add and edit own content and media items'
      },
      {
          'id': 'editor',
          'access': 'Editor',
          'rights': 'As \'Author\' + make changes to authored content'
      },
      {
          'id': 'publisher',
          'access': 'Publisher',
          'rights': 'As \'Editor\' + publish courses and tests etc'
      }
  ];
  private providerAccessLevels: any[] = [
    {
      'id': 'planner',
      'access': 'Planner',
      'rights': 'Senior member of the activity team. Plans & designs activity, invites & manages contributors, configures all settings & content management'
    },
    {
      'id': 'media_admin',
      'access': 'Media admin',
      'rights': 'Access media library to add and edit media items'
    },
    {
      'id': 'reviewer',
      'access': 'Reviewer',
      'rights': 'Comment on content and suggest changes'
    },
    {
      'id': 'author',
      'access': 'Author',
      'rights': 'As \'Reviewer\' + add and edit own content and media items'
    },
    {
      'id': 'editor',
      'access': 'Editor',
      'rights': 'As \'Author\' + make changes to authored content'
    },
    {
      'id': 'publisher',
      'access': 'Publisher',
      'rights': 'As \'Editor\' + publish courses and tests etc'
    }
  ];
  private publisherAccessLevels: any[] = [
    {
      'id': 'media_admin',
      'access': 'Media admin',
      'rights': 'Access media library to add and edit media items'
    },
    {
      'id': 'reviewer',
      'access': 'Reviewer',
      'rights': 'Comment on content and suggest changes'
    },
    {
      'id': 'author',
      'access': 'Author',
      'rights': 'As \'Reviewer\' + add and edit own content and media items'
    },
    {
      'id': 'editor',
      'access': 'Editor',
      'rights': 'As \'Author\' + make changes to authored content'
    }
  ];
  private editorAccessLevels: any[] = [
    {
      'id': 'media_admin',
      'access': 'Media admin',
      'rights': 'Access media library to add and edit media items'
    },
    {
      'id': 'reviewer',
      'access': 'Reviewer',
      'rights': 'Comment on content and suggest changes'
    },
    {
      'id': 'author',
      'access': 'Author',
      'rights': 'As \'Reviewer\' + add and edit own content and media items'
    },
    {
      'id': 'editor_helper',
      'access': 'Helper',
      'rights': 'Appoint a \'Helper\' to support your effort and share same access rights as you. You retain full responsibility for all \'Helper\' actions'
    }
  ];
  private authorAccessLevels: any[] = [
    {
      'id': 'media_admin',
      'access': 'Media admin',
      'rights': 'Access media library to add and edit media items'
    },
    {
      'id': 'reviewer',
      'access': 'Reviewer',
      'rights': 'Comment on content and suggest changes'
    },
    {
      'id': 'author_helper',
      'access': 'Helper',
      'rights': 'Appoint a \'Helper\' to support your effort and share same access rights as you. You retain full responsibility for all \'Helper\' actions'
    }
  ];
  private reviewerAccessLevels: any[] = [
    {
      'id': 'media_admin',
      'access': 'Media admin',
      'rights': 'Access media library to add and edit media items'
    }
  ];

  constructor(private invitationService: InvitationService,
              private sessionService: SessionService,
              private notificationsService: NotificationsService,
              private dialog: MatDialog,
              private router: Router,
              private userService: UserService,
              private emailService: EmailService,
              @Inject(DOCUMENT) private Document: Document) {
  }

  ngOnInit() {
    if (this.sessionService.loggedInUser && this.sessionService.loggedInUser.roles) {
      this.constructAvailableInviteRoles();
    } else {
      LoggingService.warn('No roles found on this user');
    }
    this.userService.query()
        .subscribe(users => {
            if (users && users.length > 0) {
                this.users = users;
            }
        });
    this.createForm();
    this.invitationService.query().subscribe(data => {
      this.invitations = data;
      this.activeInvitations = this.identifyActiveInvitations(data);
    });
  }

  identifyActiveInvitations(invitations) {
    const activeInvitations = [];
    invitations.forEach((invitation) => {
      if (invitation.status === 'active') { //  && that.notExpired(invitation.expiryDate)
        activeInvitations.push(invitation);
      }
    });
    return activeInvitations;
  }

  constructAvailableInviteRoles() {
    if (this.sessionService.loggedInUser.roles.indexOf(Role.SuperAdmin) > -1) {
      this.accessLevels = this.superAdminAccessLevels;
    } else if (this.sessionService.loggedInUser.roles.indexOf(Role.Provider) > -1) {
      this.accessLevels = this.providerAccessLevels;
    } else if (this.sessionService.loggedInUser.roles.indexOf(Role.Publisher) > -1) {
      this.accessLevels = this.publisherAccessLevels;
    } else if (this.sessionService.loggedInUser.roles.indexOf(Role.Author) > -1) {
      this.accessLevels = this.authorAccessLevels;
    } else if (this.sessionService.loggedInUser.roles.indexOf(Role.Editor) > -1) {
      this.accessLevels = this.editorAccessLevels;
    } else if (this.sessionService.loggedInUser.roles.indexOf(Role.Reviewer) > -1) {
      this.accessLevels = this.reviewerAccessLevels;
    } else if (this.sessionService.loggedInUser.roles.indexOf(Role.MediaAdmin) > -1) {
      this.accessLevels = [];
    }
  }

  testInvitePermissions(role) {
    if (role === 'super_admin') {
      this.accessLevels = this.superAdminAccessLevels;
    } else if (role === 'provider') {
      this.accessLevels = this.providerAccessLevels;
    } else if (role === 'publisher') {
      this.accessLevels = this.publisherAccessLevels;
    } else if (role === 'author') {
      this.accessLevels = this.authorAccessLevels;
    } else if (role === 'editor') {
      this.accessLevels = this.editorAccessLevels;
    } else if (role === 'reviewer') {
      this.accessLevels = this.reviewerAccessLevels;
    } else if (role === 'media_admin') {
      this.accessLevels = [];
    }
  }

  createForm() {
    this.firstName = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required]);
    this.permissionLevel = new FormControl('', [Validators.required]);
    this.inviteFormGroup = new FormBuilder().group({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      permissionLevel: this.permissionLevel
    });
  }

  sendInviteClickHandler() {
    this.formSubmitted = true;
    if (this.inputValidation()) {
      this.invitationService.save(this.createInvitation()).subscribe(invitationData => {
        this.sendInvite(invitationData);
        this.activeInvitations.push(invitationData);
          // clear form
        this.inviteFormGroup.reset();
      });
    }
  }

  inputValidation() {
    const errors = [];
    if (!this.firstName.value) {
      errors.push('Please provide the first name of the person you are inviting.');
    }
    if (!this.lastName.value) {
      errors.push('Please provide the second name of the person you are inviting.');
    }
    if (!this.email.value) {
      errors.push('Please provide the email of the person you are inviting.');
    }
    this.users.forEach( user => {
        if (user.email === this.email.value) {
            errors.push('Please select an email address not already in use.');
        }
    });

    if (!this.permissionLevel.value) {
      errors.push('Please provide the access level of the person you are inviting.');
    }
    if (errors.length > 0) {
      errors.forEach(error =>  this.notificationsService.error('Error', error));
      return false;
    } else {
      return true;
    }
  }

  sendInvite(invitationData) {
    const location = this.Document.location;
    const template = new EmailTemplate();
    template.toAddresses = [invitationData.email];
    template.template = {
      name: 'user-invitation',
      data: {
        'fullName': (invitationData.firstName || '') + ' ' + (invitationData.lastName || ''),
        'invitorFullName': (this.sessionService.loggedInUser.firstName || '') + ' ' + (this.sessionService.loggedInUser.lastName || ''),
        'acceptUrl': location.protocol + '//' + location.hostname + ((location.port !== '80' && location.port !== '443') ? (':' + location.port) : '') + '/contributor/registration/' + invitationData.id,
        'email': invitationData.email
      }
    };
    this.emailService.sendEmailTemplate(template).subscribe(() => {
      this.notificationsService.success('Success', 'The invitation has been sent');
    });
  }

  createInvitation() {
    const newInvitation = new Invitation();
    newInvitation.firstName = this.firstName.value;
    newInvitation.lastName = this.lastName.value;
    newInvitation.email = this.email.value;
    newInvitation.permissionLevel = this.permissionLevel.value;
    newInvitation.status = 'active';
    newInvitation.expiryDate = this.invitationExpiryDate();
    return newInvitation;
  }

  invitationExpiryDate() {
    return new Date(new Date().setMonth(new Date().getMonth() + 1));
  }

  notExpired(date) {
    return new Date(date) > this.currentDate;
  }

  declarationClickHandler() {
    this.router.navigate(['/contributor/disclosure/edit']);
  }

  resendInvitationClickHandler(invitation) {
    this.selectedInvitation = invitation;
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm',
        content: 'Are you sure you wish to resend this invitation?',
        actions: [ActionType.Confirmation, ActionType.Cancel]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      ref.close();
      if (result === ActionType.Confirmation) {
        this.resendInvitation(this.selectedInvitation);
      }
    });
  }

  resendInvitation(invitation) {
    invitation.expiryDate = this.invitationExpiryDate();
    this.sendInvite(invitation);
    this.invitationService.save(invitation).subscribe(data => {
      // this.notificationsService.success('Success', 'Invitation has been resent');
    });
  }

  cancelInvitationClickHandler(invitation) {
    this.selectedInvitation = invitation;
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm',
        content: 'Are you sure you wish to cancel this invitation?',
        actions: [ActionType.Confirmation, ActionType.Cancel]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      ref.close();
      if (result === ActionType.Confirmation) {
        this.cancelInvitation(this.selectedInvitation);
      }
    });
  }

  cancelInvitation(invitation) {
    invitation.status = 'deleted';
    this.invitationService.save(invitation).subscribe(data => {
      this.notificationsService.success('Success', 'Invitation has been canceled');
      this.ngOnInit();
    });
  }
}
