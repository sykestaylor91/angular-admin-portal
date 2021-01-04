import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SessionService} from '../shared/services/session.service';
import {AccountService} from '../shared/services/account.service';
import {CheckoutBasketService} from '../shared/services/checkout-basket.service';
import {NotificationsService} from 'angular2-notifications';
import {RoutesRp} from '../shared/models/routes-rp';

@Component({
  selector: 'app-course-checkout',
  templateUrl: './course-checkout.component.html'
})
export class CourseCheckoutComponent implements OnInit {
  private provider: any = {'id': '210'};

  constructor(private router: Router,
              private notificationsService: NotificationsService,
              private accountService: AccountService,
              private checkoutBasketService: CheckoutBasketService,
              private sessionService: SessionService) {
  }

  ngOnInit() {
  }

  addMoreCoursesClickHandler() {
    this.router.navigate(['/activity-selector']);
  }

  tempCheckout() {
    const that = this;
    // TODO Replace temporary checkout with real account service interaction
    this.checkoutBasketService.basketContents.forEach(function (course) {
      that.sessionService.loggedInUser.coursesOwned.push(course.id);
    });
    this.checkoutBasketService.basketContents = [];
    this.notificationsService.success('Success', 'Purchase Complete');
    this.router.navigate([RoutesRp.Home]);
  }

  checkout() {
    const that = this;

    // TODO Verify that this works and that basket contents etc is all fine
    if (this.checkoutBasketService.basketContents && this.checkoutBasketService.basketContents.length > 0) {
      if (this.checkoutBasketService.minimumTopUpRequired > 0) {
        this.topUp();
        this.notificationsService.info('Top up required', 'You need to top up before you can proceed with your purchase.');
      } else {
        that.checkoutBasketService.basketContents.forEach(function (course) {
          that.accountService.getUserWallet().subscribe(data => {
            if (data.report.Total.Balance < course.price) {
              that.topUp();
            } else {
              that.purchaseCourse(course);
            }
          });
        });
      }
    }
  }

  purchaseCourse(course) {
    this.accountService.runProcess('L9.4.1',
      this.constructProcessData(this.sessionService.loggedInUser.id, course.id)).subscribe(purchaseResponse => {
      if (purchaseResponse.report.redir && purchaseResponse.report.redir.goToURL) {
        // this.redirect(purchaseResponse.report.redir.goToURL); What to do here? purchase course shouldn't need to redirect
      }
    });
  }

  initUser() {
    // TODO move saveTxReader to sign up process when a reader is first associated with a provider
    this.accountService.saveTxReader(this.constructReaderData()).subscribe();
  }

  topUp() {
    this.accountService.runProcess('L9.0', this.constructL9ProcessData()).subscribe();
  }

  constructReaderData() {
    return {
      'id': this.sessionService.loggedInUser.id,
      'organisationId': this.provider.id
    };
  }

  constructL9ProcessData() {
    // L9.0 Process data
    return {
      'userId': this.sessionService.loggedInUser.id,
      'organisationId': this.provider.id,
      'eventDate': new Date(),
      'amount': this.checkoutBasketService.topUpAmount
    };
  }

  constructProcessData(readerId, courseId) {
    // L9.4.1 Process data
    return {
      'userId': readerId,
      'examId': courseId,
      'eventDate': new Date()
    };
  }

  redirect(url) {
    window.location.href = url;
  }

}
