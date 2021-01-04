import {Component} from '@angular/core';
import {ChangePlanService} from './change-plan.service';

@Component({
  selector: 'app-change-plan',
  templateUrl: './change-plan.component.html'
})
export class ChangePlanComponent {
  constructor(public changePlanService: ChangePlanService) {
  }

}
