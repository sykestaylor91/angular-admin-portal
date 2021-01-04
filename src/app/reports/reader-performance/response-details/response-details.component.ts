import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from '../../../shared/services/question.service';
import { ResponseService } from '../../../shared/services/response.service';
import { ReaderPerformanceService } from '../reader-performance.service';
import { Exam } from '../../../shared/models/exam';
import { Response } from '../../../shared/models/response';
import { Column, ColumnType } from '../../../shared/models/column';
import { ChosenActivityService } from '../../../shared/services/chosen-activity.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-response-details',
  templateUrl: './response-details.component.html'
})
export class ReaderPerformanceResponseDetailsComponent implements OnDestroy, OnInit {
  title: string = 'Response Details';
  userId: string;
  selectedExam: Exam;
  csvContent: string;
  responseDetails: any[] = [];
  columnsResponses: Column[];
  subscriptionCas: Subscription;
  userExamQuestions: any;
  chosenActivity: any;

  constructor(private questionService: QuestionService,
    private responseService: ResponseService,
    private readerPerformanceService: ReaderPerformanceService,
    private chosenActivityService: ChosenActivityService,
    private router: Router) {
  }

  ngOnInit() {
    this.subscriptionCas = this.chosenActivityService.currentMessage.subscribe(async chosenActivity => {
      if (chosenActivity.length > 0) {
        this.chosenActivity = JSON.parse(chosenActivity);
        // now get the questions of this exam
        this.userExamQuestions = await this.questionService.queryByExam(this.chosenActivity.id);
      }
    });
    this.columnsResponses = [
      {
        type: ColumnType.Text,
        field: 'questionNumber',
        width: '10%',
        title: 'Question Number'
      },
      {
        type: ColumnType.FirstNWordsStripTags,
        field: 'stat.questionText',
        width: '40%',
        title: 'First 6 Words of Question',
        limit: 6
      },
      {
        type: ColumnType.Date,
        field: 'stat.dateTimeAnswered',
        width: '16%',
        title: 'Date & Time First Answered'
      },
      {
        type: ColumnType.StripTags,
        field: 'stat.firstAttempt',
        width: '16%',
        title: 'First Attempt Answer'
      },
      {
        type: ColumnType.Text,
        field: 'firstAttemptCorrect',
        width: '16%',
        title: 'First Attempt Correct'
      },
      {
        type: ColumnType.Text,
        field: 'answeredCorrectly',
        width: '16%',
        title: 'Was Right Answer Ever Given'
      },
      {
        type: ColumnType.Text,
        field: 'attempts',
        width: '16%',
        title: 'At What Attempt was Correct Answer Given'
      }
    ];
  }

  getSelectedExam() {
    this.responseDetails.length = 0;
    this.responseService.findByUserId(this.readerPerformanceService.selectedUser.id).subscribe(responseData => {
      this.readerPerformanceService.selectedUserExam.questions.forEach((question, index) => {
        this.questionService.findById(question).subscribe(questionData => {
          if (questionData.number === undefined || questionData.number === null) {
            questionData.number = (index + 1).toString(10);
          }
          this.constructResponseDetails(questionData, responseData);
        });
      });
    });
  }

  constructResponseDetails(questionData, responses) {
    const matches: Array<any> = this.getResponses(questionData.id, responses);
    this.responseDetails.push(this.createResponseDetails(questionData, matches));
  }

  createResponseDetails(question, responses) {
    const details = {
      questionNumber: question.number,
      questionText: question.question,
      dateTimeAnswered: <string>null,
      firstAttempt: <string>null,
      firstAttemptCorrect: <boolean>null,
      answeredCorrectly: <boolean>null,
      attempts: <number>null
    };
    const firstResponse: Response = this.getFirstResponse(responses);
    if (!firstResponse) {
      return details;
    }

    if (responses) {
      details.dateTimeAnswered = firstResponse.dateCreated.toString();
      details.firstAttempt = firstResponse.answerGiven && firstResponse.answerGiven.length > 0 ? firstResponse.answerGiven[0].text : '';
      details.firstAttemptCorrect = firstResponse.correct;
      details.answeredCorrectly = this.answeredCorrectly(responses);
      details.attempts = this.attemptsUntilCorrect(responses);
    }
    return details;
  }

  getResponses(questionId, responses): Array<any> {
    const matches: Array<any> = [];
    responses.forEach(function (response) {
      if (response.questionId !== questionId) {
        return;
      }

      matches.push(response);
    });
    return matches;
  }

  answeredCorrectly(responses) {
    for (let i = 0; i < responses.length; i++) {
      if (responses[i].status === 'correct') {
        return true;
      }
    }
    return false;
  }

  attemptsUntilCorrect(responses) {
    for (let i = 0; i < responses.length; i++) {
      if (responses[i].status === 'correct') {
        return i + 1;
      }
    }
    return null;
  }

  getFirstResponse(responses): Response {
    for (const response of responses) {
      if (response.firstResponse) {
        return response;
      }
    }
    return null;
  }

  ngOnDestroy() {
    // INFO: clear selected values
    this.readerPerformanceService.setSelectedUser(null);
    this.readerPerformanceService.setSelectedUserExam(null);
    this.readerPerformanceService.setUserExams(null);
    this.subscriptionCas.unsubscribe();
  }

  printReportCsv() {
    const array = this.responseDetails;
    // Use first element to choose the keys and the order
    const keys = Object.keys(array[0]);

    // Build header
    let result = keys.join(',') + '\n';

    // Add the rows
    array.forEach(function (obj) {
      keys.forEach(function (k, ix) {
        if (ix) {
          result += ',';
        }

        result += obj[k];
      });
      result += '\n';
    });
    this.csvContent = result;

    if (this.csvContent === '') {
      return;
    }

    const uri = 'data:text/csv;charset=utf-8,' + encodeURI(this.csvContent);
    const link = document.createElement('a');

    link.href = uri;

    link.setAttribute('visibility', 'hidden');
    link.download = 'ResponseDetails.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  viewCourseMetricClickHandler() {
    this.router.navigate(['/reports/activity-performance', { activityId: this.readerPerformanceService.selectedUserExam.examId }]);
  }

  destroySelectedExam() {
    this.responseDetails.length = 0;
  }

}
