import {Component, Input, OnInit} from '@angular/core';
import {ProviderOrgService} from '../../shared/services/provider-org.service';
import {MenuModel, MenuItems} from './menu-items';
import {SessionService} from '../../shared/services/session.service';
import {User} from '../../shared/models/user';

@Component({
  selector: 'app-side-nav',
  templateUrl: 'side-nav.component.html'
})
export class SideNavComponent implements OnInit {
  @Input() sidenav: any;
  menuItems: MenuModel[] = [];

  constructor(public providerOrgService: ProviderOrgService,
              private sessionService: SessionService) {
    this.sessionService.sessionUser.subscribe((user: User) => {
      this.menuItems = MenuItems.filter((route: MenuModel) => {
        // TODO: move all permissions logic to the permissions service and check directive
        return this.sessionService.userIsInPermission(route.permissions);
      });
    });
  }

  ngOnInit() {
  }

    // TODO: move all permissions logic to the permissions service and check directive
  hasPermission(route) {
    const userRoles = this.sessionService.loggedInUser.roles;
    const requiredRoles = route.permissions;
    if (userRoles && userRoles.length > 0) {
      if (requiredRoles.length > 0) {
        return this.sessionService.containsAnyRole(userRoles, requiredRoles);
      } else {
        // If no roles are specified in menu-items.ts
        return true;
      }
    } else {
      return false;
    }
  }

}
