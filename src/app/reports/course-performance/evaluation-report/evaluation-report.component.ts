import {Component} from '@angular/core';

import {CoursePerformanceService} from '../course-performance.service';
import {ResponseService} from '../../../shared/services/response.service';
import {QuestionService} from '../../../shared/services/question.service';
import {assign, uniq} from 'lodash';

import * as CryptoJS from 'crypto-js';
import {Response} from '../../../shared/models/response';

@Component({
  selector: 'app-evaluation-report',
  templateUrl: './evaluation-report.component.html'
})
export class CoursePerformanceEvaluationReportComponent {
  title: string = 'Evaluation Report';
  phraseArray = ['w', 't', 'f', 'n', 'k', 's'];
  csvContent: string;

  constructor(private responseService: ResponseService,
              private questionService: QuestionService,
              public coursePerformanceService: CoursePerformanceService) {
  }

  constructEvaluationReport() {

    this.evaluateQuestions(this.coursePerformanceService.selectedExam.questions);
  }

  evaluateQuestions(questions) {
    this.coursePerformanceService.evaluationReport.length = 0;
    questions.forEach((questionId) => {
      this.questionService.findById(questionId).subscribe(questionData => {
        this.responseService.findByQuestionId(questionId).subscribe(responses => {
          this.coursePerformanceService.evaluationReport.push(this.createQuestionStatistic(questionData, responses));
        });
      });
    });
  }

  createQuestionStatistic(question, responses: Response[]) {
    const questionStats = {
      questionText: question.question,
      totalUsersAnswered: <number> null,
      option: [] = []
    };

    questionStats.totalUsersAnswered = this.uniqueUsers(responses);
    questionStats.option = this.getQuestionOptions(question, responses);
    return questionStats;
  }

  uniqueUsers(responses: Response[]): number {
    return uniq(responses.map(response => response.userId)).length;
  }

  getQuestionOptions(question, responses) {
    const answers: Array<any> = [];
    const totalUniqueUsers = this.uniqueUsers(responses);
    for (let i = 0; i < question.answers.length; i++) {

      const answer = {
        id: <number> null,
        text: <string> null,
        usersAnswered: <number> 0,
        percentOfTotal: <number> 0
      };
      // if answers is a string we need to decrypt it
      if (typeof question.answers[i] === 'string') {
        const decrypted = CryptoJS.AES.decrypt(question.answers[i],
          [this.phraseArray[5],
            this.phraseArray[1],
            this.phraseArray[3],
            this.phraseArray[2],
            this.phraseArray[0],
            this.phraseArray[4]
          ].join(''));
        question.answers[i] = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      }
      answer.id = question.answers[i].id;
      answer.text = question.answers[i].text;
      answers.push(answer);
    }

    answers.forEach(answerItem => {
      const usersAnswered = [];
      responses.forEach((response) => {

        if (response.answerGiven && answerItem.text === response.answerGiven[0].text) {

          if (usersAnswered.indexOf(response.userId) < 0) {
            usersAnswered.push(response.userId);
          }
        }
      });
      answerItem.usersAnswered = usersAnswered.length;
      answerItem.percentOfTotal = usersAnswered.length / totalUniqueUsers * 100;
    });
    return answers;
  }

  printReportCsv() {
    const array = [];

    if (this.coursePerformanceService.evaluationReport) {
      this.coursePerformanceService.evaluationReport.forEach(question => {
        if (question.option) {
          question.option.forEach(option => {
            array.push(assign({
              questionText: question.questionText,
              totalUsersAnswered: question.totalUsersAnswered
            }, option));
          });
        } else {
          array.push({
            questionText: question.questionText,
            totalUsersAnswered: question.totalUsersAnswered
          });
        }
      });
    }

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
}
