import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AccountService} from '../../../shared/services/account.service';
import {ChangePlanService} from '../change-plan.service';

@Component({
  selector: 'app-confirm-switch',
  templateUrl: './confirm-switch.component.html'
})
export class ConfirmSwitchComponent implements OnInit {
  newPlan: any;
  currentPlan: any;
  changeData: any;

  constructor(private accountService: AccountService,
              public changePlanService: ChangePlanService,
              private router: Router) {
  }

  ngOnInit() {
    this.changePlanService.plans.forEach((plan) => {
      if (plan.name === this.changePlanService.selectedPlan) {
        this.newPlan = plan;
      }
      const pricePlan = this.changePlanService.currentPlan.productsubscription[0].PricingPlanId;
      if (this.changePlanService.currentPlan.productsubscription && plan.id === pricePlan) {
        this.currentPlan = plan.name;
      }
    });
    this.performDryRun();
  }

  performDryRun() {
    this.accountService.dryrunProcess('L7.0', this.constructL7ProcessData()).subscribe(changePlanResponse => {
      if (changePlanResponse.report) {
        this.changeData = changePlanResponse.report;
        // first payment within paymentData
        // days of value within adjustmentData
        // residual value from current plan adjustmentData.amount
        // residual value from current plan (rate) adjustmentData.
      }
    });
  }


  changePlan() {
    this.accountService.runProcess('L7.0', this.constructL7ProcessData()).subscribe(changePlanResponse => {
    });
  }

  constructL7ProcessData() {
    // for L7.0
    const processData = {
      'organisationId': this.changePlanService.provider.id,
      'pricingPlanIdNew': this.changePlanService.selectedPlan.id,
      'eventDate': new Date()
    };
    return processData;
  }

  redirect(url) {
    window.location.href = url;
  }

  repickClickHandler() {
    this.changePlanService.reset();
  }

  cancelClickHandler() {
    this.changePlanService.reset();
    this.router.navigate(['/account']);
  }

}
