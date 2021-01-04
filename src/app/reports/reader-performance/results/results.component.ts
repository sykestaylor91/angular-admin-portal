import {Component} from '@angular/core';

import {UserService} from '../../../shared/services/user.service';
import {UserExamService} from '../../../shared/services/user-exam.service';
import {ReaderPerformanceService} from '../reader-performance.service';
import {UserExam} from '../../../shared/models/user-exam';
import { ChosenUserIdService } from '../../../shared/services/chosen-user-id.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html'
})
export class ReaderPerformanceResultsComponent {
  title: string = 'Results';

  constructor(private userService: UserService,
              private userExamService: UserExamService,
              public readerPerformanceService: ReaderPerformanceService,
              private chosenUserIdService: ChosenUserIdService) {
  }

  selectedUserClickHandler(userId) {
    this.chosenUserIdService.changeMessage(userId);
    this.userService.findById(userId).subscribe(data => {
      this.readerPerformanceService.setSelectedUser(data);
    });
    this.userExamService.findByUserId(userId).subscribe((data: UserExam[]) => {
      const userExams = data.filter((ue: UserExam) => ue.status === 'completed');
      this.readerPerformanceService.setUserExams(userExams);
    });
  }
}
