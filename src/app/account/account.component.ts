import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AccountService} from '../shared/services/account.service';
import {ProviderOrgService} from '../shared/services/provider-org.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
  public title: string = 'Account';
  public provider: any = {
    id: '210',
    name: 'American Association of Learning',
    route: '',
    domain: '',
    contactInfo: '',
    status: 'active'
  };
  public currentPlan: any;
  public plans: any;

  constructor(private router: Router,
              private accountService: AccountService,
              public providerService: ProviderOrgService) {
  }

  ngOnInit() {
    const that = this;
    this.accountService.queryPricingPlans().subscribe(data => {
      this.plans = data.pricingplans;
      this.accountService.currentSubscription(that.constructCurrentSubscriptionRequest()).subscribe(subscriptionData => {
        this.plans.forEach((plan) => {
          if (subscriptionData.productsubscription && plan.id === subscriptionData.productsubscription[0].PricingPlanId) {
            that.currentPlan = plan.name;
          }
        });
      });
    });
  }

  constructCurrentSubscriptionRequest() {
    return {
      'organisationId': this.provider.id
    };
  }

  registrationFormEditClickHandler() {
    this.router.navigate(['/provider/registration']);
  }

  cancelSubscriptionClickHandler() {
    this.router.navigate(['/account/cancel-plan']);
  }

  changeSubscriptionClickHandler() {
    this.router.navigate(['/account/change-plan']);
  }

  emitSelectedImage(image) {
    if (image) {
      this.providerService.provider.logo = environment.mediaUrl + image.id + '.' + image.contentType;
    }
  }

}
