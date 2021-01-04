import {Evaluation} from '../../shared/models/evaluation';
import {Exam} from '../../shared/models/exam';
import {ActivityStatus} from '../../shared/models/activity-status';

export type ActivityItem = Exam | Evaluation;

export interface ResolvedActivity {
  activityStatus: ActivityStatus;
  items: ActivityItem[];
}
