import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Author} from '../../../../shared/models/exam';
import {UserService} from '../../../../shared/services/user.service';
import {ActionType} from '../../../../shared/models/action-type';
import {SessionService} from '../../../../shared/services/session.service';
import {GridTableConfig} from '../../../../shared/grid-table/grid-table.config';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {DialogActionsComponent} from '../../../../shared/dialog/dialog-actions/dialog-actions.component';
import DialogConfig from '../../../../shared/models/dialog-config';
import {User} from '../../../../shared/models/user';
import {Role} from '../../../../shared/models/role';
import {finalize} from 'rxjs/operators';
import {PermissionService} from '../../../../shared/services/permission.service';
import {startCase} from 'lodash';
import { Column, ColumnType } from '../../../../shared/models/column';
import {ContextMenuItems} from '../../../../shared/models/context-menu-items';

@Component({
  selector: 'app-activity-contributor-associations',
  templateUrl: './activity-contributor-associations.component.html',
  styleUrls: ['./activity-contributor-associations.component.scss']
})
export class ActivityContributorAssociationsComponent implements OnInit, OnChanges {
  @Input() authors: Author[];
  @Output() viewDisclosureClicked = new EventEmitter<any>();
  @Output() authorRemoved = new EventEmitter<Author>();
  contributorList: User[] = [];
  config: GridTableConfig = new GridTableConfig({rowCount: 10});
  showLoading: boolean = false;
  selectedItems;
  contextMenu: string[] = [ContextMenuItems.CustomMenu, ContextMenuItems.Delete];
  customMenuLabel = 'View disclosures';
  columns: Column[] = [
    {
      title: 'Name',
      width: '45%',
      field: 'name',
      type: ColumnType.Text
    },
    {
      title: 'Role',
      width: '20%',
      field: 'firstRole',
      type: ColumnType.Text
    },
    {
      title: 'Invite status',
      width: '10%',
      field: 'inviteStatus',
      type: ColumnType.Text
    },
    {
      title: 'Invited',
      width: '10%',
      field: 'invited',
      type: ColumnType.Date
    },
    {
      title: 'Accepted',
      width: '10%',
      field: 'accepted',
      type: ColumnType.Date
    }
  ];
  Role = Role;

  constructor(private router: Router,
              private dialog: MatDialog,
              private sessionService: SessionService,
              private notificationsService: NotificationsService,
              private userService: UserService,
              private permissionService: PermissionService) {
  }

  ngOnInit() {
    if (this.authors && this.authors.length > 0) {
      this.populateList();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.authors && !changes.authors.firstChange) {
      this.populateList();
    }
  }

  populateList() {
    this.showLoading = true;
    this.contributorList = [];

    if (this.authors && this.authors.length > 0) {
      const uniqueAuthorIds = this.authors.map(author => author.id);

      if (uniqueAuthorIds && uniqueAuthorIds.length > 0) {
        this.userService.findByIdArray(uniqueAuthorIds)
          .pipe(finalize(() => this.showLoading = false))
          .subscribe((users: User[]) => {
            users.forEach(user => {
              const author = this.authors.find(a => a.id === user.id);
              user.roles = [author.role];
              user['firstRole'] = startCase(this.permissionService.getHighestRoleForAuthors(user, this.authors));
              user['inviteStatus'] = author.status || 'unknown';
              user['invited'] = author.invited;
              user['accepted'] = author.accepted;
              user['name'] = user.firstName + ' ' + user.lastName;
              this.contributorList.push(user);
            });
          });
      } else {
        this.showLoading = false;
      }
    } else {
      this.showLoading = false;
    }
  }

  viewDisclosuresClickHandler(dummy?) {
    this.router.navigate(['/view-contributors'])
      .then(value => {
        if (value) {
          this.viewDisclosureClicked.emit();
        }
      });
  }

  onShowRemoveDialog(authorToRemove: User) {
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm',
        content: `Are you sure you wish to remove ${User.fullName(authorToRemove.firstName, authorToRemove.lastName)}?`,
        actions: [ActionType.Confirmation, ActionType.Cancel]
      }
    ));
    ref.componentInstance.dialogResult
      .subscribe(result => {
        if (result === ActionType.Confirmation) {
          this.authorRemoved.emit({id: authorToRemove.id});
          this.populateList();
        }
        ref.close();
      });
  }

}
