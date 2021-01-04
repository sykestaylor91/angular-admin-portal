import {Component, OnInit} from '@angular/core';
import {SessionService} from '../shared/services/session.service';
import {ProviderMessageService} from '../shared/services/provider-message.service';
import {Message} from '../shared/models/message';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.html'
})
export class UserMessageComponent implements OnInit {
  title: string = 'Message';
  providerMessages: any;
  messageContentTEMPORARY: string;
  disableConflictButtons: boolean;
  messageType: string = 'team';

  constructor(private sessionService: SessionService,
              private notificationsService: NotificationsService,
              private providerMessageService: ProviderMessageService) {
  }

  ngOnInit() {
    this.providerMessageService.query().subscribe(data => {
      this.providerMessages = data;
    });
  }

  setMessageType(type) {
  }

  saveNewMessage() {
    this.providerMessageService.save(this.createMessage()).subscribe(data => {
      this.notificationsService.success('Success', 'New message is now visible');
    });
  }


  createMessage() {
    const newMessage = new Message();
    newMessage.type = this.messageType;
    newMessage.content = this.messageContentTEMPORARY;
    return newMessage;
  }

}
