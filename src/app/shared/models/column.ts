export enum ColumnType {
  Text = 'text',
  Date = 'date',
  Status = 'status',
  Parent = 'parent',
  FirstNWords = 'firstNWords',
  FirstNChars = 'firstNChars',
  AddRemoveButton = 'addRemoveButton',
  CustomButton = 'customButton',
  CustomHTML = 'customHTML',
  CheckBox = 'checkBox',
  FirstNWordsStripTags = 'firstNWordsStripTags',
  StripTags = 'stripTags',
  CustomRadio = 'customRadio',
  ArrayLinks = 'arrayLinks',
  Tags = 'tags',
  AlternativeForm = 'alternativeForm'
}

export interface Column {
  title?: string;
  class?: string;
  headerClass?: string;
  type: ColumnType;
  field?: string;
  width?: string; // TODO: make required
  limit?: number;
  dependency?: string;
  dependencyValue?: string;
  routePath?: string;
  customLabel?: string;
}
