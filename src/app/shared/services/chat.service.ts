import { Injectable, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
    socketServerUrl = 'https://ws-cscm.app.nowce.com/';
    socket: any;
    lastMessageTimeStamp: number = new Date().getTime(); // stop spamming and duplicates
    public chatLog: BehaviorSubject<any>;
    public eventLog: BehaviorSubject<any>;

    constructor() {
      this.socket = io(this.socketServerUrl);
      this.chatLog = new BehaviorSubject(<any>{});
      this.eventLog = new BehaviorSubject(<any>{});
    }

    ngOnDestroy() {
      this.socket.disconnect();
    }

    public sendMessage(message: any) {
      if ((new Date().getTime() - this.lastMessageTimeStamp) < 1000) {
        console.log('**** throttled due to time:' + (new Date().getTime() - this.lastMessageTimeStamp), JSON.stringify(message));
      } else {
        this.socket.emit('new-message', message);
        this.lastMessageTimeStamp = new Date().getTime();
      }
    }

    public sendEvent(event: any) {
      this.socket.emit('new-event', event);
    }

    public joinChatRoom() {
      this.socket.on('new-message', (message) => {
        this.chatLog.next(message);
      });
      this.socket.on('new-event', (event) => {
        this.eventLog.next(event);
      });
    }
}

