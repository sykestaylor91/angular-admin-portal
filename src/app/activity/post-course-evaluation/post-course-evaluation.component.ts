import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UserEvaluationExamService} from './user-evaluation.service';
import * as moment from 'moment';
import {Exam} from '../../shared/models/exam';
import {UserExam} from '../../shared/models/user-exam';
import {EvaluationService} from '../../shared/services/evaluation.service';
import {ProviderOrgService} from '../../shared/services/provider-org.service';
import AccreditationTableConfigurations from '../../shared/models/accreditation-table-configurations';
import LearningFormatOptions from '../../shared/models/learning-format-options';
import {LoggingService} from '../../shared/services/logging.service';
import { UserEvaluation } from '../../shared/models/user-evaluation';

@Component({
  selector: 'app-post-course-evaluation',
  templateUrl: 'post-course-evaluation.component.html'
})
export class PostCourseEvaluationComponent implements OnInit {
  @Input() selectedExam: Exam;
  @Input() userExam: UserExam;
  @Output() userEvaluationSubmitted = new EventEmitter<UserEvaluation>();

  accreditationStatement: string = 'test';
  creditClaimMaximum: number = 2;
  creditsClaimed: number = 0;
  creditTypeDisplay: string;
  creditTypeDisplayWithTrademark: string;
  disclosures: any = [];
  evaluationQuestions: any = [];
   evaluationIntroduction: string;
  learningFormatDisplay: string;
  shouldShowAccreditationStatement: boolean = true;
  shouldShowCreditClaim: boolean = true;

  constructor (
    private userEvaluationExamService: UserEvaluationExamService,
    private evaluationService: EvaluationService,
    private providerOrgService: ProviderOrgService) {
  }

  ngOnInit() {
    AccreditationTableConfigurations.getAccreditationTable(this.selectedExam.accreditingBody).forEach((item) => {
      if (item && item.key === this.selectedExam.accreditationType) {
        this.setupStatementsForItem(item);
      }
    });

    this.creditClaimMaximum = this.selectedExam.numberOfCredits ? parseFloat(this.selectedExam.numberOfCredits) : 1;

    this.learningFormatDisplay =
    this.getLearningFormatDisplay(
      this.selectedExam.accreditingBody,
      this.selectedExam.creditType,
      this.selectedExam.learningFormat,
      this.selectedExam.otherLearningFormat,
      this.selectedExam.noneLearningFormat
    );

    if (this.selectedExam.postActivityEvaluation) {
      this.evaluationService.findById(this.selectedExam.postActivityEvaluation).subscribe(postCourseEvaluation => {
        this.evaluationIntroduction = postCourseEvaluation.introduction;
        if (postCourseEvaluation.questions && postCourseEvaluation.questions.length > 0) {
          postCourseEvaluation.questions.forEach((question) => {
            this.evaluationQuestions.push(question);
          });
        }
      });
    }
  }

  creditsClaimedChanged(e) {
    if (this.creditClaimMaximum && e > this.creditClaimMaximum) {
      setTimeout(() => {
        this.creditsClaimed = this.creditClaimMaximum;
      });
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
          if (learningFormat === 'other') {
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

  setupStatementsForItem(item) {
    const creditTypeOption = item.value.creditTypeOptions.find((option) => option.key === this.selectedExam.creditType);
    if (creditTypeOption) {
      this.creditTypeDisplay = creditTypeOption.value.label;
      this.creditTypeDisplayWithTrademark = this.substituteCopyRightedNames(this.creditTypeDisplay);
    }
    this.accreditationStatement = this.variableSubstitution(item.value.accreditationStatement, 'AccreditationStatement');
  }

  variableSubstitution(stringOrArray: string | Array<string>, typeStr: string) {
    let returnValue: string;
    if (stringOrArray) {
      if (typeof stringOrArray === 'string') {
        returnValue = this.substitute(stringOrArray);
      } else if (typeof stringOrArray === 'object' && stringOrArray.length > 0) {
        const ary = [];
        stringOrArray.forEach(str => {
          ary.push(this.substitute(stringOrArray[0]));
        });
        returnValue = ary.join('');
      } else {
        returnValue = null;
      }
    } else {
      returnValue = null;
    }

    if (returnValue.indexOf('[') > -1) {
      LoggingService.warn('Unsubstituted variable found for \'' + typeStr + '\':');
    }

    return returnValue;
  }

  substitute(strValue: string) {
    const plannedExpireDate = this.selectedExam.plannedExpireDate;

    const dateFormat = 'MMMM Do, YYYY';

    let creditNumberDiv10: string = '0';
    try {
      creditNumberDiv10 = `${parseFloat(this.selectedExam.numberOfCredits) / 10.0}`;
    } catch {}

    // This is the exact same replace routine also used on the pre-activity-information-content-component, can we not replace?
    strValue = strValue.split('[providerName]').join(this.highlight(this.providerOrgService.provider.name, '[providerName]'));
    strValue = strValue.split('[creditNumber]').join(this.highlight(this.selectedExam.numberOfCredits, '[creditNumber]'));
    strValue = strValue.split('[learningFormat]').join(this.highlight(this.learningFormatDisplay, '[learningFormat]'));
    strValue = strValue.split('[creditType]').join(this.highlight(this.creditTypeDisplay, '[creditType]'));
    strValue = strValue.split('[coProvider]').join(this.highlight(this.selectedExam.coProvider, '[coProvider]'));
    strValue = strValue.split('[plannedPublicationDate]').join(this.highlight(moment(this.selectedExam.plannedPublicationDate).format(dateFormat), '[plannedPublicationDate]'));
    strValue = strValue.split('[courseTitle]').join(this.highlight(this.selectedExam.title, '[courseTitle]'));
    strValue = strValue.split('[courseSubtitle]').join(this.highlight(this.selectedExam.subtitle, '[courseSubtitle]'));
    strValue = strValue.split('[plannedExpireDate]').join(this.highlight(moment(plannedExpireDate).format(dateFormat), '[plannedExpireDate]'));
    strValue = strValue.split('[score]').join(this.highlight(null, '[score]'));
    strValue = strValue.split('[accreditingBody]').join(this.highlight(this.selectedExam.accreditingBody, '[accreditingBody]'));
    strValue = strValue.split('[accreditingOrganizationName]').join(this.highlight(this.selectedExam.accreditingOrganizationName, '[accreditingOrganizationName]'));
    strValue = strValue.split('[creditNumberDiv10]').join(this.highlight(creditNumberDiv10, '[creditNumberDiv10]'));
    strValue = strValue.split('[providerCourseId]').join(this.highlight(this.selectedExam.providerCourseId, '[providerCourseId]'));
    strValue = strValue.split('[universalActivityNumber]').join(this.highlight(this.selectedExam.universalActivityNumber, '[universalActivityNumber]'));

    strValue = this.substituteCopyRightedNames(strValue);

    return strValue;
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

  allowsClaimingCredit() {
    return true;
  }

  saveEvaluation() {
    this.userEvaluationExamService.saveEvaluation(this.creditsClaimed, this.selectedExam).then((userEvaluation: UserEvaluation) => {
      this.userEvaluationSubmitted.emit(userEvaluation);
    });
  }
}
