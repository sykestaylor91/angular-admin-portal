import {Column, ColumnType} from '../../shared/models/column';

export const EvaluationListColumns: Column[] = [
  {
    type: ColumnType.Text,
    field: 'title',
    width: '35%',
    title: 'Post-activity title'
  },
  {
    type: ColumnType.Text,
    field: 'subtitle',
    width: '20%',
    title: 'Subtitle'
  },
  {
    type: ColumnType.Date,
    field: 'lastUpdated',
    width: '20%',
    title: 'Date updated'
  },
  {
    type: ColumnType.CustomButton,
    field: 'parent',
    width: '20%',
    customLabel: 'Show parents',
    title: 'Parent-activity(ies)'
  }
];
