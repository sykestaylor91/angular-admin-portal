import {environment} from '../../../environments/environment';

export abstract class LoggingService {
  static log(message: any, ...optionalParams: any[]): void {
    if (!environment.production) {
      console.log(message, optionalParams);
    }
  }

  static warn(message: any, ...optionalParams: any[]) {
    if (!environment.production) {
      console.warn(message, optionalParams);
    }
  }
}
