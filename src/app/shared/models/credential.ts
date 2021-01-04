/**
 * Created by steve on 7/22/16.
 */

import {DocumentIdentifier} from './document-identifier';

export class Credential extends DocumentIdentifier {

  static ACTIVE = 'active';
  static INACTIVE = 'inactive';
  static DELETED = 'deleted';

  static validStatusCodes = [
    Credential.ACTIVE,
    Credential.INACTIVE,
    Credential.DELETED
  ];

  userId: string;
  type: string;

  university: string;
  subject: string;
  degree: string;
  yearAttained: string;
  verifyingAuthority: string;
  postNominalLetters: string;

  status: string;

  static copy(source: Credential): Credential {
    return new Credential(source);
  }

  constructor(params: any = {}) {
    super(params);
  }

}
