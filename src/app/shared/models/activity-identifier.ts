import {DocumentIdentifier} from './document-identifier';
import {ActivityStatus} from './activity-status';
import {ExamType} from './exam-type';

export class ActivityIdentifier extends DocumentIdentifier {
  userId?: string;
  title?: string;
  subtitle?: string;
  type?: ExamType;
  questions?: string[];
  accreditingBody?: string;
  accreditationType?: string;
  status?: ActivityStatus = ActivityStatus.UnderConstruction;
}
