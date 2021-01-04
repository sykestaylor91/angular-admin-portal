/**
 * Created by steve on 7/22/16.
 */

import {DocumentIdentifier} from './document-identifier';

export class ProviderOrg extends DocumentIdentifier {

  static ACTIVE = 'active';
  static INACTIVE = 'inactive';
  static DELETED = 'deleted';

  static validStatusCodes = [
    ProviderOrg.ACTIVE,
    ProviderOrg.INACTIVE,
    ProviderOrg.DELETED
  ];
  name: string;

  route: string;
  domain: string;
  logo: string;

  contactInfo: string;

  status: string;

  static copy(source: ProviderOrg): ProviderOrg {
    return new ProviderOrg(source);
  }

  constructor(params: any = {}) {
    super(params);
  }

}
