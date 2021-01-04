import {Pipe, PipeTransform} from '@angular/core';
import {ActivityStatus} from '../../shared/models/activity-status';

@Pipe({
  name: 'activityStatus'
})
export class ActivityStatusPipe implements PipeTransform {

  static getFriendlyStatusName(value: ActivityStatus | undefined) {
    switch (value) {

      case ActivityStatus.Abandoned:
        return 'Abandoned';
      case ActivityStatus.Deleted:
        return 'Deleted';
      case ActivityStatus.Returned:
        return 'Returned for amendment';
      case ActivityStatus.ReadyToReview:
        return 'Ready for review';
      case ActivityStatus.Issued:
        return 'Ready to publish';
      case ActivityStatus.Published:
        return 'Published';
      case ActivityStatus.UnderConstruction:
        return 'Under construction';
      case ActivityStatus.UnderAmendment:
        return 'Under amendment';
      case ActivityStatus.UnderReview:
        return 'Under review';
      case ActivityStatus.ReviewApproved:
        return 'Approved by reviewer';
      case ActivityStatus.Withdrawn:
        return 'Withdrawn';
      case ActivityStatus.NotSet:
        return 'Not Set';
      default:
        return value;
    }
  }

  transform(value: string): any {
    return ActivityStatusPipe.getFriendlyStatusName(value as ActivityStatus);
  }

}
