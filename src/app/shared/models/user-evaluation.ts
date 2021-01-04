/**
 * Created by steve on 7/22/16.
 */

import {DocumentIdentifier} from './document-identifier';

export class UserEvaluation extends DocumentIdentifier {
  static OPEN = 'open';
  static CLOSED = 'closed';
  static ABANDONED = 'abandoned';

  static validStatusCodes = [
    UserEvaluation.OPEN,
    UserEvaluation.CLOSED,
    UserEvaluation.ABANDONED
  ];

  userId: string;
  examId: string;
  questions: string[];
  dateCompleted: string;
  status: string;
  claimedCredit: number;

  static copy(source: UserEvaluation): UserEvaluation {
    return new UserEvaluation(source);
  }

  constructor(params: any = {}) {
    super(params);
  }

}
