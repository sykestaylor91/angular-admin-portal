import {DocumentIdentifier} from './document-identifier';

export class Message extends DocumentIdentifier {
  id: string;
  title: string;
  author: string;
  content: string;
  type: string;
  status: string;

  static copy(source: Message): Message {
    return new Message(source);
  }

  constructor(params: any = {}) {
    super(params);
  }
}
