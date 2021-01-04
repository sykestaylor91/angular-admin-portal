/**
 * Created by steve on 7/21/16.
 */

import {DocumentIdentifier} from './document-identifier';
import {ActivityStatus} from './activity-status';

export interface CitationActivity {
  id: string;
  title: string;
  status: ActivityStatus;
}

export class Citation extends DocumentIdentifier {

  static ACTIVE = 'active';
  static INACTIVE = 'inactive';
  static DELETED = 'deleted';

  static validStatusCodes = [
    Citation.ACTIVE,
    Citation.INACTIVE,
    Citation.DELETED
  ];

  text: string;
  userId: string;
  status: string;
  activities?: CitationActivity[];

  static copy(source: Citation): Citation {
    return new Citation(source);
  }

  constructor(params: Partial<Citation> = {}) {
    super(params);
    // Object.assign(this, params);
  }

}
