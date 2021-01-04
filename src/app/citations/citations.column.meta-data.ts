import {ColumnDataType, GridColumn} from '../shared/grid-table/grid.column';

export class CitationsColumnMetaData {
  static getExamColumnMetaData(): GridColumn[] {
    const exam = CitationsColumnMetaData.getCourseCitationColumnMetaData();
    exam.splice(0, 0, {
      columnClassName: 'col-1 align-center',
      type: ColumnDataType.RowIndex
    });
    return exam;
  }

  static getCourseCitationColumnMetaData(): GridColumn[] {
    return [
      {
        columnClassName: 'col-1',
        type: ColumnDataType.Menu
      },
      {
        displayName: 'Citation',
        columnClassName: 'col-7',
        field: 'text',
        type: ColumnDataType.HTML
      },
      {
        columnClassName: 'col-2',
        field: 'activities',
        type: ColumnDataType.Array,
        arrayColumn: {
          displayName: 'title',
          columnClassName: '',
          field: 'id',
          routePath: '/activity-manager/edit/',
          type: ColumnDataType.RouterLink
        }
      },
      {
        displayName: 'Date updated',
        columnClassName: 'col-2',
        field: 'lastUpdated',
        type: ColumnDataType.Date
      }
    ];
  }
}
