import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../shared/services/account.service';

@Component({
  selector: 'app-cancel-subscription',
  templateUrl: './cancel-subscription.component.html'
})
export class CancelSubscriptionComponent implements OnInit {
  provider: any = {'id': '210'};
  subscription: any;

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    this.accountService.currentSubscription(this.constructCurrentSubscriptionRequest).subscribe(subscriptionData => {
      this.subscription = subscriptionData;
    });
  }

  cancelSubscriptionClickHandler() {
  }

  constructCurrentSubscriptionRequest() {
    return {
      'organisationId': this.provider.id
    };
  }

}
