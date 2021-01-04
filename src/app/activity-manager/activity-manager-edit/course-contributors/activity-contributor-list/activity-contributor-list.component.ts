import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../../shared/models/user';
import { GridTableConfig } from '../../../../shared/grid-table/grid-table.config';
import { NewAuthorEvent } from '../new-author-event';
import { Role, RoleHierarchy } from '../../../../shared/models/role';
import { startCase } from 'lodash';
import { Column, ColumnType } from '../../../../shared/models/column';
import { FilterList } from '../../../../shared/models/filter-list';
import { ContextMenuItems } from '../../../../shared/models/context-menu-items';
import { MatDialog } from '@angular/material/dialog';
import {PermissionService} from '../../../../shared/services/permission.service';
import {SessionService} from '../../../../shared/services/session.service';
import { Exam } from '../../../../shared/models/exam';

@Component({
  selector: 'app-activity-contributor-list',
  templateUrl: 'activity-contributor-list.component.html'
})
export class ActivityContributorListComponent implements OnInit {
  @Input() users: User[];
  @Input() selectedExam: Exam;
  filteredUsers: User[];
  filterTerm: string = '';
  selectedContributor: User = null;
  filterByRoleSelect: any = 'all';
  roles: string[];
  config: GridTableConfig = new GridTableConfig({ rowCount: 10, hasDetailsRow: true });
  @Output() authorAdded = new EventEmitter<NewAuthorEvent>();
  startCase = startCase;
  Role = Role;
  userRoles: Role[] = [];
  selectedItems;
  contextMenu: string[] = [ContextMenuItems.CustomMenu, ContextMenuItems.Delete];
  customMenuLabel = 'View disclosures';
  columns: Column[] = [
    {
      title: 'Invite',
      field: 'id',
      type: ColumnType.AlternativeForm,
      customLabel: 'Invite',
      width: '20%'
    },
    {
      title: 'Name',
      field: 'name',
      type: ColumnType.Text,
      width: '40%'
    },
    {
      title: 'Email address',
      field: 'email',
      type: ColumnType.Text,
      width: '20%'
    },
    {
      title: 'Disclosure renewal date',
      field: 'disclosureDeclarationUpdate',
      type: ColumnType.Date,
      width: '15%'
    }
  ];
  filterList: FilterList [] = [
    {
      label: 'Filter by role',
      options: this.roles
    }
  ];

  constructor(private dialog: MatDialog, private permissionService: PermissionService, private sessionService: SessionService) {
  }

  ngOnInit() {
    this.clearFilters();
    this.roles = Object.keys(Role).map(key => Role[key]);
    const highestRoleIndex = RoleHierarchy.indexOf(this.permissionService.getHighestRole(this.sessionService.loggedInUser, this.selectedExam));
    this.userRoles = RoleHierarchy.filter(r => RoleHierarchy.indexOf(r) <= highestRoleIndex).reverse();
  }

  updateFilteredItems(array) {
    this.filteredUsers = array;
    this.filteredUsers.forEach(value => value.name = value.firstName + ' ' + value.lastName);
  }

  clearFilters() {
    this.filterTerm = '';
    this.filteredUsers = this.users;
  }

  filterByRole(role) {
    if (role === 'all') {
      this.updateFilteredItems(this.users);
    } else {
      this.updateFilteredItems(this.users.filter(u => u.roles.indexOf(role) > -1));
    }
  }

  onRowClicked(row) {
    this.selectedContributor = row;
  }

  onNewAuthorSelected(authorEvent: NewAuthorEvent) {
    this.authorAdded.emit(authorEvent);
  }

}
