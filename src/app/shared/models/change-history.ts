import {DocumentIdentifier} from './document-identifier';

export class ChangeHistory extends DocumentIdentifier {

  private _name: string;

  get name() {
    return this._name;
  }

  set name(value: string) {
    this._name = (value || '').trim();
  }

  input: string;
  value: string;
  withDiff: string;
  added: string = '';
  removed: string = '';
  timestamp: number;
  userId: string;

  static copy(source: ChangeHistory): ChangeHistory {
    return new ChangeHistory(source);
  }

  constructor(params: any = {}) {
    super(params);
  }

}
