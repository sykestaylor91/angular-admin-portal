import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Exam} from '../../../shared/models/exam';
import {FormsManagementDirective} from '../../../shared/helpers/forms.management.directive';
import {UserService} from '../../../shared/services/user.service';
import {DisclosureService} from '../../../shared/services/disclosure.service';
import {SessionService} from '../../../shared/services/session.service';
import {Router} from '@angular/router';
import {Disclosure} from '../../../shared/models/disclosure';
import {User} from '../../../shared/models/user';
import {cloneDeep} from 'lodash';
import {PermissionService} from '../../../shared/services/permission.service';
import {LoggingService} from '../../../shared/services/logging.service';
import {MatDialog } from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';
import DialogConfig from '../../../shared/models/dialog-config';


@Component({
  selector: 'app-disclosures',
  templateUrl: 'disclosures.component.html',
  styleUrls: ['disclosures.component.scss']
})
export class DisclosuresComponent extends FormsManagementDirective implements OnInit {
  @Input() selectedExam: Exam;

  disclosuresFormGroup: FormGroup = new FormGroup({});
  authorDisclosures: any = [];
  loading: boolean = true;
  loadingQueryCount = 0;
  private allAuthorDisclosureIds = null;
  private selectedDisclosures: any = [];
  User = User;

  constructor(private userService: UserService,
              private disclosureService: DisclosureService,
              private permissionService: PermissionService,
              private sessionService: SessionService,
              private router: Router,
              private notificationsService: NotificationsService,
              private dialog: MatDialog) {
    super(permissionService);
  }

  ngOnInit() {
    this.initializeFormGroup(this.selectedExam);
    this.showSpinner = false;

    this.refreshAuthorDisclosuresList();
    this.handleReadOnlyStatus();
  }

  public refreshAuthorDisclosuresList() {
    this.authorDisclosures = [];
    this.allAuthorDisclosureIds = [];

    let ids = [];
    if (this.selectedExam.authors && this.selectedExam.authors.length > 0) {
      ids = <Array<string>> this.selectedExam.authors.map((author) => author.id );
    }

    if (ids && ids.length > 0) {
      this.userService.findByIdArray(ids).subscribe(authors => {
        this.constructContributorData(authors);
      });
    }
  }

  initializeFormGroup(exam: Exam) {
    this.disclosuresFormGroup = new FormGroup({
      disclosures: new FormControl(exam.disclosures || [])
    });
    this.selectedDisclosures = cloneDeep(exam.disclosures || []);
    this.form.addControl('disclosuresFormGroup', this.disclosuresFormGroup);
    this.handleReadOnlyStatus();
  }

  constructContributorData(authors) {
    if (authors) {
      authors.forEach( author => {
        const contribData = {
          'firstName': author.firstName,
          'lastName': author.lastName,
          'lastUpdated': author.lastUpdated,
          'title': author.title,
          'status': author.status,
          'roles': author.roles,
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
        this.disclosureService.query(author.id).subscribe(disclosures => {

          disclosures.forEach((disclosure) => {
            switch (disclosure.type) {
              case 'payments':
                contribData.paymentDisclosures.push(disclosure);
                break;
              case 'patents':
                contribData.patentDisclosures.push(disclosure);
                break;
              case 'financial':
                contribData.financialDisclosures.push(disclosure);
                break;
              case 'activities':
                contribData.activityDisclosures.push(disclosure);
                break;
              case 'partnerships':
                contribData.partnershipDisclosures.push(disclosure);
                break;
              case 'contributor':
                contribData.contributionDisclosures.push(disclosure);
                break;
              default:
                LoggingService.log('no disclosure : ', disclosure);
            }
            this.allAuthorDisclosureIds.push(disclosure.id);
          });
        }, error => {
          console.warn('Error in disclosure query: ', error);
          this.notificationsService.error('Error', 'There was an error fetching the declarations.');
        }, () => {
          this.authorDisclosures.push(contribData);
          this.cleanupDisclosures();
        });
      });
    }
  }

  includeDisclosureClickHandler(disclosureId) {
    if (this.selectedDisclosures.indexOf(disclosureId) > -1) {
      for (let i = this.selectedDisclosures.length - 1; i >= 0; i--) {
        if (this.selectedDisclosures[i] === disclosureId) {
          this.selectedDisclosures.splice(i, 1);
        }
      }
    } else {
      this.selectedDisclosures.push(disclosureId);
    }
    this.disclosuresFormGroup.controls['disclosures'].setValue(this.selectedDisclosures);
  }

  cleanupDisclosures() {
    this.selectedDisclosures = this.selectedDisclosures.filter(disclosureId => this.allAuthorDisclosureIds.indexOf(disclosureId) > -1 );
    this.disclosuresFormGroup.controls['disclosures'].setValue(this.selectedDisclosures);
  }

  disclosureInList(disclosureId) {
    return (this.selectedDisclosures && this.selectedDisclosures.indexOf(disclosureId) > -1);
  }

  createDeclarationsClickHandler() {
    this.router.navigate(['/contributor/disclosure/edit']);
  }

  viewCommentClickHandler(disclosure: Disclosure) {
    // TODO: should open a dialog with the comment inside it, I've added the import for it
  }
}
