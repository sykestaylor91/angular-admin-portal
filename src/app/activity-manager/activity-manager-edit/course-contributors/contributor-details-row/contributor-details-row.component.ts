import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {User} from '../../../../shared/models/user';
import {Role, RoleHierarchy} from '../../../../shared/models/role';
import {Author, ContributorInviteStatus, Exam} from '../../../../shared/models/exam';
import {NewAuthorEvent} from '../new-author-event';
import {SessionService} from '../../../../shared/services/session.service';
import {PermissionService} from '../../../../shared/services/permission.service';
import {startCase} from 'lodash';

@Component({
  selector: 'app-contributor-details-row',
  templateUrl: 'contributor-details-row.component.html'
})
export class ContributorDetailsRowComponent implements OnInit {
  @Input() selectedExam: Exam;
  @Input() focusedContributor: User;
  @Input() contributor: User;
  @Output() newAuthorSelected = new EventEmitter<NewAuthorEvent>();

  selectedRole: Role = Role.Author;
  Role = Role;
  startCase = startCase;
  userRoles: Role[] = [];

  constructor(private sessionService: SessionService,
              private permissionService: PermissionService) {

  }

  ngOnInit() {
    const highestRoleIndex = RoleHierarchy.indexOf(this.permissionService.getHighestRole(this.sessionService.loggedInUser, this.selectedExam));
    this.userRoles = RoleHierarchy.filter(r => RoleHierarchy.indexOf(r) <= highestRoleIndex).reverse();
  }

  addToTeam() {
    // TODO: Make sure you cannot select 'add to team' without a valid role selected...
    const newAuthor: Author = {id: this.contributor.id, role: this.selectedRole, invited: new Date(), status: ContributorInviteStatus.Invited};
    this.newAuthorSelected.emit({author: newAuthor, user: this.contributor});
    // this.notificationsService.success('Contributor Added', 'The contributor has been added to this activity');
  }
}
