/**
 * Created by steve on 7/21/16.
 */

import {DocumentIdentifier} from './document-identifier';

export class Invitation extends DocumentIdentifier {

  static ACTIVE = 'active';
  static INACTIVE = 'inactive';
  static DELETED = 'deleted';
  static RESPONDED = 'responded';
  static validStatusCodes = [
    Invitation.ACTIVE,
    Invitation.INACTIVE,
    Invitation.DELETED,
    Invitation.RESPONDED
  ];

  firstName: string;
  lastName: string;
  email: string;
  permissionLevel: string;
  expiryDate: Date;
  status: string = Invitation.ACTIVE;


  static copy(source: Invitation): Invitation {
    return new Invitation(source);
  }

  constructor(params: any = {}) {
    super(params);
  }

}
