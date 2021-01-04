import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {trigger, transition, style, animate} from '@angular/animations';
import {UserExam} from '../../../../shared/models/user-exam';
import {Response} from '../../../../shared/models/response';
import {Question} from '../../../../shared/models/question';

@Component({
  selector: 'app-course-map',
  templateUrl: 'course-map.component.html',
  styleUrls: ['./course-map.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('500ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('500ms', style({opacity: 0}))
        ])
      ]
    )
  ]
})
export class CourseMapComponent implements OnInit {
  @Input() userExam: UserExam;
  @Input() responses: Response[];
  @Input() questions: Question[];
  @Input() revisitList: string[];
  @Output() questionChange = new EventEmitter<string>();

  courseMapVisible: boolean = true;

  constructor() {
  }

  ngOnInit() {

  }

  hasResponse(questionId) {
    return this.responses.filter(r => r.questionId === questionId).length > 0;
  }

  isInRevisitList(qid) {
    return this.revisitList.filter(r => r === qid).length > 0;
  }

  setActiveQuestion(questionId) {

    this.questionChange.emit(questionId);
  }

  isSerialQuestion(questionId) {
    let isSQ = false;
    const qArray = this.questions.filter(q => q.id === questionId);
    qArray.forEach(question => {
      if (question && question.serialQuestions && question.serialQuestions.length > 0 || question.type === 'serial') {
        isSQ = true;
      }
    });
    return isSQ;
  }

  questionHasNote(questionId) {

    return this.userExam.notes[questionId];
  }

  getMapItemTitleAttribute(questionId) {
    let text = '';
    if (this.isSerialQuestion(questionId)) {
      text = 'This question has nested questions. ';
    }
    if (this.questionHasNote(questionId)) {
      text = 'There is a note added to this question. ';
    }
    if (this.isSerialQuestion(questionId) && this.questionHasNote(questionId)) {
      text = 'This has nested questions. There is a note added. ';
    }
    if (this.isInRevisitList(questionId)) {
      text += (text.length > 0) ? '\n' : '' ;
      text += 'This question has been marked to be revisited.';
    }
    return text;
  }
}
