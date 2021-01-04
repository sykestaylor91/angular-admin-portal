import { ClinicalExamModule } from './clinical-exam.module';

describe('ClinicalExamModule', () => {
  let clinicalExamModule: ClinicalExamModule;

  beforeEach(() => {
    clinicalExamModule = new ClinicalExamModule();
  });

  it('should create an instance', () => {
    expect(clinicalExamModule).toBeTruthy();
  });
});
