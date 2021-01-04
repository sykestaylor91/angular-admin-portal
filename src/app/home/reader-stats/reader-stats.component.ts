import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserExamService} from '../../shared/services/user-exam.service';
import Utilities from '../../shared/utilities';
import {ActivityStatus} from '../../shared/models/activity-status';
import {UserExam} from '../../shared/models/user-exam';
import {uniqBy} from 'lodash';
import {ExamType} from '../../shared/models/exam-type';
import {Exam} from '../../shared/models/exam';
import {ExamService} from '../../shared/services/exam.service';
import {SessionService} from '../../shared/services/session.service';
import {UserExamStatus} from '../../shared/models/user-exam-status';

@Component({
  selector: 'app-reader-stats',
  templateUrl: './reader-stats.component.html'
})
export class ReaderStatsComponent implements OnInit {
  userCoursesData: UserExam[] = [];
  userCoursesStarted: number = 0;
  userCoursesFinished: number = 0;
  userCertificatesGained: number = 0;
  averageScore: any;

  constructor(private router: Router,
              private userExamService: UserExamService,
              private examService: ExamService,
              private sessionService: SessionService) {
  }

  ngOnInit() {
    this.temporaryGetExams();
  }

  temporaryGetExams() {
    // WRONG!!!! -- Need concept of ownership
    this.examService.getExams(null, false).subscribe(exams => {
      exams.forEach(exam => {
        this.constructClosedCompletedExamLists(exam);
      });
    });
  }

  constructClosedCompletedExamLists(exam: Exam) {
    if (exam && exam.type !== ExamType.PostActivity && exam.status === ActivityStatus.Published) {
      this.userExamService.findByExamId(exam.id).subscribe((userExams: UserExam[]) => {
        if (userExams && userExams.length > 0) {
          const ownedExams = userExams.filter(e => this.sessionService.loggedInUser.id === e.userId);
          if (ownedExams.length > 0) {
            const all = this.userCoursesData.concat(ownedExams);
            this.getStats(all);
            ownedExams.forEach(userExam => {
              this.updateCertificateCount(exam, userExam);
            });
          }
        }
      });
    }
  }

  getStats(userExams: UserExam[]) {
    this.userCoursesData = userExams.sort(Utilities.dateSorter('dateCreated', 'desc'));
    this.userCoursesStarted = this.getCourseStarts();
    this.userCoursesFinished = this.getCourseFinishes();
    this.averageScore = this.calculateAverageAttemptScores();
  }

  getCourseStarts(): number {
    return this.userCoursesData.filter(e => e.status !== UserExamStatus.Open).length;
  }

  getCourseFinishes(): number {
    return this.getFinished(this.userCoursesData).length;
  }

  getFinished(exams: UserExam[]) {
    return exams.filter(e => [ UserExamStatus.Completed].indexOf(e.status) > -1);
  }

  calculateAverageAttemptScores() {
    let totalPercentage: number = 0;
    const finished = this.getFinished(this.userCoursesData).filter(e => e.score);
    finished.forEach(e => {
      totalPercentage += e.score;
    });
    if (finished.length > 0) {
      return (totalPercentage / (finished.length * 100)) * 100;
    } else {
      return 0;
    }
  }

  updateCertificateCount(exam: Exam, userExam: UserExam) {
    if (exam.certificate && userExam && parseFloat(userExam.numberOfCredits) > 0.0 && (userExam.status === UserExamStatus.Completed)) {
      this.userCertificatesGained++;
    }
  }

}
