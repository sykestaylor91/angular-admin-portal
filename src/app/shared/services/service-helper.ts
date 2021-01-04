import {ActivityStatus} from '../models/activity-status';
import {IncludeStatuses} from './exam.service';

export class ServiceHelper {

  public static GetQueryMetaUrl(resource: string, endpointName: string, activityStatus: ActivityStatus = ActivityStatus.NotSet, inclusions: IncludeStatuses = {[ActivityStatus.Deleted]: false}): string {
    let url = `${resource}/${endpointName}`;
    if (activityStatus && activityStatus !== ActivityStatus.NotSet) {
      url += `/${activityStatus}`;
    }
    let queryParameters = '';

    if (inclusions && Object.keys(inclusions).length === 0) {
      inclusions = {[ActivityStatus.Deleted]: false};
    }
    Object.keys(inclusions).forEach(key => {
      if (inclusions[key] === false || inclusions[key] === 'false') {
        queryParameters += ((queryParameters.length === 0 ? '?' : '&') + `${key}=false`);
      }
    });
    return url + queryParameters;
  }

}
