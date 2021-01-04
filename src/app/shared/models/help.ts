import {DocumentIdentifier} from './document-identifier';

export class Help extends DocumentIdentifier {
  id: string;
  title: string;
  author: string;
  page: string;
  value: string;
  status: string;
  attributes: string;
  specifiedPage: string;

  static copy(source: Help): Help {
    return new Help(source);
  }

  constructor(params: any = {}) {
    super(params);
  }
}
