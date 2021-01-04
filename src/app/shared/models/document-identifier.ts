export class DocumentIdentifier {
  id?: string;
  templateId?: string;
  dateCreated?: Date;
  lastUpdated?: Date;
  version?: number;

  constructor(params: Partial<DocumentIdentifier> = {}) {
    Object.assign(this, params);
  }
}
