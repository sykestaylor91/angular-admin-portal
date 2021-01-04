/**
 * Created by steve on 7/21/16.
 */

import {DocumentIdentifier} from './document-identifier';
import {Role} from './role';

export class User extends DocumentIdentifier {

  static ACTIVE = 'active';
  static INACTIVE = 'inactive';
  static BANNED = 'banned';
  static DELETED = 'deleted';

  static validStatusCodes = [
    User.ACTIVE,
    User.INACTIVE,
    User.BANNED,
    User.DELETED
  ];

  username: string;
  password?: string;
  session: string;
  ip: string;

  firstName: string;
  lastName: string;
  email: string;
  title: string;
  roles: Role[] = [];
  status: string = User.ACTIVE;
  basketContents: any[];
  disclosureDeclarationUpdate?: string;
  credentialDeclarationUpdate?: string;
  citationDeclarationUpdate?: string;
  organization?: string;
  address1?: string;
  city?: string;
  postalCode?: string;
  address2?: string;
  state?: string;
  country?: string;
  organisation?: string;
  phone?: string;

  activity?: string;

  // disclosure questions conflicts
  activitiesHasConflict?: boolean;
  contributionsHasConflict?: boolean;
  financialHasConflict?: boolean;
  partnershipsHasConflict?: boolean;
  patentsHasConflict?: boolean;
  paymentsHasConflict?: boolean;
  coursesOwned: any = [];

  invitationId?: string;

  name?: string;

  static copy(source: User): User {
    return new User(source);
  }

  constructor(params: any = {}) {
    super(params);
  }

  static fullName(firstName: string = '', lastName: string = ''): string {
    return `${firstName || ''} ${lastName || ''}`.trim() || '';
  }

}
