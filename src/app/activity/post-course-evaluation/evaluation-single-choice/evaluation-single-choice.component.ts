import {Component, OnInit, Input} from '@angular/core';
import {UserEvaluationExamService} from '../user-evaluation.service';
import {Question} from '../../../shared/models/question';
import Utilities from '../../../shared/utilities';
import {AnswerOption} from '../../../shared/models/answer-option';

@Component({
  selector: 'app-evaluation-single-choice',
  templateUrl: 'evaluation-single-choice.component.html'
})
export class EvaluationSingleChoiceComponent implements OnInit {
  @Input() answerSubmitted: boolean;
  @Input() question: Question;
  currentQuestion: any;
  currentQuestionAnswers: any;

  private selectedAnswer: any;

  constructor(private userEvaluationExamService: UserEvaluationExamService) {
  }

  ngOnInit() {
    this.displayQuestion();
  }

  responseClickHandler(response, question) {
    this.selectedAnswer = response;
    this.userEvaluationExamService.createSingleChoiceResponse(question, response);
  }

  displayQuestion() {
    this.currentQuestionAnswers = [];
    this.question.answers.forEach((answer) => {
      const choice: AnswerOption = Utilities.parseAnswerOption(answer);
      this.currentQuestionAnswers.push(choice);
    });
  }

  checkedResponse(answer) {
    return (answer === this.selectedAnswer);
  }

}
