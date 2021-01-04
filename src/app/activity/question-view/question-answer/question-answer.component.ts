import {Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {CustomAccessorHandlerDirective} from '../../../shared/helpers/custom-accessor.handler.directive';
import {AnswerOption} from '../../../shared/models/answer-option';
import {QuestionType} from '../../../shared/models/question-type';

@Component({
  selector: 'app-question-answer',
  templateUrl: 'question-answer.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuestionAnswerComponent),
      multi: true
    }
  ]
})
export class QuestionAnswerComponent extends CustomAccessorHandlerDirective<AnswerOption[]> implements OnInit, OnChanges {
  @Input() type: QuestionType;
  @Input() answerSubmitted: boolean;
  @Input() examMode: boolean = false;
  @Input() previewMode: boolean = false;
  @Input() currentResponse: any;
  @Input() questionId: string = '';
  freeTextAnswerGiven: string = '';
  questionType = QuestionType;


  constructor() {
    super();
  }

  ngOnInit() {
    if (this.currentResponse && this.currentResponse.answerGiven[0] && (this.type === QuestionType.FreeText || this.type === QuestionType.VeryShortAnswer)) {
      this.freeTextAnswerGiven = this.currentResponse.answerGiven[0].text;
    } else {
      this.freeTextAnswerGiven = '';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.currentResponse && this.currentResponse.answerGiven[0] && (this.type === QuestionType.FreeText || this.type === QuestionType.VeryShortAnswer)) {
      this.freeTextAnswerGiven = this.currentResponse.answerGiven[0].text;
    } else {
      this.freeTextAnswerGiven = '';
    }
  }

  // to strikethrough the answer option
  updateDisabled(choice: AnswerOption) {
    // only when not selected or  submitted...
    if (!this.answerSubmitted && !choice.selected) {
      choice.disabled = !choice.disabled;
    }
  }


  // single choice
  onResponseChanged(e: MouseEvent | KeyboardEvent, choice: AnswerOption) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.answerSubmitted && !choice.disabled) {
      this.modelValue.forEach(m => m.selected = choice.id === m.id);
      this.propagateChange(this.modelValue);
    }
  }

  // multi choice
  onResponseChangedMulti(e: MouseEvent | KeyboardEvent, choice: AnswerOption) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.answerSubmitted && !choice.disabled) {
      choice.selected = !choice.selected;
      this.propagateChange(this.modelValue);
    }
  }

  // freetext
  onEditorChange(value: string) {

    const choice = new AnswerOption();
    choice.text = value;
    choice.correct = true;
    choice.selected = true;
    choice.questionId = this.questionId;
    this.propagateChange([choice]);
  }

  onVSAUpdate(event: any) {
    // limit to three words
    if (event.target.value.split(' ').length > 3 ) {
      const split = event.target.value.split(' ');
      split.length = 3;
      event.target.value = split.join(' ');
    }
  }

  onVSAChange(value: string) {

    // onEditorChange(choice: AnswerOption) {
    const choice = new AnswerOption();
    choice.text = value;
    choice.selected = true;
    choice.questionId = this.questionId;
    choice.type = QuestionType.VeryShortAnswer;
    this.propagateChange([choice]);
  }

  onSingleSentenceUpdate(event: any) {
    console.log('************ onSSChange', event);
    // limit to 15 words
    if (event.target.value.split(' ').length > 15 ) {
      const split = event.target.value.split(' ');
      split.length = 15;
      event.target.value = split.join(' ');
    }
  }

  onSingleSentenceChange(e: any) {

    console.log('************ onSSChange', e);
    const choice = new AnswerOption();
    choice.text = e;
    choice.selected = true;
    choice.questionId = this.questionId;
    choice.type = QuestionType.SingleSentence;
    this.propagateChange([choice]);
  }

  onRatingChanged(e) {
    const choice = new AnswerOption();
    choice.text = e;
    choice.selected = true;
    choice.questionId = this.questionId;
    choice.type = QuestionType.SingleSentence;
    this.propagateChange([choice]);
  }
}
