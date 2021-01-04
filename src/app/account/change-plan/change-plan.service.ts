import {Injectable} from '@angular/core';

@Injectable()
export class ChangePlanService {
  selectedPlan: any;
  plans: any;
  step: number = 1;
  currentPlan: any;
  provider: any = {'id': '210'};

  constructor() {
  }

  reset() {
    this.step = 1;
    this.selectedPlan = null;
  }

}
