import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {Role} from '../models/role';
import {ActivityStatus} from '../models/activity-status';
import {PermissionService} from '../services/permission.service';
import {Exam} from '../models/exam';
import {some} from 'lodash';

@Directive({
  selector: '[appPermissionCheck]'
})
export class PermissionCheckDirective {
  // Usage: <app-component *appPermissionCheck="AccountPermissionType.Something"></app-component>

  constructor(private templateRef: TemplateRef<any>, public viewContainer: ViewContainerRef, private permissionService: PermissionService) {
  }

  @Input() set appPermissionCheck(data: { allowedRoles: Role[], disallowedRoles: Role[], excludeSuperUser: boolean, debug: boolean }) {
    if (this.hasPermission(data)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  hasPermission(data: { allowedRoles: Role[], disallowedRoles: Role[], exam?: Exam, debug: boolean }): boolean {
    const isUserInDisallowedRoles = data.disallowedRoles != null && some(data.disallowedRoles.map(r => this.permissionService.hasRole(r)));
    let isUserInAllowedRoles = data.allowedRoles == null || some(data.allowedRoles.map(r => this.permissionService.hasRole(r)));

    if (data.debug) {
      console.log('inDisallowedRoles? ', isUserInDisallowedRoles, ' | inAllowedRoles? ', isUserInAllowedRoles);
    }

      // if this is published then only the superadmin and planner
    if (data.exam && data.exam.status === ActivityStatus.Published) {
        isUserInAllowedRoles = some([Role.SuperAdmin, Role.Planner].map(r => this.permissionService.hasRole(r)));
    }

    return !isUserInDisallowedRoles && isUserInAllowedRoles;
  }
}
