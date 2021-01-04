export interface FilterListOption {
  key: string;
  value: string;
}

export interface FilterList {
  label?: string;
  selected?: string;
  options: any[];
  dataPropertyName?: string;
}
