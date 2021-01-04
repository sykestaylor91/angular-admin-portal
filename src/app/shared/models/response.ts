/**
 * Created by steve on 7/22/16.
 */

import {DocumentIdentifier} from './document-identifier';
import {AnswerOption} from './answer-option';

export class Response extends DocumentIdentifier {
  static CORRECT = 'correct';
  static INCORRECT = 'incorrect';

  questionId: string;
  session: string;
  userId: string;
  userExamId: string;
  answerGiven: AnswerOption[] = [];
  firstResponse: boolean;
  claimed: boolean;
  // status: string;
  correct?: boolean = false;

  static copy(source: Response): Response {
    return new Response(source);
  }

  constructor(params: any = {}) {
    super(params);
  }

}
