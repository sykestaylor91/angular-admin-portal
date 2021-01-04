/**
 * Created by steve on 7/22/16.
 */

import {DocumentIdentifier} from './document-identifier';

export enum DisclosureType {
  PAYMENTS = 'payments',
  FINANCIAL = 'financial',
  PATENTS = 'patents',
  PARTNERSHIPS = 'partnerships',
  ACTIVITIES = 'activities',
  CONTRIBUTOR = 'contributor',
}

export class Disclosure extends DocumentIdentifier {

  static ACTIVE = 'active';
  static INACTIVE = 'inactive';
  static DELETED = 'deleted';

  static validStatusCodes = [
    Disclosure.ACTIVE,
    Disclosure.INACTIVE,
    Disclosure.DELETED
  ];

  static PAYMENTS = 'payments';
  static FINANCIAL = 'financial';
  static PATENTS = 'patents';
  static PARTNERSHIPS = 'partnerships';
  static ACTIVITIES = 'activities';
  static CONTRIBUTOR = 'contributor';

  static validTypes = [
    Disclosure.PAYMENTS,
    Disclosure.FINANCIAL,
    Disclosure.PATENTS,
    Disclosure.PARTNERSHIPS,
    Disclosure.ACTIVITIES,
    Disclosure.CONTRIBUTOR
  ];

  userId: string;
  type: string;

  institution: string;
  grantProvided: boolean;
  paidEmployee: boolean;
  personalFee: boolean;
  otherFee: boolean;
  comment: string;
  description: string;
  startDate: Date;
  endDate: Date;
  yearDisclosed: string;

  relationshipType: string;

  patentNumber: string;
  patentPending: boolean;
  patentIssued: boolean;
  patentLicensed: boolean;
  patentRoyalties: boolean;
  patentLicensee: boolean;

  partnershipDetails: string;
  activityDetails: string;

  contributionDetails: string;
  benefitsDetails: string;
  status: string;

  static copy(source: Disclosure): Disclosure {
    return new Disclosure(source);
  }

  constructor(params: any = {}) {
    super(params);
  }

}
