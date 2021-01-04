import {Injectable} from '@angular/core';
import {SessionService} from './session.service';
import {Exam} from '../models/exam';

@Injectable()
export class CheckoutBasketService {
    totalPrice: number;
    basketContents: Exam[] = [];
    minimumTopUpRequired: number = 0;
    topUpAmount: number = 0;

    constructor (private sessionService: SessionService) {
    }

    initiateBasket() {
      this.basketContents = this.sessionService.loggedInUser.basketContents;
    }

    save() {
      // TODO: REMOVE THIS
      // this.sessionService.loggedInUser.basketContents = this.basketContents;
      // this.userService.save(this.sessionService.loggedInUser).subscribe(data => {
      // });
    }

    calculateTotalPrice() {
      this.totalPrice = 0;
      const that = this;
      this.basketContents.forEach(function(item) {
        that.totalPrice += Number(item.price);
      });
    }

    addToBasket(exam: Exam) {
      this.basketContents.push(exam);
    }

    removeFromBasket(id) {
      for (let i = this.basketContents.length - 1; i >= 0; i--) {
        if (this.basketContents[i].id === id) {
          this.basketContents.splice(i, 1);
        }
      }
      this.calculateTotalPrice();
    }

}
