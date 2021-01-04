import {DocumentIdentifier} from './document-identifier';
import {ContentType} from './content-type';

export class Media extends DocumentIdentifier {
  author?: string;
  contentType?: ContentType;
  userId?: string;
  uri?: string;
  title?: string;
  status?: string;
  caption?: string;
  levelOfEvidence?: string;
  providerLogo?: boolean = false;
  thumbnail?: string;

  static copy(source: Media): Media {
    return new Media(source);
  }

  constructor(params: any = {}) {
    super(params);
  }
}
