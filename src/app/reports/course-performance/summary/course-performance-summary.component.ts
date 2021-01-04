import {Component, Output, EventEmitter} from '@angular/core';

import {CoursePerformanceService} from '../course-performance.service';
import {UserExamService} from '../../../shared/services/user-exam.service';
import {UserService} from '../../../shared/services/user.service';
import {NotificationsService} from 'angular2-notifications';
import {CertificationService} from '../../../shared/services/certification.service';
import {QuestionService} from '../../../shared/services/question.service';
import {ResponseService} from '../../../shared/services/response.service';
import {UserExam} from '../../../shared/models/user-exam';
import {User} from '../../../shared/models/user';
import {UserExamStatus} from '../../../shared/models/user-exam-status';

@Component({
  selector: 'app-summary',
  templateUrl: './course-performance-summary.component.html'
})
export class CoursePerformanceSummaryComponent {
  title: string = 'Summary';
  chartOptions: any;
  courseTitle: string;
  courseSubTitle: string;
  courseEditors: User[] = [];
  courseFileDate: Date;
  courseDate: Date;
  expirationDate: Date;
  usersStarted: number;
  usersCompleted: number;
  certificatesClaimed: number;
  averageFirstAttemptScore: number;
  providerAverageFirstAttempt: number;
  averageScoreChartData: any;
  usersFinishedChartData: any;
  showCharts: boolean = false;
  passRate: number;
  passRateChartData: any;
  usersCompletedAverage: number;
  questionResponseArray: any = {};
  userScoreArray: any = {};
  cronbach: string = '0';
  standardDeviation: any;
  standardErrorOfTheMean: string = '0';

  User = User;

  @Output() loadQuestionResponses = new EventEmitter();

  constructor(private userExamService: UserExamService,
              private certificationService: CertificationService,
              public coursePerformanceService: CoursePerformanceService,
              private notificationsService: NotificationsService,
              private questionService: QuestionService,
              private responseService: ResponseService,
              private userService: UserService) {
  }

  async getSummaryData() {
    this.courseEditors = [];
    if (this.coursePerformanceService.selectedExam) {
      this.courseTitle = this.coursePerformanceService.selectedExam.title;
      this.courseSubTitle = this.coursePerformanceService.selectedExam.subtitle;

      const authors = this.coursePerformanceService.selectedExam.authors || [];
      authors.forEach(author => {
        this.userService.findById(author.id).subscribe(data => {
          this.courseEditors.push(data);
        });
      });
      // TODO: maybe fetch all user exams in the first call then use those results in our first loop
      // TODO: simplify nonsensical logic. Three nested service calls is ridiculous
      this.userExamService.findByExamId(this.coursePerformanceService.selectedExam.id).subscribe(userExams => {
        this.certificationService.query().subscribe(certificates => {
          this.userExamService.queryAll().subscribe(allUserExams => {
            this.constructSummaryData(userExams, certificates, allUserExams);
            this.showCharts = true;
            this.loadQuestionResponses.emit(null);
          });
        });
      });

      this.getCronbachData();


    } else {
      this.notificationsService.error('No exam found', 'Check for errors or select a course from the dropdown list');
    }
  }

  constructSummaryData(userExams, certificates, allUserExams) {
    this.usersStarted = this.countUniqueUsers(userExams);
    this.courseDate = this.coursePerformanceService.selectedExam.dateCreated;
    this.expirationDate = this.coursePerformanceService.selectedExam.plannedExpireDate;
    this.courseFileDate = this.coursePerformanceService.selectedExam.plannedPublicationDate;
    this.usersCompleted = this.countUsersCompleted(userExams);
    this.certificatesClaimed = this.countCertificates(userExams, certificates);
    this.averageFirstAttemptScore = this.calculateAverageFirstAttemptScores(userExams);
    this.providerAverageFirstAttempt = this.calculateProviderAverageFirstAttempt(allUserExams);
    this.passRate = this.calculatePassRate(userExams);
    if (this.usersStarted > 0 && this.usersCompleted > 0) {
      this.usersCompletedAverage = Math.round(this.usersCompleted / this.usersStarted * 100);
    } else {
      this.usersCompletedAverage = 0;
    }
    const averageFirstAttemptRemainder = 100 - this.averageFirstAttemptScore;
    const passRateRemainder = 100 - this.passRate;
    const usersCompletedRemainder = 100 - this.usersCompletedAverage;

    this.averageScoreChartData = {
      labels: ['Average Score', ' '],
      datasets: [
        {
          data: [
            this.averageFirstAttemptScore,
            averageFirstAttemptRemainder
          ],
          backgroundColor: [
            '#fbc895',
            '#ffffff'
          ],
          hoverBackgroundColor: [
            '#FFAD60',
            '#ffffff'
          ]
        }
      ]
    };

    this.passRateChartData = {
      labels: ['Average Score', ' '],
      datasets: [
        {
          data: [
            this.passRate,
            passRateRemainder
          ],
          backgroundColor: [
            '#fbc895',
            '#ffffff'
          ],
          hoverBackgroundColor: [
            '#FFAD60',
            '#ffffff'
          ]
        }
      ]
    };

    this.usersFinishedChartData = {
      labels: ['Users Finished', 'Users Started'],
      datasets: [
        {
          data: [
            this.usersCompletedAverage,
            usersCompletedRemainder
          ],
          backgroundColor: [
            '#fbc895',
            '#ffffff'
          ],
          hoverBackgroundColor: [
            '#FFAD60',
            '#ffffff'
          ]
        }
      ]
    };
  }

  calculatePassRate(userExams) {
    const that = this;
    const uniqueUsers: string[] = [];
    let numberPassed = 0;
    userExams.forEach(userExam => {
      if (uniqueUsers.indexOf(userExam.userId) === -1) {
        // element doesn't exist in array
        uniqueUsers.push(userExam.userId);
        const scoreRate = 0;
        // if (userExam.questions && userExam.questions.length > 0) {
        //   scoreRate = userExam.score / (userExam.questions.length / 100);
        // }
        if (userExam.score > parseInt(that.coursePerformanceService.selectedExam.passRate, 10)) {
          numberPassed++;
        }
      }
    });

    return numberPassed / (uniqueUsers.length / 100);
  }

  countUniqueUsers(userExams) {
    const uniqueUsers: string[] = [];
    userExams.forEach(function (userExam) {
      if (uniqueUsers.indexOf(userExam.userId) === -1) {
        // element doesn't exist in array
        uniqueUsers.push(userExam.userId);
      }
    });
    console.log(' **** uniqueUsers', uniqueUsers);
    return uniqueUsers.length;
  }

  countUsersCompleted(userExams) {
    const completedUsers: string[] = [];
    userExams.forEach(function (userExam) {
      if (userExam.status === UserExamStatus.Completed) {
        if (completedUsers.indexOf(userExam.userId) === -1) {
          // element doesn't exist in array
          completedUsers.push(userExam.userId);
        }
      }
    });
    return completedUsers.length;
  }

  countCertificates(userExams, certificates) {
    let gainedCertificates = 0;
    userExams.forEach(function (userExam) {
      certificates.forEach(function (certRecord) {
        certRecord.certificates.forEach(function (cert) {
          if (cert.userExamId === userExam.id) {
            gainedCertificates++;
          }
        });
      });
    });
    return gainedCertificates;
  }

  calculateAverageFirstAttemptScores(userExams) {
    const firstAttemptUserExams: UserExam[] = [];
    let scoreTotal = 0;

    userExams.forEach(userExam => {
      // element doesn't exist in array
      let found = false;
      firstAttemptUserExams.forEach(firstAttemptUserExam => {
        if (firstAttemptUserExam.examId === userExam.examId) {
          found = true;
          const t1 = new Date(firstAttemptUserExam.dateCreated).getTime();
          const t2 = new Date(userExam.dateCreated).getTime();
          if (t1 > t2) {
            firstAttemptUserExams[firstAttemptUserExams.indexOf(firstAttemptUserExam)] = userExam;
          }
        }
      });
      if (!found) {
        firstAttemptUserExams.push(userExam);
      }
    });
    firstAttemptUserExams.forEach(firstAttemptUserExam => {
      if (firstAttemptUserExam.score) {
        scoreTotal += firstAttemptUserExam.score;
      }
    });
    let avrScore = 0;
    console.log('*** acore total: ', scoreTotal);

    if (scoreTotal > 0 && firstAttemptUserExams && firstAttemptUserExams.length > 0) {
      avrScore = (scoreTotal / firstAttemptUserExams.length);
    }

    return avrScore;

   // return scoreTotal;
  }

  calculateProviderAverageFirstAttempt(userExams) {
    const firstAttemptUserExams: UserExam[] = [];
    let scoreTotal = 0;
    userExams.forEach(userExam => {
      // element doesn't exist in array
      let found = false;
      firstAttemptUserExams.forEach(firstAttemptUserExam => {
        if (firstAttemptUserExam.examId === userExam.examId && firstAttemptUserExam.userId === userExam.userId) {
          found = true;
          const t1 = new Date(firstAttemptUserExam.dateCreated).getTime();
          const t2 = new Date(userExam.dateCreated).getTime();
          if (t1 > t2) {
            firstAttemptUserExams[firstAttemptUserExams.indexOf(firstAttemptUserExam)] = userExam;
          }
        }
      });
      if (!found) {
        firstAttemptUserExams.push(userExam);
      }
    });

    let maxScore = 0;
    firstAttemptUserExams.forEach((firstAttemptUserExam) => {
      if (firstAttemptUserExam.score && !isNaN(firstAttemptUserExam.score)) {
        scoreTotal += Number.parseFloat(<any>firstAttemptUserExam.score);
      }
      if (firstAttemptUserExam.questions) {
        maxScore += firstAttemptUserExam.questions.length;
      }
    });
    if (scoreTotal > 0 && maxScore > 0) {
      return scoreTotal / maxScore;
    }
    return 0;
  }

 async getCronbachData() {
   this.userScoreArray = {};
   this.questionResponseArray = {};
      for (const question of Object.keys(this.coursePerformanceService.selectedExam.questions)) {
        await this.responseService.findByQuestionId(this.coursePerformanceService.selectedExam.questions[question])
          .toPromise()
          .then(responses => {
            responses.forEach(response => {
              // console.log('***** Response: ', response);
              // if we already have a value, only update if the response is newer for that user
              // console.log('***** this.questionResponseArray[response.questionId: ', this.questionResponseArray[response.questionId]);
              if (this.questionResponseArray[response.questionId]) {
                let userFound = 0;
                for (const property of Object.keys(this.questionResponseArray[response.questionId])) {
                  if (this.questionResponseArray[response.questionId][property].userId === response.userId && this.questionResponseArray[response.questionId][property].userId .dateCreated < response.dateCreated) {
                    this.questionResponseArray[response.questionId][property] = response;
                  }
                  if (this.questionResponseArray[response.questionId][property].userId === response.userId) {
                    userFound = 1;
                  }
                }
                if (!userFound) {
                  this.questionResponseArray[response.questionId].push(response);
                }
              } else {
                this.questionResponseArray[response.questionId] = [];
                this.questionResponseArray[response.questionId].push(response);
              }
              if (this.userScoreArray[response.userId]) {
                // TODO: remove old responses and only use the latest
                this.userScoreArray[response.userId].push((response.answerGiven[0] && response.answerGiven[0].index) ? response.answerGiven[0].index + 1 : 1); // set to one if index doesn't exist or is 0
              } else {
                this.userScoreArray[response.userId] = [];
                this.userScoreArray[response.userId].push((response.answerGiven[0] && response.answerGiven[0].index) ? response.answerGiven[0].index + 1 : 1); // set to one if index doesn't exist or is 0
              }
            });
            // console.log('***** this.questionResponseArray', this.questionResponseArray);
            if (parseInt(question, 10) === this.coursePerformanceService.selectedExam.questions.length - 1) {
              this.calculateCronbach();
            }
        });
      }
  }

  calculateCronbach() {
    // Cronbachs Alpha  =  (  Number of items   /    (Number of items - 1)  )  X  (Total of item variances -1) / Variance of total scores
    const itemCount = this.coursePerformanceService.selectedExam.questions.length,
      itemVariances = [],
      itemMeans = [];
    let totalOfItemVariances = 0;


    for (const property of Object.keys(this.questionResponseArray)) {
        const questionResponseValues = [];
        this.questionResponseArray[property].forEach(response => {
          questionResponseValues.push((response.answerGiven[0] && response.answerGiven[0].index) ? response.answerGiven[0].index + 1 : 1);
        });
      // console.log('**** Question response values ', questionResponseValues);

      itemVariances.push(this.varP(questionResponseValues, questionResponseValues.length, 4));
      itemMeans.push(this.getAverageFromNumArr(questionResponseValues, 4));
    }
    totalOfItemVariances = itemVariances.reduce((a, b) => a + b);

    // console.log('****itemVariances : ', itemVariances);
    // console.log('****itemMeans : ', itemMeans);
    // console.log('**** totalOfItemVariances:', totalOfItemVariances);

    let scores = [],
    sumOfVarianceOfTotalScores = 0;
    for (const property of Object.keys(this.userScoreArray)) {
      scores = scores.concat(this.userScoreArray[property]);
      // console.log('****this.userScoreArray[property] : ', this.userScoreArray[property]);
      // console.log('****this.userScoreArray[property] avg : ', this.getAverageFromNumArr(this.userScoreArray[property], 4));
      // console.log('****this.userScoreArray[property] variance : ', this.getVariance(this.userScoreArray[property], 4));

      sumOfVarianceOfTotalScores +=  (this.userScoreArray[property].length === 1) ? 0 : this.getVariance(this.userScoreArray[property], 4);
    }

    console.log('**** Cronbach\'s Alpha  =  (  Number of items   /    (Number of items - 1)  )  X  ( 1 - (Total of item variances / sumOfVarianceOfTotalScores))');
    console.log('**** Number of items ', itemCount);
    console.log('**** totalOfItemVariances ', totalOfItemVariances);
    console.log('**** sumOfVarianceOfTotalScores ', sumOfVarianceOfTotalScores);

    const firstOperand = (itemCount / (itemCount - 1));
    console.log('**** (  Number of items   /    (Number of items - 1)  ) =', firstOperand);

    const secondOperand = (1 - (totalOfItemVariances  / sumOfVarianceOfTotalScores));
    console.log('**** (1 - (totalOfItemVariances  / sumOfVarianceOfTotalScores)) = ', secondOperand);

    const alpha = firstOperand * secondOperand;
    console.log('**** Cronbach\'s alpha: ', alpha);
    // console.log('**** scores: ', scores);

    this.cronbach = this.getNumWithSetDec(alpha, 2).toString();
    this.standardDeviation =  this.getNumWithSetDec(this.getStandardDeviation(scores, 4), 2).toString();
    this.standardErrorOfTheMean = this.getNumWithSetDec(this.standardDeviation / Math.sqrt(scores.length), 2).toString();
  }

  isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  getNumWithSetDec(num, numOfDec) {
    const pow10s = Math.pow(10, numOfDec || 0);
    return (numOfDec) ? Math.round(pow10s * num) / pow10s : num;
  }

  getAverageFromNumArr(numArr, numOfDec) {
    if (!this.isArray(numArr)) {
      console.warn('**** wrong type supplied to getAverage. Returning 1');
      return 1;
    }
    if (numArr.length === 1) {

      return numArr[0];
    }
    let i = numArr.length,
      sum = 0;

    while (i--) {
      sum += numArr[i];
    }
    return this.getNumWithSetDec((sum / numArr.length), numOfDec);
  }

  getVariance(numArr, numOfDec) {
    if (numArr.length === 1) {
      console.warn('**** single item array sent to getVariance. Returning 1');
      return 1;
    }
    if (!this.isArray(numArr)) {
      console.warn('**** wrong type supplied to getVariance. Returning 1');
      return 1;
    }
    // console.log('**** getVariance ', numArr);
    const avg = this.getAverageFromNumArr(numArr, numOfDec);
    let i = numArr.length,
      v = 0;
    // console.log('**** getAVERAGE ', avg);

    while (i--) {
      v += Math.pow((numArr[i] - avg), 2);
    }
    v /= numArr.length;
    // console.log('**** v /= numArrlength ', v);

    return this.getNumWithSetDec(v, numOfDec);
  }

  varP(scoreArray, numOfItems, numOfDec) {
    if (scoreArray.length === 1) {
      console.warn('**** single item array sent to varP. Returning 1');
      return 1;
    }
    if (!this.isArray(scoreArray)) {
      console.warn('**** wrong type supplied to varP. Returning 1');
      return 1;
    }
    // console.log('**** getVarianceP ', scoreArray);
    const avg = this.getAverageFromNumArr(scoreArray, numOfDec);
    let i = scoreArray.length,
      v = 0;
    // console.log('**** getAVERAGEP ', avg);

    while (i--) {
      v += Math.pow((scoreArray[i] - avg), 2);
    }
    // if (v === 0) {
    //   v = 1;
    // }
    v /= numOfItems;
    // console.log('**** numOfItems', numOfItems);
    // console.log('**** v /= numArrlength  varP', v);

    return this.getNumWithSetDec(v, numOfDec);
  }

  getStandardDeviation(numArr, numOfDec) {
    const stdDev = Math.sqrt(this.getVariance(numArr, numOfDec));

    return this.getNumWithSetDec(stdDev, numOfDec);
  }
}
