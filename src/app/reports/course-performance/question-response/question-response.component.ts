/* tslint:disable: max-line-length */
import {Component, OnInit} from '@angular/core';
import {CoursePerformanceService} from '../course-performance.service';
import {ResponseService} from '../../../shared/services/response.service';
import {QuestionService} from '../../../shared/services/question.service';
import { Column, ColumnType } from '../../../shared/models/column';

@Component({
  selector: 'app-question-response',
  templateUrl: './question-response.component.html'
})
export class CoursePerformanceQuestionResponseComponent implements OnInit {
  title: string = 'Question Response';
  columnsQuestions: Column[];

  constructor(private responseService: ResponseService,
              private questionService: QuestionService,
              public coursePerformanceService: CoursePerformanceService) {
  }

  ngOnInit() {
    this.columnsQuestions = [
      {
        type: ColumnType.FirstNWordsStripTags,
        field: 'questionText',
        width: '50%',
        title: 'First 6 Words of Question',
        limit: 6
      },
      {
        type: ColumnType.Text,
        field: 'percentageCorrectFirstTime',
        width: '16%',
        title: '% of Users Giving Correct Answer at First Attempt'
      },
      {
        type: ColumnType.Text,
        field: 'percentageCorrect',
        width: '16%',
        title: '% of Users Giving Correct Answer at Any Time'
      },
      {
        type: ColumnType.Text,
        field: 'totalUsersAnswered',
        width: '16%',
        title: 'Number of Users who Answered this Question'
      }
    ];
  }

  getQuestionResponses() {
    this.constructQuestionResponses(this.coursePerformanceService.selectedExam.questions);
  }

  constructQuestionResponses(questions) {
    this.coursePerformanceService.questionStatistics = [];
    questions.forEach(question => {
      this.questionService.findById(question).subscribe(questionData => {
        this.responseService.findByQuestionId(question).subscribe(responses => {
          this.coursePerformanceService.questionStatistics.push(this.createQuestionStatistic(questionData, responses));
        });
      });
    });
  }

  createQuestionStatistic(question, responses) {
    const questionStats = {
      questionNumber: question.number,
      questionText: <string> null,
      totalUsersAnswered: <number> null,
      percentageCorrectFirstTime: <number> null,
      percentageCorrect: <number> null
    };
    const firstResponses = this.getFirstResponses(responses);
    questionStats.questionText = question.question;
    questionStats.totalUsersAnswered = this.getTotalUsersWhoAnsweredQuestion(responses);
    questionStats.percentageCorrect = (responses.length) ? Math.round(this.numberCorrect(responses) / responses.length * 100) : 0;
    questionStats.percentageCorrectFirstTime = (firstResponses.length) ? Math.round(this.numberCorrect(firstResponses) / firstResponses.length * 100) : 0;

    return questionStats;
  }

  getTotalUsersWhoAnsweredQuestion(responses) {
    const completedUsers: string[] = [];
    responses.forEach(function (response) {
      if (completedUsers.indexOf(response.userId) === -1) {
        // element doesn't exist in array
        completedUsers.push(response.userId);
      }
    });
    return completedUsers.length;
  }

  getFirstResponses(responses) {
    const firstResponses: any[] = [];
    // let encountered: any = {};
    const encountered = [];
    let userCount = 0;
    responses.forEach(function (response) {
      if (encountered.indexOf(response.userId) > -1 && !response.firstResponse) {
        return;
      }
      userCount++;
      // encountered[response.userId] = response;
      encountered.push(response.userId);
      firstResponses.push(response);
    });
    return firstResponses;
  }

  numberCorrect(responses) {
    let numberCorrect = 0;
    responses.forEach((response) => {
      if (response.correct) {
        numberCorrect++;
      }
    });
    return numberCorrect;
  }
}
