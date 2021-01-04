import {Component, OnInit, OnDestroy} from '@angular/core';
import {CheckoutBasketService} from '../services/checkout-basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html'
})
export class BasketComponent implements OnInit, OnDestroy {

  constructor(public checkoutBasketService: CheckoutBasketService) {
  }

  ngOnInit() {
    this.checkoutBasketService.calculateTotalPrice();
  }

  ngOnDestroy() {
    this.checkoutBasketService.save();
  }

  deleteClickHandler(id) {
    this.checkoutBasketService.removeFromBasket(id);
  }
}
