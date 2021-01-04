import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {SessionService} from './shared/services/session.service';
import {Role} from './shared/models/role';
import {UrlSegment} from '@angular/router';

@Injectable()
export class AppRoleGuardService implements CanActivate {

  constructor(private sessionService: SessionService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // unless otherwise specified all roles but Reader is allowed
    const allowedRoles = (route.data && route.data['roles']) || [Role.Provider, Role.Reviewer, Role.SuperAdmin, Role.Admin,
      Role.Editor, Role.EditorHelper, Role.MediaAdmin, Role.Author, Role.Helper, Role.MediaHelper, Role.Planner,
      Role.Publisher];
    if (!this.sessionService.loggedInUser || !this.sessionService.loggedInUser.roles || this.sessionService.loggedInUser.roles.length === 0) {
      return false;
    } else {
      return this.checkRole(allowedRoles, this.sessionService.loggedInUser.roles, route.url);
    }
  }

  private checkRole(userRoles: Role[], roles: Role[], route: UrlSegment[]): boolean {
    if (this.sessionService.containsAnyRole(userRoles, roles)) {
      return true;
    } else {
      console.warn('User is not allowed to access route', route);
    }
  }


}
