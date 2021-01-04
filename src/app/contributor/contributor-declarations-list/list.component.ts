import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { DisclosureService } from '../../shared/services/disclosure.service';
import { CredentialService } from '../../shared/services/credential.service';
import { SessionService } from '../../shared/services/session.service';
import { PublicationService } from '../../shared/services/publication.service';
import { User } from '../../shared/models/user';
import { NotificationsService } from 'angular2-notifications';
import { LoggingService } from '../../shared/services/logging.service';
import { environment } from '../../../environments/environment';
import { Column, ColumnType } from '../../shared/models/column';
import { CheckMarkPipe } from '../../shared/pipes/check-mark.pipe';

@Component({
  selector: 'app-disclosure-list',
  templateUrl: 'list.component.html',
})
export class DeclarationsListComponent implements OnInit {
  contributor: any;
  title = 'View contributor details & declarations';
  searchUserId: string;
  searchTerm: string;
  user: User;
  debug = !environment.production;
  selectedItems: any[] = []; // dummy
  columnsPaymentDisclosures: Column[];
  columnsFinancialDisclosures: Column[];
  columnsPatentDisclosures: Column[];
  columnsPartnershipDisclosures: Column[];
  columnsActivityDisclosures: Column[];
  columnsContributionDisclosures: Column[];
  columnsCredentialDisclosures: Column[];
  sourceListPaymentDisclosures: string;
  dialogTitle: string;
  displayProperty: string;
  User = User;

  constructor(private userService: UserService,
    private disclosureService: DisclosureService,
    private credentialService: CredentialService,
    private notificationsService: NotificationsService,
    private router: Router,
    private sessionService: SessionService,
    private publicationService: PublicationService) {
  }

  ngOnInit() {
    this.user = this.sessionService.loggedInUser;
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
        width: '90',
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
  }

  getDeclarations(userId) {
    this.userService.findById(userId).subscribe(user => {
      this.contributor = this.constructContributorData(user);
    });
  }

  constructContributorData(user) {
    let contributorData = {
      'id': user.id,
      'firstName': user.firstName,
      'lastName': user.lastName,
      'lastUpdated': user.lastUpdated,
      'title': user.title,
      'status': user.status,
      'roles': user.roles,
      'paymentDisclosures': [],
      'patentDisclosures': [],
      'financialDisclosures': [],
      'activityDisclosures': [],
      'partnershipDisclosures': [],
      'educationDisclosures': [],
      'credentialDisclosures': [],
      'citationDisclosures': [],
      'activitiesDisclosures': [],
      'contributionDisclosures': []
    };

    contributorData = this.getDisclosures(user.id, contributorData);
    contributorData = this.getCredentials(user.id, contributorData);
    contributorData = this.getCitations(user.id, contributorData);
    return contributorData;
  }

  getCitations(user, contributorData) {
    this.publicationService.findByUserId(user, true).subscribe(data => {
      contributorData.citationDisclosures = data;
    });
    return contributorData;
  }

  getDisclosures(user, contributorData) {
    this.disclosureService.query(user).subscribe(disclosures => {
      if (disclosures) {
        disclosures.forEach((disclosure) => {
          switch (disclosure.type) {
            case 'payments':
              contributorData.paymentDisclosures.push(disclosure);
              break;
            case 'patents':
              contributorData.patentDisclosures.push(disclosure);
              break;
            case 'financial':
              contributorData.financialDisclosures.push(disclosure);
              break;
            case 'activity':
              contributorData.activityDisclosures.push(disclosure);
              break;
            case 'partnerships':
              contributorData.partnershipDisclosures.push(disclosure);
              break;
            case 'activities':
              contributorData.activitiesDisclosures.push(disclosure);
              break;
            case 'contributor':
              contributorData.contributionDisclosures.push(disclosure);
              break;
            default:
              LoggingService.log('no disclosure : ', disclosure);
          }
        });
      }
    });
    return contributorData;
  }

  getCredentials(user, contributorData) {
    this.credentialService.findById(user).subscribe(credentials => {
      if (credentials) {
        credentials.forEach((credential) => {
          switch (credential.type) {
            case 'education':
              contributorData.educationDisclosures.push(credential);
              break;
            case 'credential':
              contributorData.credentialDisclosures.push(credential);
              break;
            case 'citation':
              contributorData.citationDisclosures.push(credential);
              break;
            default:
              LoggingService.log('no credential: ', credential);
          }
        });
      }
    });
    return contributorData;
  }

  getUser() {
    this.userService.findByUsername(this.searchTerm).subscribe(user => {

      if (user && user.id) {
        this.getDeclarations(user.id);
      } else {
        this.notificationsService.error('No user matched the search term');
      }

    });
  }

  submitQuery() {
    if (this.searchTerm) {
      this.getUser();
    } else if (this.searchUserId) {
      this.getDeclarations(this.searchUserId);
    } else {
      const msg = 'Please input a contributor to view their disclosures, credentials, & citations';
      this.notificationsService.error('No search term entered', msg);
    }
  }

  editContributor(contributor) {
    this.disclosureService.selectedContributorId = contributor.id;
    this.router.navigate(['/contributor/disclosure/edit']);
  }

}

