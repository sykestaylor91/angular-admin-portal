import {Injectable} from '@angular/core';
import {User} from '../../shared/models/user';
import {UserExam} from '../../shared/models/user-exam';

@Injectable()
export class ReaderPerformanceService {
  // Observable string sources
  public selectedUser: User;
  public userResults: User[];
  public selectedUserExam: UserExam;
  public userExam: UserExam;
  public userExams: UserExam[];


  setSelectedUser(user: User) {
    this.selectedUser = user;
  }

  setUserResults(users: User[]) {
    this.userResults = users;
  }

  setSelectedUserExam(userExam: UserExam) {
    this.selectedUserExam = userExam;
  }

  setUserExams(exams: UserExam[]) {
    this.userExams = exams;
  }
}
