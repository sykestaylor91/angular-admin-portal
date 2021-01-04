import {Column, ColumnType} from '../../shared/models/column';

export const ActivityManagerColumns_All: Column[] = [
  {
    type: ColumnType.FirstNWordsStripTags,
    field: 'title',
    width: '35%',
    limit: 10,
    title: 'Activity'
  },
  {
    type: ColumnType.FirstNWordsStripTags,
    field: 'subtitle',
    width: '15%',
    title: 'Subtitle'
  },
  {
    type: ColumnType.Date,
    field: 'lastUpdated',
    width: '15%',
    title: 'Updated'
  },
  {
    type: ColumnType.Date,
    field: 'plannedExpireDate',
    width: '15%',
    title: 'Expiration date'
  },
  {
    type: ColumnType.Date,
    field: 'plannedPublicationDate',
    width: '15%',
    title: 'Planned publication date'
  },
  {
    type: ColumnType.Status,
    field: 'status',
    width: '5%',
    title: 'Status'
  }
];

export const ActivityManagerColumns_Published: Column[] = [
  {
    type: ColumnType.FirstNWordsStripTags,
    field: 'title',
    width: '35%',
    title: 'Activity title'
  },
  {
    type: ColumnType.FirstNWordsStripTags,
    field: 'subtitle',
    width: '20%',
    title: 'Activity subtitle'
  },
  {
    type: ColumnType.Date,
    field: 'plannedPublicationDate',
    width: '20%',
    title: 'Date published'
  },
  {
    type: ColumnType.Date,
    field: 'plannedExpireDate',
    width: '20%',
    title: 'Expiration date'
  }
];

export const ActivityManagerColumns_Withdrawn: Column[] = [
  {
    type: ColumnType.FirstNWordsStripTags,
    field: 'title',
    width: '40%',
    title: 'Activity title'
  },
  {
    type: ColumnType.Date,
    field: 'withdrawnDate',
    width: '20%',
    title: 'Date withdrawn'
  },
  {
    type: ColumnType.Date,
    field: 'lastUpdated',
    width: '20%',
    title: 'Updated'
  },
  {
    type: ColumnType.Date,
    field: 'plannedPublicationDate',
    width: '20%',
    title: 'Publication date'
  }
];

export const ActivityManagerColumns_Template: Column[] = [
  {
    type: ColumnType.FirstNWordsStripTags,
    field: 'title',
    width: '30%',
    title: 'Activity title'
  },
  {
    type: ColumnType.FirstNWordsStripTags,
    field: 'subtitle',
    width: '3%',
    title: 'Subtitle'
  },
  {
    type: ColumnType.Date,
    field: 'lastUpdated',
    width: '15%',
    title: 'Updated'
  },
  {
    type: ColumnType.Status,
    field: 'status',
    width: '10%',
    title: 'Status'
  }
];

export const ActivityManagerColumns_Draft: Column[] = [
  {
    type: ColumnType.FirstNWordsStripTags,
    field: 'title',
    width: '40%',
    title: 'Activity title'
  },
  {
    type: ColumnType.FirstNWordsStripTags,
    field: 'subtitle',
    width: '30%',
    title: 'Subtitle'
  },
  {
    type: ColumnType.Date,
    field: 'lastUpdated',
    width: '7.5%',
    title: 'Updated'
  },
  {
    type: ColumnType.Date,
    field: 'plannedExpireDate',
    width: '7.5%',
    title: 'Expiration date'
  },
  {
    type: ColumnType.Text,
    field: 'status',
    width: '10%',
    title: 'Status'
  }
];
