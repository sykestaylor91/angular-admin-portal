import {Component, OnInit} from '@angular/core';
import {SessionService} from '../shared/services/session.service';
import {User} from '../shared/models/user';
import {Router} from '@angular/router';
import {Role} from '../shared/models/role';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  notificationsCount: number = 0;
  notifications: any = [];
  user: User;
  title = 'Home';
  showNotifications: boolean = false;

  User = User;
  Role = Role;

  constructor(private router: Router,
              public sessionService: SessionService) {
    this.sessionService.sessionUser.subscribe((sessionUser: User) => {
      this.user = sessionUser;
    });
  }

  ngOnInit() {
  }

  myAccountNavigate() {
    if (this.user.roles.indexOf(Role.Reader) > -1) {
      this.router.navigate(['/reader/account-ledger']);
    }
  }

  showNotificationsClickHandler() {
    this.showNotifications = !this.showNotifications;
  }

  notificationCount(event) {
    if (event && event > 0) {
      this.notificationsCount = event;
    }
  }
}
