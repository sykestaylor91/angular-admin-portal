import {GridConfig} from '../models/grid-config';

export class GridTableConfig implements GridConfig {
  isPaged: boolean = true;
  rowCount: number = 20;
  hasDetailsRow: boolean = false;

  constructor(fields: Partial<GridTableConfig>) {
    Object.assign(this, fields);
  }
}
