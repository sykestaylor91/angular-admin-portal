import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChosenUserIdService {
  private messageSource = new BehaviorSubject('guest');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  async getMessage() {
    const myMessage = await this.messageSource;
    return myMessage;
  }
}
