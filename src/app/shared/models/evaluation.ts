/**
 * Created by steve on 7/22/16.
 */

import {ActivityIdentifier} from './activity-identifier';
import {ActivityStatus} from './activity-status';

export class Evaluation extends ActivityIdentifier {
  static validStatusCodes = [
    ActivityStatus.UnderConstruction,
    ActivityStatus.Issued,
    ActivityStatus.Published,
    ActivityStatus.Deleted
  ];

  introduction: string = '';
  comments: any[] = [];

  static copy(source: Evaluation): Evaluation {
    return new Evaluation(source);
  }

  constructor(params: any = {}) {
    super(params);
  }

}

export class EvaluationListItem extends ActivityIdentifier {
  static validStatusCodes = [
    ActivityStatus.UnderConstruction,
    ActivityStatus.Issued,
    ActivityStatus.Published,
    ActivityStatus.Deleted
  ];

  introduction: string = '';
  parents: any[] = [];

  static copy(source: EvaluationListItem): EvaluationListItem {
    return new EvaluationListItem(source);
  }

  constructor(params: any = {}) {
    super(params);
  }

}
