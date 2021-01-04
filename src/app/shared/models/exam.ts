import {ActivityIdentifier} from './activity-identifier';
import {Role} from './role';
import {User} from './user';
import {LearningMaterial} from './learning-material';
import {Media} from './media';

export enum ReviewType {
  NotRequired = 'notRequired',
  Open = 'open',
  Blind = 'blind'
}

export enum ContributorInviteStatus {
  Invited = 'invited',
  Accepted = 'accepted'
}

export interface CommentOrReviewNote {
  userId?: string;
  person?: string;
  text?: string;
  time?: Date;
  email?:  string;
  user?: User;
  hidden?: boolean;
}

export interface ExamChangeHistory {
  [key: string]: boolean | string[];
}

export interface ExamComment {
  [key: string]: CommentOrReviewNote[];
}

export interface Author {
  id?: string;
  role?: Role;
  status?: ContributorInviteStatus;
  invited?: Date;
  accepted?: Date;
}

export class Exam extends ActivityIdentifier {
  // general info
  providerCourseId?: string;
  universalActivityNumber?: string;
  disclosureOfCommercialSupport?: string;
  welcomeMessage?: string;
  otherType?: string;
  plannedPublicationDate?: Date;
  plannedExpireDate?: Date;
  courseImage?: string;
  disclaimer?: string;
  hasImages?: boolean;
  hasVideo?: boolean;
  recommend?: number;
  notRecommend?: number;
  followOnActivity?: string;
  accreditingBody?: string;

  // configurable options
  countDown?: string = 'false';
  countDownFrom?: number = 60 * 60;
  limitAnswerAttempts?: boolean;
  answerAttempts?: number;
  estimatedCompletionTime?: any;
  courseMap?: boolean;
  hideDiscussion?: boolean;
  studyModeAllowed?: boolean;
  normalModeAllowed?: boolean;
  examModeAllowed?: boolean;
  displayScoreAverage?: boolean;
  revisitLearningMaterial?: boolean;


  // certification
  certificate?: boolean;
  accreditedCertificate?: boolean;
  providerCertificate?: boolean;
  accreditationType?: string;
  coProvider?: string;
  creditType?: string;
  otherCreditType?: string;
  numberOfCredits?: string;
  lastCreditAwardedDate?: Date;
  learningFormat?: string;
  otherLearningFormat?: string;
  noneLearningFormat?: string;
  accreditingOrganizationName?: string;
  providerNumber?: string;

  accreditingBodyLogo?: string | Media;
  activityId?: string;

  // pricing & designations
  tokens?: string;
  price?: string;
  publishDisclosures?: boolean = false;
  designation?: string;
  mocStatement?: string;
  passRate?: string;
  levelOfDifficulty?: string;
  includeStatementOfVerification?: boolean = false;

  // introduction
  introduction?: string;
  educationObjectives?: string;
  learningMaterial?: LearningMaterial[] = [{heading: '', loe: '', text: ''}];

  // copyright
  copyright?: string;
  republicationRequest?: string;
  otherInformation?: string;
  authorNotes?: CommentOrReviewNote[] = [];
  reviewerNotes?: CommentOrReviewNote[] = [];
  readerSupport?: string;

  deletedDate?: Date;
  reviewApprovedDate?: Date;
  returnForChangesDate?: Date;
  nextReviewDate?: Date;
  withdrawnDate?: Date;

  // reviewRequired?: boolean = false;
  reviewType?: ReviewType = ReviewType.NotRequired;

  disclosures?: string[];
  authors?: Author[] = [];
  citations?: string[] = [];
  maxAnswerAttempts?: number;

  programType?: string;
  passPercentage?: string;
  answersCounted?: string;
  outro?: string;
  description?: string;
  timeLimit?: string;
  minimumPassingScore?: number;
  certificationGenerationRequired?: string;

  locked?: boolean;
  preCourseExam?: string;
  postActivityEvaluation?: string;
  comments?: ExamComment = {}; // TODO?: This should not be here but should be a separate table with unique resourceId
  changeHistory?: ExamChangeHistory; // TODO?: This should not be here but should be a separate table with unique resourceId
  targetAudience?: string;
  needs?: string;
  revealAnswers?: boolean;

  // Transient data
  canRetake?: boolean;
  canResume?: boolean;

  useSecurity?: boolean;

  static copy(source?: Exam): Exam {
    return new Exam(source);
  }

  constructor(params: any = {}) {
    super(params);
  }
}

export class ResolvedExam {
  exam?: Exam;
}
