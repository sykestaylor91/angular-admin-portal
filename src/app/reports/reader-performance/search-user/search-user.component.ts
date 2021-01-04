import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {UserService} from '../../../shared/services/user.service';
import {ReaderPerformanceService} from '../reader-performance.service';
import {User} from '../../../shared/models/user';
import {NotificationsService} from 'angular2-notifications';
import {SessionService} from '../../../shared/services/session.service';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html'
})
export class ReaderPerformanceSearchUserComponent implements OnInit {
  title: string = 'Search user';
  searchTerm: string;
  search: string;
  users: User[];

  @Output() searchDestroy = new EventEmitter();

  constructor(private sessionService: SessionService,
              private userService: UserService,
              private notificationsService: NotificationsService,
              private readerPerformanceService: ReaderPerformanceService) {
  }

  ngOnInit() {
    console.log(`Current user is ${this.sessionService.loggedInUser.id}`);
  }

  getUsers() {
    this.users = [];
    this.userService.query().subscribe(data => {
      data.forEach( userRecord => {
        if (JSON.stringify(userRecord).includes(this.searchTerm)) {
           this.users.push(userRecord);
        }
      });

      this.readerPerformanceService.setUserResults(this.users);
    });
  }


  submitQuery() {
    this.readerPerformanceService.userResults = null;
    this.readerPerformanceService.selectedUser = null;
    this.readerPerformanceService.selectedUserExam = null;
    this.readerPerformanceService.userExams = null;
    this.searchDestroy.emit(null);
    if (this.searchTerm) {
      this.getUsers();
    } else {
      this.notificationsService.error('No search term', 'Please input a search term and try again');
    }
  }
}
