import {UserService} from '../services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {DisclosureService} from '../services/disclosure.service';
import {ProviderOrgService} from '../services/provider-org.service';
import {Component, Inject, OnInit} from '@angular/core';
import {User} from '../models/user';
import {CredentialService} from '../services/credential.service';
import {Credential} from '../models/credential';
import {MediaService} from '../services/media.service';
import {CitationService} from '../services/citation.service';
import {Citation} from '../models/citation';
import Utilities from '../utilities';
import * as moment from 'moment';
import AccreditationTableConfigurations from '../models/accreditation-table-configurations';
import {AccreditationBodiesWithNone} from '../models/accrediting-body';
import LearningFormatOptions from '../models/learning-format-options';
import {DesignationOptions} from '../models/designation-options';
import {environment} from '../../../environments/environment';
import {Media} from '../models/media';

import {isObject} from 'rxjs/internal/util/isObject';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {LoggingService} from '../services/logging.service';
import {Exam} from '../models/exam';

@Component({
  templateUrl: 'pre-activity-information-content.component.html',
  styleUrls: ['pre-activity-information-content.component.scss']
})
export class PreActivityInformationContentComponent implements OnInit {
  authors: any = [];
  authorDisclosures: any = [];
  accreditationStatement: string;
  creditDesignationStatement: string;
  creditTypeDisplay: string;
  creditTypeDisplayWithTrademark: string;
  creditText: string;
  statementOfCompletion: string;

  isACGME: boolean = false;

  learningFormatDisplay: string;
  designationDisplay: string;
  percentRecommend: number;
  citations: Citation[];
  accreditationStatementLabel: string;

  estimatedCompletionTimeDisplay: string;
  shorthandId: string;
  providerName: string;
  providerFullAddress: string;
  accreditorLogo: string;
  activityImage: string;
  aapaLogo: string;
  anccLogo: string;
  acpeLogo: string;

  User = User;
  AccreditationBodies = AccreditationBodiesWithNone;

  disclosures: any[] = [];

  constructor(private disclosureService: DisclosureService,
              private userService: UserService,
              private mediaService: MediaService,
              private citationsService: CitationService,
              public providerOrgService: ProviderOrgService,
              public dialogRef: MatDialogRef<PreActivityInformationContentComponent>,
              public credentialsService: CredentialService,
              @Inject(MAT_DIALOG_DATA) public data: {content: Exam}) {
  }

  ngOnInit() {
    this.providerName = this.providerOrgService.provider.name;
    this.providerFullAddress = this.providerOrgService.provider.fullAddress;

    if (this.data.content) {
      this.shorthandId = this.data.content.id.substring(0, 6);
      this.estimatedCompletionTimeDisplay = this.getTimeInHHMMSS(this.data.content.estimatedCompletionTime);

      this.data.content.disclosures.forEach((disclosure) => {
        this.disclosureService.findById(disclosure).subscribe(disclosureData => {
          this.userService.findById(disclosureData.userId).subscribe(userData => {
            const obj = {
              firstName: '',
              lastName: '',
              startDate: disclosureData.startDate,
              endDate: disclosureData.endDate,
              institution: disclosureData.institution,
              grantProvided: disclosureData.grantProvided,
              paidEmployee: disclosureData.paidEmployee,
              otherFee: disclosureData.otherFee,
              comment: disclosureData.comment,
              description: disclosureData.description,
              yearDisclosed: disclosureData.yearDisclosed,
              relationshipType: disclosureData.relationshipType,
              patentNumber: disclosureData.patentNumber,
              type: disclosureData.type
            };
            if (userData) {
              obj.firstName = userData.firstName;
              obj.lastName = userData.lastName;
            }
            this.disclosures.push(obj);
          });
        });
      });

      if (this.data.content.authors && this.data.content.authors.length > 0) {
        this.data.content.authors.forEach((author) => {
          this.userService.findById(author.id).subscribe(userData => {
            this.authors.push(userData);
          });
        });
      }

      this.statementOfCompletion = this.getStatementOfCompletion();

      this.isACGME = this.data.content.accreditingBody === 'ACGME';

      this.learningFormatDisplay =
        this.getLearningFormatDisplay(
          this.data.content.accreditingBody,
          this.data.content.creditType,
          this.data.content.learningFormat,
          this.data.content.otherLearningFormat,
          this.data.content.noneLearningFormat
        );

      this.designationDisplay = this.getDesignationDisplay(this.data.content.designation);

      AccreditationTableConfigurations.getAccreditationTable(this.data.content.accreditingBody).forEach((item) => {
        if (item && item.key === this.data.content.accreditationType) {
          this.setupStatementsForItem(item);
        }
      });

      if (this.data.content && this.data.content.authors) {
        const authorIds = [];
        this.data.content.authors.forEach((author) => {
          if (author.id && !authorIds.includes(author.id)) {
            authorIds.push(author.id);
            this.userService.findById(author.id).subscribe(user => {
              this.authorDisclosures.push(this.constructContributorData(user));
            });
          }
        });
      }

      // Citations
      this.citationsService.queryByExam(this.data.content.id)
        .subscribe((citations: Citation[]) => {
          this.citations = citations.sort(Utilities.dateSorter('lastUpdated'));
        });

      // Calculation recommend percentages
      const numRecommend = this.data.content.recommend;
      const numNotRecommend = this.data.content.notRecommend;
      if (numRecommend !== null || numNotRecommend !== null) {
        this.percentRecommend = numRecommend / (numRecommend + numNotRecommend);
      }

      // Credit Text
      if (!this.isACGME) {
        this.creditText = (this.data.content.numberOfCredits + ' ' + this.creditTypeDisplayWithTrademark).trim();
      } else {
        this.creditText = null;
      }

      this.getImageUrl(this.data.content.accreditingBodyLogo).subscribe(url => this.accreditorLogo = url);
      this.getImageUrl(this.data.content.courseImage).subscribe(url => this.activityImage = url);
    }
  }

  getImageUrl(image: string | Media): Observable<string> {
    if (typeof image === 'string' && image.length > 0) {
      return this.mediaService.findById(image)
        .pipe(map(data => `${environment.mediaUrl}${data.id}.${data.contentType}`));

    } else if (isObject(image) && (image as Media).id) {
      return of((image as Media).thumbnail);
    }

    return of('');
  }

  setupStatementsForItem(item) {
    if (item) {
      const creditTypeOption = item.value.creditTypeOptions.find((option) => option.key === this.data.content.creditType);
      if (creditTypeOption) {
        if (this.data.content.creditType === 'other') {
          this.creditTypeDisplay = this.data.content.otherCreditType;
        } else {
          this.creditTypeDisplay = creditTypeOption.value.label;
        }
        this.creditTypeDisplayWithTrademark = this.substituteCopyRightedNames(this.creditTypeDisplay);
      }

      this.accreditationStatement = this.variableSubstitution(item.value.accreditationStatement, 'AccreditationStatement');
      this.creditDesignationStatement = this.variableSubstitution(item.value.creditDesignationStatement, 'CreditDesignationStatement');

      if (this.data.content.accreditingBody === 'AAFP') {
        this.accreditationStatementLabel = 'Certified Activity Credit Statement';
      } else {
        this.accreditationStatementLabel = 'Accreditation Statement';
      }

      if (this.data.content.accreditingBody === 'AAPA') {
        this.aapaLogo = '/assets/images/AAPALogo.jpg';
      }
      if (this.data.content.accreditingBody === 'ANCC') {
        this.anccLogo = '/assets/images/ANCCLogo.jpg';
      }
      if (this.data.content.accreditingBody === 'ACPE') {
        this.acpeLogo = '/assets/images/ACPELogo.jpg';
      }
    } else {
      this.accreditationStatement = null;
      this.creditDesignationStatement = null;
      this.creditTypeDisplay = null;
    }
  }

  getStatementOfCompletion() {
    let statement = null;

    if (this.data.content.certificate) {
      if (this.data.content.accreditedCertificate && this.data.content.providerCertificate) {
        statement = 'A credit claim certificate is provided at successful completion or a publisher’s statement of completion is available for other users.';
      } else if (this.data.content.accreditedCertificate) {
        statement = 'A credit claim certificate is provided at successful completion.';
      } else if (this.data.content.providerCertificate) {
        statement = 'A statement of completion is available if successfully completed.';
      }
    }

    return statement;
  }

  getDesignationDisplay(key: string) {
    if (key === 'other') {
      return 'Other (see MOC Statement)';
    } else {
      const designation = DesignationOptions.find((option) => option.key === key);
      return designation ? designation.value : null;
    }
  }

  getLearningFormatDisplay(accreditingBody: string, creditType: string, learningFormat: string, otherLearningFormat: string, noneLearningFormat: string) {
    if (accreditingBody === 'NONE') {
      return `${noneLearningFormat}`;
    } else {
      const creditTypeOption = LearningFormatOptions.get().find(option => option.creditType === creditType);
      if (creditTypeOption) {
        const option = creditTypeOption.options.find(o => o['key'] === learningFormat);
        if (option) {
          const label = option.value;
          if (learningFormat === 'other' && otherLearningFormat) {
            return `${label} - ${otherLearningFormat}`;
          } else {
            return label;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  }

  variableSubstitution(stringOrArray: string | Array<string>, typeStr: string) {
    let returnValue: string;
    // console.log('doing string replace. . .');
    // console.log('what is s1: ', stringOrArray);
    if (stringOrArray) {
      if (typeof stringOrArray === 'string') {
        returnValue = this.substitute(stringOrArray);
      } else if (typeof stringOrArray === 'object' && stringOrArray.length > 0) {
        const ary = [];
        stringOrArray.forEach(str => {
          ary.push(this.substitute(str));
        });
        returnValue = ary.join('');
      } else {
        returnValue = null;
      }
    } else {
      returnValue = null;
    }

    if (returnValue != null && returnValue.indexOf('[') > -1) {
      LoggingService.warn('Unsubstituted variable found for \'' + typeStr + '\':');
    }

    return returnValue;
  }

  substitute(strValue: string) {
    const plannedExpireDate = this.data.content.plannedExpireDate;

    const dateFormat = 'MMMM Do, YYYY';

    let creditNumberDiv10: string = '0';
    try {
      creditNumberDiv10 = `${parseFloat(this.data.content.numberOfCredits) / 10.0}`;
    } catch {
        // TODO: no catch???
    }

    strValue = this.substituteValue(strValue, '[providerName]', this.providerOrgService.provider.name);
    strValue = this.substituteValue(strValue, '[creditNumber]', this.data.content.numberOfCredits);
    strValue = this.substituteValue(strValue, '[learningFormat]', this.learningFormatDisplay);
    strValue = this.substituteValue(strValue, '[creditType]', this.creditTypeDisplay);
    strValue = this.substituteValue(strValue, '[coProvider]', this.data.content.coProvider);
    strValue = this.substituteValue(strValue, '[plannedPublicationDate]', moment(this.data.content.plannedPublicationDate).format(dateFormat));
    strValue = this.substituteValue(strValue, '[courseTitle]', this.data.content.title);
    strValue = this.substituteValue(strValue, '[courseSubtitle]', this.data.content.subtitle);
    strValue = this.substituteValue(strValue, '[plannedExpireDate]', moment(plannedExpireDate).format(dateFormat));
    strValue = this.substituteValue(strValue, '[score]', this.data.content.minimumPassingScore);
    strValue = this.substituteValue(strValue, '[accreditingBody]', this.data.content.accreditingBody);
    strValue = this.substituteValue(strValue, '[accreditingOrganizationName]', this.data.content.accreditingOrganizationName);
    strValue = this.substituteValue(strValue, '[creditNumberDiv10]', creditNumberDiv10);
    strValue = this.substituteValue(strValue, '[providerCourseId]', this.data.content.providerCourseId);
    strValue = this.substituteValue(strValue, '[universalActivityNumber]', this.data.content.universalActivityNumber);

    strValue = this.substituteCopyRightedNames(strValue);

    return strValue;
  }

  substituteValue(str, substitutionTarget, value) {
    try {
      return str.split(substitutionTarget).join(this.highlight(value, substitutionTarget));
    } catch (e) {
      LoggingService.warn('Failed substitution for variable' + substitutionTarget);
      return str;
    }
  }

  substituteCopyRightedNames(strValue: string) {
    const amaPra1 = 'AMA PRA Category 1 Credit™';
    const amaPra2 = 'AMA PRA Category 2 Credit™';
    const amaPra1s = 'AMA PRA Category 1 Credit(s)™';
    const amaPra2s = 'AMA PRA Category 2 Credit(s)™';

    strValue = strValue.split(amaPra1).join(this.highlight('<em>' + amaPra1 + '</em>', amaPra1));
    strValue = strValue.split(amaPra2).join(this.highlight('<em>' + amaPra2 + '</em>', amaPra2));
    strValue = strValue.split(amaPra1s).join(this.highlight('<em>' + amaPra1s + '</em>', amaPra1s));
    strValue = strValue.split(amaPra2s).join(this.highlight('<em>' + amaPra2s + '</em>', amaPra1));

    return strValue;
  }

  highlight(value: string, attribute: string) {
    return `${value != null ? '<span style=\'background-color: #ffffda;\'>' + value + '</span>' : ''}`;
  }

  constructContributorData(user) {
    let contributorData;
    if (user) {
      contributorData = {
        'firstName': user.firstName,
        'lastName': user.lastName,
        'lastUpdated': user.lastUpdated,
        'title': user.title,
        'status': user.status,
        'roles': user.roles,
        'hasDisclosures': false,
        'activityRole': '',
        'credentials': [],
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
      contributorData = this.getActivityRole(user.id, contributorData);
      contributorData = this.getCredentials(user.id, contributorData);
    }
    return contributorData;
  }

  getActivityRole(userId, contributorData) {
    const authorRecord = this.data.content.authors.find((a) => a.id === userId);
    contributorData.activityRole = authorRecord ? authorRecord.role : '';

    return contributorData;
  }

  getCredentials(userId, contributorData) {
    this.credentialsService.findByUserId(userId, false).subscribe((credentials: Credential[]) => {
      credentials.forEach(credential => {
        contributorData.credentials.push(credential);
      });
    });

    return contributorData;
  }

  getDisclosures(userId, contributorData) {
    this.disclosureService.query(userId).subscribe(disclosures => {
      disclosures.forEach((disclosure) => {
          // ensure the disclosure is in the list of relevant dosclosures
         if (this.data.content.disclosures.indexOf(disclosure.id) > -1) {
            contributorData.hasDisclosures = true;
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
         }
      });
    });
    return contributorData;
  }

  //  TODO: why is this happening? Libraries are available for this, moment.js for example. This is madness
  getTimeInHHMMSS(timeInMinutes) {
    const minutes = timeInMinutes % 60;
    const hours = (timeInMinutes - minutes) / 60;

    return `${hours.toString()} hr, ${minutes.toString()} mins`;
  }

  onResponseClick(response) {
    this.dialogRef.close(response);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  get coProvider(): string | undefined {
    return undefined;
  }
}
