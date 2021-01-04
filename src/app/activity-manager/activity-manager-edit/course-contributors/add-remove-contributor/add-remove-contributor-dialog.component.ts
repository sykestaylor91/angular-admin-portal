import {UserService} from '../../../../shared/services/user.service';
import {Component, Inject, OnInit, EventEmitter} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {User} from '../../../../shared/models/user';
import {ContributorDialog} from '../../../../shared/models/dialog-config';
import {Author, Exam} from '../../../../shared/models/exam';
import {Role} from '../../../../shared/models/role';
import {NewAuthorEvent} from '../new-author-event';
import {cloneDeep} from 'lodash';
import {finalize} from 'rxjs/operators';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-add-remove-contributor-dialog',
  styleUrls: ['./add-remove-contributor-dialog.component.scss'],
  templateUrl: 'add-remove-contributor-dialog.component.html'
})
export class AddRemoveContributorDialogComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  authors: Author[] = [];
  selectedExam: Exam;
  showLoading: boolean = true;
  authorAdded: NewAuthorEvent[] = [];
  authorChange = new EventEmitter();
  Role = Role;

  constructor(private dialogRef: MatDialogRef<AddRemoveContributorDialogComponent>,
              private userService: UserService,
              private notificationsService: NotificationsService,
              @Inject(MAT_DIALOG_DATA) public data: ContributorDialog) {
  }

  ngOnInit() {
    this.data.authors = this.data.authors || [];
    this.selectedExam = this.data;
    this.authors = cloneDeep(this.data.authors);
    this.userService.query()
      .pipe(finalize(() => this.showLoading = false))
      .subscribe(users => {
        if (users && users.length > 0) {
           this.users = users;
          if (this.data.authors.length > 0) {
            this.filteredUsers = users.filter(user => this.data.authors.findIndex(author => author.id === user.id) === -1);
          } else {
            this.filteredUsers = users;
          }
        }
      });
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  onAuthorAdded(authorEvent: NewAuthorEvent) {
    const matchingAuthor = this.authors.find((a) => a.id === authorEvent.author.id);
    if (!matchingAuthor) {
      // this.authorsChanged = true;
      this.authors.push(authorEvent.author);
      // this.authorsAdded.push(authorEvent);
      // Angular won't update the list unless the array reference changes
      this.authors = this.authors.slice();
      this.filteredUsers = this.users.filter(user => this.data.authors.findIndex(author => author.id === user.id) === -1);
      this.filteredUsers = this.filteredUsers.slice();
      this.authorChange.emit({authors: this.authors, authorAdded: authorEvent});
    }
  }

  onAuthorRemoved(author: Author) {
    // this.authorsChanged = true;
    this.authors = this.authors.filter(item => item.id !== author.id);
    this.authors = this.authors.slice();
    this.filteredUsers = this.users.filter(user => this.authors.findIndex(authorItem => authorItem.id === user.id) === -1);
    this.filteredUsers = this.filteredUsers.slice();
    this.notificationsService.info('The contributor has been removed from the activity team.');
    this.authorChange.emit({authors: this.authors, authorAdded: null});

  }

}
