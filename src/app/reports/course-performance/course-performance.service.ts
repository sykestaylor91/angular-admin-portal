import {Injectable} from '@angular/core';
import {User} from '../../shared/models/user';
import {UserExam} from '../../shared/models/user-exam';
import {Exam} from '../../shared/models/exam';

@Injectable()
export class CoursePerformanceService {
  // Observable string sources
  public selectedUser: User;
  public userResults: User;
  public selectedUserExam: UserExam;
  public userExam: UserExam;
  public userExams: UserExam;
  public selectedExam: Exam;
  public questionStatistics: Array<any> = [];
  public evaluationReport: any = [];

  setSelectedUser(user: User) {
    this.selectedUser = user;
  }

  setUserResults(user: User) {
    this.userResults = user;
  }

  setSelectedUserExam(userExam: UserExam) {
    this.selectedUserExam = userExam;
  }

  setUserExams(exams: UserExam) {
    this.userExams = exams;
  }

  setSelectedExam(exam: Exam) {
    this.selectedExam = exam;
  }
}
