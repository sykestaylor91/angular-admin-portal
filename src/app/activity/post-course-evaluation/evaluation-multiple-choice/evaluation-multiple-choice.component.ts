import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {UserExamService} from '../../../shared/services/user-exam.service';
import {ExamService} from '../../../shared/services/exam.service';
import {UserEvaluationExamService} from '../user-evaluation.service';
import {Question} from '../../../shared/models/question';
import Utilities from '../../../shared/utilities';
import {AnswerOption} from '../../../shared/models/answer-option';

@Component({
  selector: 'app-evaluation-multiple-choice',
  templateUrl: 'evaluation-multiple-choice.component.html'
})
export class EvaluationMultipleChoiceComponent implements OnInit {
  @Input() answerSubmitted: boolean;
  @Input() question: Question;
  title = 'Multiple Choice';
  currentQuestionAnswers: any;

  private readonly cryptoKey: string;
  private multipleChoiceResponses: any = [];

  constructor(private userExamService: UserExamService,
              private examService: ExamService,
              private router: Router,
              private userEvaluationExamService: UserEvaluationExamService) {
    this.cryptoKey = Utilities.cryptoKey;
  }

  ngOnInit() {
    this.displayQuestion();
  }

  responseClickHandler(response, question) {
    if (this.multipleChoiceResponses.indexOf(response) > -1) {
      this.multipleChoiceResponses.splice(this.multipleChoiceResponses.indexOf(response), 1);
      // remove from answersGiven array
      this.userEvaluationExamService.createMultipleChoiceResponse(response, question);
    } else {
      this.multipleChoiceResponses.push(response);
      this.userEvaluationExamService.createMultipleChoiceResponse(response, question);
    }
  }

  selectedAnswer(response) {
    return true;
  }

  questionChecked(question) {
    return (this.multipleChoiceResponses.indexOf(question) > -1);
  }

  displayQuestion() {
    this.currentQuestionAnswers = [];
    this.question.answers.forEach((answer) => {
      const choice: AnswerOption = Utilities.parseAnswerOption(answer);
      this.currentQuestionAnswers.push(choice);
    });
  }
}
