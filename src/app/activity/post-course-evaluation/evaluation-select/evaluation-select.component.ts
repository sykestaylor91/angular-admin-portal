import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {UserEvaluationExamService} from '../user-evaluation.service';
import {Question} from '../../../shared/models/question';
import {UserExamService} from '../../../shared/services/user-exam.service';
import {ExamService} from '../../../shared/services/exam.service';

@Component({
  selector: 'app-evaluation-select',
  templateUrl: 'evaluation-select.component.html'
})
export class EvaluationSelectComponent implements OnInit {
  @Input() question: Question;
  checkedResponse: number;
  title = 'Evaluation Select';
  freeTextAnswer: string;

  constructor(private userExamService: UserExamService,
              private examService: ExamService,
              private router: Router,
              private userEvaluationExamService: UserEvaluationExamService) {
  }

  ngOnInit() {
  }

  selectOption(question, selection) {
    this.checkedResponse = selection;
    this.userEvaluationExamService.createEvaluationSelectResponse(question, selection);
  }

}
