/**
 * Created by steve on 7/21/16.
 */

import {DocumentIdentifier} from './document-identifier';

export class Certification extends DocumentIdentifier {

  static ACTIVE = 'active';
  static INACTIVE = 'inactive';
  static DELETED = 'deleted';

  static validStatusCodes = [
    Certification.ACTIVE,
    Certification.INACTIVE,
    Certification.DELETED
  ];

  userId: string;
  programType: string;
  bank: string[];
  questions: string[];
  certificates: string[];

  status: string;

  static copy(source: Certification): Certification {
    return new Certification(source);
  }

  constructor(params: any = {}) {
    super(params);
  }

}
