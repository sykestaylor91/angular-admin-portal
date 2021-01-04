
export class EmailTemplateInfo {
  name: string;
  data: any;
}

export class EmailTemplate {
  toAddresses: string[];
  template: EmailTemplateInfo;
  body: string;
}
