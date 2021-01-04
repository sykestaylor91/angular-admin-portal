import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SessionService} from '../../shared/services/session.service';
import {UserService} from '../../shared/services/user.service';
import {CredentialService} from '../../shared/services/credential.service';
import {Credential} from '../../shared/models/credential';
import {NotificationsService} from 'angular2-notifications';
import {DialogActionsComponent} from '../../shared/dialog/dialog-actions/dialog-actions.component';
import DialogConfig from '../../shared/models/dialog-config';
import {ActionType} from '../../shared/models/action-type';
import { MatDialog } from '@angular/material/dialog';
import {User} from '../../shared/models/user';
import { Column, ColumnType } from '../../shared/models/column';
import {ContextMenuItems} from '../../shared/models/context-menu-items';

@Component({
  selector: 'app-credentials',
  templateUrl: 'credentials.component.html'
})
export class CredentialsComponent implements OnInit {
  author: any;
  credentials: Credential[];
  showEditCredential: boolean = false;
  private dateOfLastUpdate: any;
  private deleteCredential: Credential;
  columnsCredentialDisclosures: Column[];
  User = User;
  contextMenuItems: string[] = [ContextMenuItems.Edit, ContextMenuItems.Delete];
  constructor(public sessionService: SessionService,
              private notificationsService: NotificationsService,
              private credentialService: CredentialService,
              private userService: UserService,
              private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit() {
    if (this.sessionService.loggedInUser) {
      this.author = this.sessionService.loggedInUser; // current user
    } else {
      this.author = {'firstName': ' ', 'lastName': ' '};
      console.error('Cant get current user');
    }
    this.getCredentials();
    this.columnsCredentialDisclosures = [
      {
        type: ColumnType.Text,
        field: 'university',
        width: '25%',
        title: 'University or awarding institution'
      },
      {
        type: ColumnType.Text,
        field: 'subject',
        width: '25%',
        title: 'Major subject or speciality'
      },
      {
        type: ColumnType.Text,
        field: 'postNominalLetters',
        width: '25%',
        title: 'Post nominal letters awarded'
      },
      {
        type: ColumnType.Text,
        field: 'yearAttained',
        width: '25%',
        title: 'Year Attained'
      }
    ];
  }

  getCredentials() {
    this.credentialService.findByUserId(this.author.id, false)
      .subscribe(credentials => {
        credentials.forEach((credential) => {
          this.dateOfLastUpdate = credentials[0].lastUpdated;
          if (credential.lastUpdated > this.dateOfLastUpdate) {
            this.dateOfLastUpdate = credential.lastUpdated;
          }
        });
        this.credentials = credentials;
      });
  }

  editCredentialClickHandler(credential) { // 'edit button' pressed
    this.credentialService.selectedCredential = credential;
    this.showEditCredential = true;
  }

  deleteCredentialClickHandler(credential) {
    this.showConfirmModal(credential);
  }

  showConfirmModal(credential) {
    this.deleteCredential = credential;
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm',
        content: 'Are you sure you wish to delete this credential?',
        actions: [ActionType.Confirmation, ActionType.Cancel]
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      if (result === ActionType.Confirmation) {
        this.handleConfirmationResponse(result);
      }
      ref.close();
    });
  }

  handleConfirmationResponse(response) {
    if (response) {
      this.credentialService.remove(this.deleteCredential).subscribe(data => {
        this.notificationsService.success('Success', 'Credential deleted successfully');
        this.getCredentials(); // refresh the credentials table
      });
    }
    this.deleteCredential = null;
  }

  onCancel(event) {
    this.showEditCredential = false;
  }

  onSaved(event) {
    this.showEditCredential = false;
    this.ngOnInit();
  }

  showEditCredentialClickHandler() { // 'add another' button pressed
    this.showEditCredential = true;
  }

  finishClickHandler() {
    this.sessionService.loggedInUser.credentialDeclarationUpdate = this.getDeclarationDate();
    this.userService.save(this.sessionService.loggedInUser).subscribe(data => {
    });
    this.router.navigate(['/']);
    this.notificationsService.success('Credentials Saved', 'Your credentials have been saved');
  }

  getDeclarationDate() {
    const expirationDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
    return expirationDate.toString();
  }
}
