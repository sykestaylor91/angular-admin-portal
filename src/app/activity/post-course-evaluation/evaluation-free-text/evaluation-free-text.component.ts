import {Component, OnInit, Input} from '@angular/core';
import {UserEvaluationExamService} from '../user-evaluation.service';
import {Question} from '../../../shared/models/question';

@Component({
  selector: 'app-evaluation-free-text',
  templateUrl: 'evaluation-free-text.component.html'
})
export class EvaluationFreeTextComponent implements OnInit {
  title = 'Free Text';
  freeTextAnswer: any;
  @Input() question: Question;

  constructor(private userEvaluationExamService: UserEvaluationExamService) {
  }

  ngOnInit() {
  }

  updateResponse(text, question) {
    this.userEvaluationExamService.createFreeTextResponse(text, question);
  }
}
