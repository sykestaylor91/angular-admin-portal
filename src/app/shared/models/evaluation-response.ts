/**
 * Created by steve on 7/22/16.
 */

import {DocumentIdentifier} from './document-identifier';

export class EvaluationResponse extends DocumentIdentifier {
  questionId: string;
  session: string;
  userId: string;
  answerGiven: string[];

  static copy(source: EvaluationResponse): EvaluationResponse {
    return new EvaluationResponse(source);
  }

  constructor(params: any = {}) {
    super(params);
  }

}
