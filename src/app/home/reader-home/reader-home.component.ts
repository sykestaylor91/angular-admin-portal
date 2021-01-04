import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../shared/services/session.service';
import {User} from '../../shared/models/user';

@Component({
  selector: 'app-reader-home',
  templateUrl: './reader-home.component.html'
})
export class ReaderHomeComponent implements OnInit {
  notifications: any = [];
  user;
  title = 'Home';

  constructor(public sessionService: SessionService) {
    this.sessionService.sessionUser.subscribe((sessionUser: User) => {
      this.user = sessionUser;
    });
  }

  ngOnInit() {
  }

}
