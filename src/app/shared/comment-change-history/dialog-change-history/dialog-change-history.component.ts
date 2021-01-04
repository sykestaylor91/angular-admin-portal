import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {ChangeHistory} from '../../models/change-history';
import {ChangeHistoryService} from '../../services/change-history.service';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ActivityChangeHistoryDialog} from '../../models/dialog-config';
import {PermissionService} from '../../services/permission.service';
import {ChangeHistoryPermissions, ContentPermissions} from '../../models/action-permissions';
import {SessionService} from '../../services/session.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-dialog-change-history',
  templateUrl: './dialog-change-history.component.html',
  styleUrls: ['./dialog-change-history.component.scss']
})
export class DialogChangeHistoryComponent implements OnInit {
  @Output() useThisVersionClicked = new EventEmitter<string>();
  showLoading: boolean = true;
  items: ChangeHistory[] = [];
  permissions: ChangeHistoryPermissions;

  get hasItems(): boolean {
    return this.items && this.items.length > 0;
  }

  constructor(private changeHistoryService: ChangeHistoryService,
              private sessionService: SessionService,
              private permissionService: PermissionService,
              @Inject(MAT_DIALOG_DATA) public data: ActivityChangeHistoryDialog) {
  }

  ngOnInit() {
    if (this.data.unsavedChange) {
      this.items.unshift(this.data.unsavedChange);
    }
    this.changeHistoryService.findByKey(`${this.data.resource.id}:${this.data.resourceElement}`)
      .pipe(
        finalize(() => this.data.showLoading = false)
      )
      .subscribe(changeHistory => {
        this.permissionService.filterChangeHistoryForUser(changeHistory, this.data.resource).then(changes => {
          this.items = changes;
          if (this.data.unsavedChange) {
            this.items.unshift(this.data.unsavedChange);
          }
        });
      });

    this.permissions = this.permissionService.getBestChangeHistoryPermissions(this.data.resource);
    // if (this.hasLocalChanges) {
    // If we wanted we can could track local changes as well... although not entirely sure this is necessary at all...
    // }
  }

  canSelectVersion(index: any) {
    return (this.permissions.selectVersion === ContentPermissions.all)
      || (this.permissions.selectVersion === ContentPermissions.own && this.items[index].userId === this.sessionService.loggedInUser.id);
  }

  onUseThisVersionClicked(index: any) {
    this.useThisVersionClicked.emit(this.items[index].value);
  }
}
