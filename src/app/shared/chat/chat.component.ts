import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Howl} from 'howler';
import {trigger, transition, style, animate} from '@angular/animations';
import {ChatService} from '../services/chat.service';
import {SessionService} from '../services/session.service';
import {NotificationsService} from 'angular2-notifications';
import {Subscription} from 'rxjs';
import {skip} from 'rxjs/operators';

@Component({
  selector: 'app-chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [ // TODO: share animations
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('200ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('200ms', style({opacity: 0}))
        ])
      ]
    )
  ]
})
export class ChatComponent implements OnInit, OnDestroy {
   @Input() roomId: number; //string = '-default';
  @Input() chatTitle: string = 'Chat';
  @Input() alwaysExpand: boolean = false;
  @Input() alwaysMute: boolean = false;
  @Input() styleClass: string = '';

  chatSubscription: Subscription;
  eventSubscription: Subscription;

  connectedUsers: any[] = [];
  eventInterval: any;
  localChatLog: any[] = [];
  unseenCount: number = 0;
  chatInput: any;
  expanded: boolean = this.alwaysExpand = false;
  muted: boolean = this.alwaysMute = false;

  constructor(private chatService: ChatService,
              private sessionService: SessionService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit() {
    // fetch old state and populate if it exists
    this.localChatLog = JSON.parse(localStorage.getItem('chat-log:' + this.roomId)) || [];
    this.unseenCount = JSON.parse(localStorage.getItem('chat-unseen:' + this.roomId)) || 0;
    this.chatInput = localStorage.getItem('chat-inputted:' + this.roomId) || '';

    // add our subscriptions
    this.chatService.joinChatRoom();
    this.chatSubscription = this.chatService.chatLog.pipe(skip(1)).subscribe( value => {
      this.messageHandler(value);
    });
    this.eventSubscription = this.chatService.eventLog.pipe(skip(1)).subscribe( value => {
      this.eventHandler(value);
    });
    // is there a better way to set user statuses?
    this.eventInterval = setInterval(() => {

      this.sendEvent((this.expanded) ? 'active' : 'inactive');
      Object.keys(this.connectedUsers).forEach( key => {
        // if connected user has been inactive for a while, remove them from the connected user list
        if (((new Date().getTime() - this.connectedUsers[key].timestamp) > 7000)) {
          delete this.connectedUsers[key];
        }
      });
    }, 5000); // send event every five seconds
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
    this.chatSubscription.unsubscribe();
    if (this.eventInterval) {
      clearInterval(this.eventInterval);
    }
  }

  sendMessage() {
    console.log('**** new message send', this.chatInput );
    if (this.chatInput) {
      this.chatService.sendMessage({
        body: this.chatInput,
        roomId: this.roomId,
        authorName: this.sessionService.loggedInUser.firstName + ' ' + this.sessionService.loggedInUser.lastName,
        authorEmail: this.sessionService.loggedInUser.email,
        timestamp: new Date().getTime()
      });
      this.chatInput = '';
      localStorage.removeItem('chat-inputted:' + this.roomId);
    }
  }

  sendEvent(event) {
    if (event === 'typing') {
      localStorage.setItem('chat-inputted:' + this.roomId , this.chatInput);
    }
    this.chatService.sendEvent({
      event: event,
      roomId: this.roomId,
      authorName: this.sessionService.loggedInUser.firstName + ' ' + this.sessionService.loggedInUser.lastName,
      authorEmail: this.sessionService.loggedInUser.email,
      timestamp: new Date().getTime()
    });
  }

  messageHandler(value) {
    // console.log('**** new message event', value);
    if (value?.roomId === this.roomId && this.localChatLog[this.localChatLog.length-1] !== value) {
      if (!this.expanded) {
        this.unseenCount++;
        localStorage.setItem('chat-unseen:' + this.roomId, JSON.stringify(this.unseenCount));
        this.notificationsService.alert('New message', 'You have a new message from ' + value.authorName + ' in ' + this.chatTitle);
      }
      this.playMessageSound();
      this.localChatLog.push(value);
      localStorage.setItem('chat-log:' + this.roomId, JSON.stringify(this.localChatLog)); // TODO: add limit
    }
  }

  eventHandler(value) {
    if (value?.roomId === this.roomId) {
      if (!this.connectedUsers[value.authorName]) {
        this.connectedUsers[value.authorName] = {};
      }
      if (value.event === 'active' || value.event === 'inactive') {
        this.connectedUsers[value.authorName].email = value.authorEmail;
        this.connectedUsers[value.authorName].status = value.event;
        this.connectedUsers[value.authorName].timestamp = value.timestamp;
      }
      if (value.event === 'typing') {
        this.connectedUsers[value.authorName].status = 'active';
        this.connectedUsers[value.authorName].typing = new Date().getTime();
      }
    }
  }

  playMessageSound() {
    if (!this.muted) {
      if (this.expanded) {
        const sound = new Howl({src: ['/assets/audio/intuition.mp3'], volume: 0.25});
        sound.play();
      } else {
        const sound = new Howl({src: ['/assets/audio/sharp.mp3'], volume: 0.25});
        sound.play();
      }
    }
  }

  expand() {
    this.expanded = true;
    this.unseenCount = 0;
    localStorage.setItem('chat-unseen:' + this.roomId, JSON.stringify(this.unseenCount));
    this.sendEvent('active');
  }

  collapse() {
    this.expanded = false;
    this.sendEvent('inactive');
  }

  muteUnmute() {
    this.muted = !this.muted;
  }

  lessThan500Old(timestamp) {
    return ((new Date().getTime() - timestamp) < 500);
  }
}
