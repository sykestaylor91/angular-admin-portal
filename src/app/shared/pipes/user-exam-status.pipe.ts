import {Pipe, PipeTransform} from '@angular/core';
import {UserExamStatus} from '../models/user-exam-status';

@Pipe({
  name: 'userExamStatus'
})
export class UserExamStatusPipe implements PipeTransform {
  transform(value: UserExamStatus): any {
    switch (value) {
      case UserExamStatus.Abandoned:
        return 'Abandoned';
      case UserExamStatus.Completed:
        return 'Complete';
      case UserExamStatus.Open:
        return 'Open';
      case UserExamStatus.Paused:
        return 'Paused';
      case UserExamStatus.Timeout:
        return 'Timed out';
    }
    return 'n/a';
  }

}
