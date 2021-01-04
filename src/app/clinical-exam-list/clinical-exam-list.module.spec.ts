import {ClinicalExamListModule} from './clinical-exam-list.module';

describe('ClinicalExamListModule', () => {
  let clinicalExamListModule: ClinicalExamListModule;

  beforeEach(() => {
    clinicalExamListModule = new ClinicalExamListModule();
  });

  it('should create an instance', () => {
    expect(clinicalExamListModule).toBeTruthy();
  });
});
