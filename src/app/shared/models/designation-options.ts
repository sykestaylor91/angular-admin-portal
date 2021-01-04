import {KeyValue} from './key-value';

export const DesignationOptions: KeyValue[] = [
  {key: 'ce', value: 'CE'}, // Continuing Education
  {key: 'ce_cme', value: 'CE/CME'}, // Continuing Education/Continuing Medical Education
  {key: 'ce_cme_moc', value: 'CE/CME & MOC'}, // Continuing Education/Continuing Medical Education & Maintenance of Certification
  {key: 'moc', value: 'MOC'}, // Maintenance of Certification
  {key: 'other', value: 'Other'},
  {key: 'none', value: 'None'}
];
