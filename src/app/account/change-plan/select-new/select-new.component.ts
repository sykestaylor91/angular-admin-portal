import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AccountService} from '../../../shared/services/account.service';
import {ChangePlanService} from '../change-plan.service';

@Component({
  selector: 'app-select-new',
  templateUrl: './select-new.component.html'
})
export class SelectNewComponent implements OnInit {

  constructor(private changePlanService: ChangePlanService,
              private accountService: AccountService,
              private router: Router) {
  }

  ngOnInit() {
    this.accountService.queryPricingPlans().subscribe(data => {
      this.changePlanService.plans = data.pricingplans;
    });

    this.accountService.currentSubscription(this.constructCurrentSubscriptionRequest()).subscribe(subscriptionData => {
      this.changePlanService.currentPlan = subscriptionData;
    });
  }

  selectPlan(selectedPlan) {
    const that = this;
    this.changePlanService.plans.forEach(function (plan) {
      if (plan.id === selectedPlan) {
        that.changePlanService.selectedPlan = plan;
      }
    });
    this.changePlanService.step = 2;
  }

  constructCurrentSubscriptionRequest() {
     return {
      'organisationId': this.changePlanService.provider.id
    };
  }

  cancelClickHandler() {
    this.changePlanService.reset();
    this.router.navigate(['/account']);
  }

}
