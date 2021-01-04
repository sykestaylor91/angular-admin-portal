import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {Router} from '@angular/router';

import {DisclosureService} from '../../../shared/services/disclosure.service';
import {SessionService} from '../../../shared/services/session.service';
import {UserService} from '../../../shared/services/user.service';
import {Disclosure, DisclosureType} from '../../../shared/models/disclosure';
import {User} from '../../../shared/models/user';
import {NotificationsService} from 'angular2-notifications';
import {ColumnDataType, GridColumn} from '../../../shared/grid-table/grid.column';
import {finalize} from 'rxjs/operators';
import {RoutesRp} from '../../../shared/models/routes-rp';
import { Column, ColumnType } from '../../../shared/models/column';

@Component({
  selector: 'app-edit',
  templateUrl: 'edit.component.html',
})
export class EditComponent implements OnInit, OnDestroy {
  title = 'My disclosure';

  payments: Disclosure[];
  financial: Disclosure[];
  patents: Disclosure[];
  partnerships: Disclosure[];
  activities: Disclosure[];
  contributions: Disclosure[];

  user: User;
  showWarning: boolean = false;
  editOther: boolean = false;
  editOtherUser: User;
  showPaymentsWarning: boolean = false;
  showFinancialWarning: boolean = false;
  showPatentsWarning: boolean = false;
  showPartnershipsWarning: boolean = false;
  showActivityWarning: boolean = false;
  showContributionsWarning: boolean = false;
  showSpinner: boolean = false;
  columnsPaymentDisclosures: Column[];
  columnsFinancialDisclosures: Column[];
  columnsPatentDisclosures: Column[];
  columnsPartnershipDisclosures: Column[];
  columnsActivityDisclosures: Column[];
  columnsContributionDisclosures: Column[];
  columnsCredentialDisclosures: Column[];

  // YG no longer in use. Replaced by Nowce-data-list column config in ngOnInit
  paymentsColumns: GridColumn[] = [
    {
      displayName: '',
      columnClassName: 'col-xs-1',
      field: '',
      type: ColumnDataType.Menu
    },
    {
      displayName: 'Updated',
      columnClassName: 'col-xs-3',
      field: 'lastUpdated',
      type: ColumnDataType.Date
    },
    {
      displayName: 'Organisation',
      columnClassName: 'col-xs-3',
      field: 'institution',
      type: ColumnDataType.Text
    },
    {
      displayName: 'Comment',
      columnClassName: 'col-xs-2',
      field: 'comment',
      type: ColumnDataType.Text
    }
  ];

  financialColumns: GridColumn[] = [
    {
      displayName: '',
      columnClassName: 'col-xs-1',
      field: '',
      type: ColumnDataType.Menu
    },
    {
      displayName: 'Updated',
      columnClassName: 'col-xs-3',
      field: 'lastUpdated',
      type: ColumnDataType.Date
    },
    {
      displayName: 'Organisation',
      columnClassName: 'col-xs-2',
      field: 'institution',
      type: ColumnDataType.Text
    },
    {
      displayName: 'Relationship',
      columnClassName: 'col-xs-3',
      field: 'relationshipType',
      type: ColumnDataType.Text
    },
    {
      displayName: 'Comment',
      columnClassName: 'col-xs-3',
      field: 'comment',
      type: ColumnDataType.Text
    }
  ];

  patentsColumns: GridColumn[] = [
    {
      displayName: '',
      columnClassName: 'col-xs-1',
      field: '',
      type: ColumnDataType.Menu
    },
    {
      displayName: 'Number',
      columnClassName: 'col-xs-1',
      field: 'patentNumber',
      type: ColumnDataType.Text
    },
    {
      displayName: 'Pending',
      columnClassName: 'col-xs-2',
      field: 'patentPending',
      type: ColumnDataType.CheckMark
    },
    {
      displayName: 'Issued',
      columnClassName: 'col-xs-2',
      field: 'patentIssued',
      type: ColumnDataType.CheckMark
    },
    {
      displayName: 'Licensed',
      columnClassName: 'col-xs-2',
      field: 'patentLicensed',
      type: ColumnDataType.CheckMark
    },
    {
      displayName: 'Royalties',
      columnClassName: 'col-xs-2',
      field: 'patentRoyalties',
      type: ColumnDataType.CheckMark
    },
    {
      displayName: 'Licensee',
      columnClassName: 'col-xs-2',
      field: 'patentLicensee',
      type: ColumnDataType.CheckMark
    }
  ];

  partnershipsColumns: GridColumn[] = [
    {
      displayName: '',
      columnClassName: 'col-xs-1',
      field: '',
      type: ColumnDataType.Menu
    },
    {
      displayName: 'Updated',
      columnClassName: 'col-xs-3',
      field: 'lastUpdated',
      type: ColumnDataType.Date
    },
    {
      displayName: 'Partnership Details',
      columnClassName: 'col-xs-8',
      field: 'partnershipDetails',
      type: ColumnDataType.Text
    }
  ];

  activitiesColumns: GridColumn[] = [
    {
      displayName: '',
      columnClassName: 'col-xs-1',
      field: '',
      type: ColumnDataType.Menu
    },
    {
      displayName: 'Updated',
      columnClassName: 'col-xs-3',
      field: 'lastUpdated',
      type: ColumnDataType.Date
    },
    {
      displayName: 'Disclosure or name of connected person or organization',
      columnClassName: 'col-xs-8',
      field: 'activityDetails',
      type: ColumnDataType.Text
    }
  ];

  contributionsColumns: GridColumn[] = [
    {
      displayName: '',
      columnClassName: 'col-xs-1',
      field: '',
      type: ColumnDataType.Menu
    },
    {
      displayName: 'Updated',
      columnClassName: 'col-xs-1',
      field: 'lastUpdated',
      type: ColumnDataType.Date
    },
    {
      displayName: 'Receiving organization',
      columnClassName: 'col-xs-5',
      field: 'contributionDetails',
      type: ColumnDataType.Text
    },
    {
      displayName: 'Benefit given',
      columnClassName: 'col-xs-5',
      field: 'benefitsDetails',
      type: ColumnDataType.Text
    }
  ];

  DisclosureType = DisclosureType;
  User = User;

  constructor(public disclosureService: DisclosureService,
              public userService: UserService,
              public sessionService: SessionService,
              public router: Router,
              private notificationsService: NotificationsService) {
    this.sessionService.sessionUser.subscribe((sessionUser: User) => {
      this.user = sessionUser;
    });
  }

  ngOnInit() {

    this.columnsPaymentDisclosures = [
      {
        type: ColumnType.Text,
        field: 'institution',
        width: '25%',
        title: 'Institution or company'
      },
      {
        type: ColumnType.CheckBox,
        field: 'grantProvided',
        width: '15%',
        title: 'Personal fee'
      },
      {
        type: ColumnType.CheckBox,
        field: 'personalFee',
        width: '10%',
        title: 'Grant'
      },
      {
        type: ColumnType.CheckBox,
        field: 'paidEmployee',
        width: '15%',
        title: 'Employee'
      },
      {
        type: ColumnType.CheckBox,
        field: 'otherFee',
        width: '10%',
        title: 'Other'
      },
      {
        type: ColumnType.Date,
        field: 'lastUpdated',
        width: '20%',
        title: 'Updated'
      }
    ];

    this.columnsFinancialDisclosures = [
      {
        type: ColumnType.Text,
        field: 'institution',
        width: '20%',
        title: 'Name of Organization'
      },
      {
        type: ColumnType.Text,
        field: 'relationshipType',
        width: '20%',
        title: 'Type of relationship'
      },
      {
        type: ColumnType.Date,
        field: 'startDate',
        width: '10%',
        title: 'Start date'
      },
      {
        type: ColumnType.Date,
        field: 'endDate',
        width: '10%',
        title: 'End date'
      },
      {
        type: ColumnType.Text,
        field: 'comment',
        width: '10%',
        title: 'Comment'
      },
      {
        type: ColumnType.Date,
        field: 'yearDisclosed',
        width: '20%',
        title: 'Year disclosed'
      }
    ];

    this.columnsPatentDisclosures = [
      {
        type: ColumnType.Text,
        field: 'type',
        width: '25%',
        title: 'Patent or application'
      },
      {
        type: ColumnType.CheckBox,
        field: 'patentPending',
        width: '10%',
        title: 'Pending'
      },
      {
        type: ColumnType.CheckBox,
        field: 'patentIssued',
        width: '10%',
        title: 'Issued'
      },
      {
        type: ColumnType.CheckBox,
        field: 'patentLicensed',
        width: '10%',
        title: 'Licensed'
      },
      {
        type: ColumnType.CheckBox,
        field: 'patentRoyalties',
        width: '10%',
        title: 'Royalties'
      },
      {
        type: ColumnType.CheckBox,
        field: 'patentLicensee',
        width: '10%',
        title: 'Licensee'
      },
      {
        type: ColumnType.Text,
        field: 'comment',
        width: '15%',
        title: 'Comment'
      },
      {
        type: ColumnType.Date,
        field: 'lastUpdated',
        width: '10%',
        title: 'Updated'
      }
    ];

    this.columnsPartnershipDisclosures = [
      {
        type: ColumnType.Text,
        field: 'partnershipDetails',
        width: '90%',
        title: 'Partnership'
      },
      {
        type: ColumnType.Date,
        field: 'yearDisclosed',
        width: '20%',
        title: 'Year disclosed'
      }
    ];

    this.columnsActivityDisclosures = [
      {
        type: ColumnType.Text,
        field: 'activityDetails',
        width: '90%',
        title: 'Partnership'
      },
      {
        type: ColumnType.Date,
        field: 'yearDisclosed',
        width: '20%',
        title: 'Year disclosed'
      }
    ];

    this.columnsContributionDisclosures = [
      {
        type: ColumnType.Text,
        field: 'contributionDetails',
        width: '90%',
        title: 'Contribution'
      },
      {
        type: ColumnType.Date,
        field: 'yearDisclosed',
        width: '20%',
        title: 'Year disclosed'
      }
    ];

    this.columnsCredentialDisclosures = [
      {
        type: ColumnType.Text,
        field: 'university',
        width: '25%',
        title: 'University or awarding institution'
      },
      {
        type: ColumnType.Text,
        field: 'subject',
        width: '25%',
        title: 'Major subject and speciality'
      },
      {
        type: ColumnType.Text,
        field: 'postNominalLetters',
        width: '25%',
        title: 'Post nominal letters awarded'
      },
      {
        type: ColumnType.Text,
        field: 'yearAttained',
        width: '25%',
        title: 'Year Attained'
      }
    ];
    if (this.disclosureService.selectedContributorId) {
      this.editOther = true;
      this.userService.findById(this.disclosureService.selectedContributorId).subscribe(user => {
        this.editOtherUser = user;
        this.getDisclosures(user);
      });
    } else {
      this.getDisclosures(this.user);
    }
  }

  ngOnDestroy() {
    this.disclosureService.selectedContributorId = null;
  }

  getUser() {
    this.sessionService.validateSession().subscribe(user => {
      this.getDisclosures(this.user);
    });
  }

  resetWarnings() {
    // reset
    this.showWarning = false;
    this.showPaymentsWarning = false;
    this.showFinancialWarning = false;
    this.showPatentsWarning = false;
    this.showPartnershipsWarning = false;
    this.showActivityWarning = false;
    this.showContributionsWarning = false;
  }

  getDisclosures(user) {
    this.showSpinner = true;
    this.disclosureService.query(user.id)
      .pipe(finalize(() => this.showSpinner = false))
      .subscribe(disclosures => {
        this.resetWarnings();

        // q1 payments
        this.payments = disclosures.filter(disclosure => disclosure.type === Disclosure.PAYMENTS);

        if (user.paymentsHasConflict && this.payments.length === 0) {
          this.showWarning = true;
          this.showPaymentsWarning = true;
        }

        // q2 financial
        this.financial = disclosures.filter(disclosure => disclosure.type === Disclosure.FINANCIAL);

        if (user.financialHasConflict && this.financial.length === 0) {
          this.showWarning = true;
          this.showFinancialWarning = true;
        }

        // q3 patents
        this.patents = disclosures.filter(disclosure => disclosure.type === Disclosure.PATENTS);

        if (user.patentsHasConflict && this.patents.length === 0) {
          this.showWarning = true;
          this.showPatentsWarning = true;
        }

        // q4 partnerships
        this.partnerships = disclosures.filter(disclosure => disclosure.type === Disclosure.PARTNERSHIPS);

        if (user.partnershipsHasConflict && this.partnerships.length === 0) {
          this.showWarning = true;
          this.showPartnershipsWarning = true;
        }

        // q5 activities
        this.activities = disclosures.filter(disclosure => disclosure.type === Disclosure.ACTIVITIES);

        if (user.activitiesHasConflict && this.activities.length === 0) {
          this.showWarning = true;
          this.showActivityWarning = true;
        }

        // q6 contributions
        this.contributions = disclosures.filter(disclosure => disclosure.type === Disclosure.CONTRIBUTOR);

        if (user.contributionsHasConflict && this.contributions.length === 0) {
          this.showWarning = true;
          this.showContributionsWarning = true;
        }

      });
  }

  finishClickHandler() {
    if (!this.editOther) {
      this.sessionService.loggedInUser.disclosureDeclarationUpdate = this.getDeclarationDate();
      this.userService.save(this.sessionService.loggedInUser).subscribe();
      this.router.navigate([RoutesRp.Home]);
      this.notificationsService.success('Disclosures Saved', 'Thank you for completing your disclosures to date. We will send you an email close to the time when an update or confirmation is required');
    } else {
      this.router.navigate([RoutesRp.Home]);
      this.notificationsService.success('Disclosures Saved', 'Thank you for completing your disclosures to date. We will send you an email close to the time when an update or confirmation is required');
    }
  }

  getDeclarationDate() {
    const expirationDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
    return expirationDate.toString();
  }

}
