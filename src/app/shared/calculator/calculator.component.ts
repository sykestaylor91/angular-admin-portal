import { Component, OnInit } from '@angular/core';
import {NotificationsService} from 'angular2-notifications';
import {EventTrackingService} from '../services/event-tracking.service';
import {SessionService} from '../services/session.service';
import {EventTypes} from '../models/event-types.enum';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  public displayValue: any;
  private acceptedCharsForEval: string[] = [ '/', '*',  '+',  '-', '.', '(', ')', '%'];

  constructor( private notificationsService: NotificationsService,
               private sessionService: SessionService,
               private eventTrackingService: EventTrackingService) {
  }

  ngOnInit() {
  }

  addChar(character) {
    if (this.displayValue == null || this.displayValue === '0'  || this.displayValue === 0  || !this.displayValue) {
      this.displayValue = character;
    } else {
      this.displayValue += character;
    }
  }

  reset() {
    this.displayValue = '0';
  }

  cos() {
    if (this.checkNum()) {
      this.displayValue = Math.cos(this.displayValue);
      this.eventTrackingService.trackEvent(EventTypes.calculationPerformed, {displayValue: this.displayValue, userId: this.sessionService.loggedInUser.id});
    }
  }

  sin() {
    if (this.checkNum()) {
      this.displayValue = Math.sin(this.displayValue);
      this.eventTrackingService.trackEvent(EventTypes.calculationPerformed, {displayValue: this.displayValue, userId: this.sessionService.loggedInUser.id});
    }
  }

  tan() {
    if (this.checkNum()) {
      this.displayValue = Math.tan(this.displayValue);
      this.eventTrackingService.trackEvent(EventTypes.calculationPerformed, {displayValue: this.displayValue, userId: this.sessionService.loggedInUser.id});
    }
  }

  sqrt() {
    if (this.checkNum()) {
      this.displayValue = Math.sqrt(this.displayValue);
      this.eventTrackingService.trackEvent(EventTypes.calculationPerformed, {displayValue: this.displayValue, userId: this.sessionService.loggedInUser.id});
    }
  }

  ln() {
    if (this.checkNum()) {
      this.displayValue = Math.log(this.displayValue);
      this.eventTrackingService.trackEvent(EventTypes.calculationPerformed, {displayValue: this.displayValue, userId: this.sessionService.loggedInUser.id});
    }
  }

  exp() {
    if (this.checkNum()) {
      this.displayValue = Math.exp(this.displayValue);
      this.eventTrackingService.trackEvent(EventTypes.calculationPerformed, { displayValue: this.displayValue, userId: this.sessionService.loggedInUser.id });
    }
  }

  deleteChar() {
    this.displayValue = this.displayValue.toString().substring(0, this.displayValue.length - 1);
  }

  percent() {
    this.displayValue = this.displayValue + '%';
  }

  changeSign() {
    if (this.displayValue.toString().substring(0, 1) === '-') {
      this.displayValue = this.displayValue.toString().substring(1, this.displayValue.length);
    } else {
      this.displayValue = '-' + this.displayValue;
    }
  }

  compute() {

    if (this.checkNum()) {
      // tslint:disable-next-line
      this.displayValue = eval(this.displayValue.toString());
      this.eventTrackingService.trackEvent(EventTypes.calculationPerformed, {displayValue: this.displayValue, userId: this.sessionService.loggedInUser.id});
    }
  }

  square() {
    if (this.checkNum()) {
      // tslint:disable-next-line
      const evalled = eval(this.displayValue.toString());
      this.displayValue = (evalled * evalled).toString();
      this.eventTrackingService.trackEvent(EventTypes.calculationPerformed, {displayValue: this.displayValue, userId: this.sessionService.loggedInUser.id});
    }
  }

  checkNum() {
    if (this.displayValue) {
      for (let i = 0; i < this.displayValue.length; i++) {
        const ch = this.displayValue.charAt(i);
        if (ch < '0' || ch > '9') {
          if (this.acceptedCharsForEval.indexOf(ch) < 0) {
            this.notificationsService.error('Invalid', 'You have entered an invalid value.');
            return false;
          }
        }
      }
      return this.displayValue; // if falsy we still don't want to eval
    }
  }

}
