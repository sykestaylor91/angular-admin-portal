export enum ColumnDataType {
  Array,
  CheckMark,
  Date,
  Empty,
  HTML,
  Menu,
  Radio,
  RouterLink,
  RowIndex,
  Text,
}

export interface GridColumn {
  displayName?: string;
  field?: string;
  arrayColumn?: ArrayColumn;
  columnClassName: string;
  iconTooltip?: string;
  type: ColumnDataType;
}

export interface ArrayColumn extends GridColumn {
  routePath: string;
}
