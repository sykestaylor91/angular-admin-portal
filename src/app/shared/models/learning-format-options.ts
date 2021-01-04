import {KeyValue} from './key-value';

const internetManuscriptAndTestItemOptions: KeyValue[] = [
  {key: 'internetLearning', value: 'Internet point-of-care learning'},
  {key: 'manuscriptReview', value: 'Manuscript review (for journals) '},
  {key: 'testItemWriting', value: 'Test item writing'},
];

const liveAndPerformanceCmeOptions: KeyValue[] = [
  {key: 'liveActivities', value: 'Live activity'},
  {key: 'performanceImprovementCME', value: 'Performance improvement CME'},
];

const precepRegularAndSelfAssessOptions: KeyValue[] = [
  {key: 'preceptors', value: 'Preceptors'},
  {key: 'regularlyScheduledSeries', value: 'Regularly scheduled series'},
  {key: 'selfAssessment', value: 'Self-assessment (SA) CME'},
];

const onlineAndPracticeOptions: KeyValue[] = [
  {key: 'onlineCourses', value: 'Online activities'},
  {key: 'practiceCourses', value: 'Practice activities'}
];

const enduringOptionValue = {key: 'enduringMaterials', value: 'Enduring materials '};
const homeHealthOptionValue = {key: 'homeStudy', value: 'Hospital and Health Systems Quality'};
const improvementOptionValue = {key: 'improvement', value: 'Improvement'};
const journalOptionValue = {key: 'journalBasedCME', value: 'Journal-based CME'};
const liveOptionValue = {key: 'live', value: 'Live'};
const liveProgramOptionValue = {key: 'liveProgram', value: 'Live program'};
const medicalOptionValue = {key: 'medicalJournal', value: 'Medical journal'};
const otherOptionValue = {key: 'other', value: 'Other'};
const performancePCmeOptionValue = {key: 'performanceImprovement', value: 'Performance improvement (P) CME'};
const pointOfCareOptionValue = {key: 'pointOfCare', value: 'Point of care'};
const seriesActOptionValue = {key: 'seriesActivities', value: 'Series activities'};

const enduringOption: KeyValue[] = [enduringOptionValue];
const homeHealthOption: KeyValue[] = [homeHealthOptionValue];
const improvementOption: KeyValue[] = [improvementOptionValue];
const journalOption: KeyValue[] = [journalOptionValue];
const liveOption: KeyValue[] = [liveOptionValue];
const liveProgramOption: KeyValue[] = [liveProgramOptionValue];
const medicalOption: KeyValue[] = [medicalOptionValue];
const otherOption: KeyValue[] = [otherOptionValue];
const performancePCmeOption: KeyValue[] = [performancePCmeOptionValue];
const pointOfCareOption: KeyValue[] = [pointOfCareOptionValue];
const seriesActOption: KeyValue[] = [seriesActOptionValue];

const allOptions = [
  enduringOptionValue,
  homeHealthOptionValue,
  improvementOptionValue,
  journalOptionValue,
  liveOptionValue,
  liveProgramOptionValue,
  medicalOptionValue,
  otherOptionValue,
  performancePCmeOptionValue,
  pointOfCareOptionValue,
  seriesActOptionValue
];

const activityOptions: KeyValue[] = [
  {key: 'home', value: 'Home'},
  {key: 'homeLive', value: 'Home & Live'}
].concat(liveOption);

const federalAndFormalOptions: KeyValue[] = [
  {key: 'federalPrograms', value: 'Federal programs'},
  {key: 'formalOsteopathicCME', value: 'Formal osteopathic CME'},
];

export interface LearningFormatType {
  creditType: string;
  options: KeyValue[];
}

export default class LearningFormatOptions {
  private static OptionsSorter(opt1: KeyValue, opt2: KeyValue): number {
    return (opt1.key < opt2.key) ? -1 : (opt1.key > opt2.key) ? 1 : 0;
  }

  static nameForOption(optionKey) {
    const options = allOptions.filter((option) => option.key === optionKey);
    return options.length > 0 ? options[0].value : '';
  }

  static get(): LearningFormatType[] {
    return [
      {
        creditType: 'IPCE',
        options: internetManuscriptAndTestItemOptions.concat(journalOption.concat(liveAndPerformanceCmeOptions.concat(enduringOption.concat(otherOption)))).sort(this.OptionsSorter)
      },
      {
        creditType: 'AMA-PRA-1',
        options: internetManuscriptAndTestItemOptions.concat(journalOption.concat(liveAndPerformanceCmeOptions.concat(enduringOption.concat(pointOfCareOption.concat(otherOption))))).sort(this.OptionsSorter)
      },
      {
        creditType: 'AMA-PRA-2',
        options: internetManuscriptAndTestItemOptions.concat(journalOption.concat(liveAndPerformanceCmeOptions.concat(enduringOption.concat(otherOption)))).sort(this.OptionsSorter)
      },
      {
        creditType: 'AAFP-Prescribed',
        options: enduringOption.concat(journalOption.concat(liveAndPerformanceCmeOptions.concat(medicalOption.concat(pointOfCareOption.concat(seriesActOption))))).sort(this.OptionsSorter)
      },
      {
        creditType: 'AAFP-Elective',
        options: enduringOption.concat(journalOption.concat(liveAndPerformanceCmeOptions.concat(medicalOption.concat(pointOfCareOption.concat(seriesActOption))))).sort(this.OptionsSorter)
      },
      {
        creditType: 'notApplicable',
        options: [
          {key: 'notApplicable', value: 'Not Applicable'}
        ]
      },
      {
        creditType: 'ACMEC',
        options: enduringOption.concat(liveAndPerformanceCmeOptions.concat(medicalOption.concat(pointOfCareOption.concat(seriesActOption)))).sort(this.OptionsSorter)
      },
      {
        creditType: 'AOA-CME-Category-1-A',
        options: [
          {key: 'grandRound', value: 'Grand rounds'},
          {key: 'Judging', value: 'Judging osteopathic clinical case presentations and research poster presentations'},
          {key: 'osteopathicMedicalTeaching', value: 'Osteopathic medical teaching '},
          {key: 'standardizedFederalAviationCourses', value: 'Standardized federal aviation courses'},
        ].concat(federalAndFormalOptions).sort(this.OptionsSorter)
      },
      {
        creditType: 'AOA-CME-Category-1-B',
        options: [
          {key: 'GME-Faculty-Preceptors', value: 'GME Faculty/Preceptors'},
          {key: 'hospitalStaffWork', value: 'Committee and Hospital Staff Work'},
          {key: 'journalReading', value: 'Journal Reading'},
          {key: 'nonOsteopathic-CME', value: 'Non-Osteopathic CME Programs'},
          {key: 'PIECM', value: 'Publications, Inspections. Examinations, and Committee Meetings'},
          {key: 'testConstructionCommitteeWork', value: 'Test Construction Committee Work'},
        ].concat(otherOption).sort(this.OptionsSorter)
      },
      {
        creditType: 'AOA-CME-Category-2-A',
        options: otherOption
      },
      {
        creditType: 'AOA-CME-Category-2-B',
        options: [
          {key: 'ABMS-qualification', value: 'Participation in ABMS qualification or recertification examination'},
          {key: 'facultyDevelopment', value: 'Faculty Development'},
          {key: 'homeStudy', value: 'Home Study Activity'},
          {key: 'internetJournal', value: 'Internet Journal Type CME'},
          {key: 'prepScientificExhibits', value: 'Preparation of Scientific Exhibits'},
        ].concat(otherOption).sort(this.OptionsSorter)
      },
      {
        creditType: 'AAPA-CME-Category-1',
        options: enduringOption.concat(homeHealthOption.concat(improvementOption.concat(liveProgramOption.concat(performancePCmeOption.concat(precepRegularAndSelfAssessOptions.concat()))))).sort(this.OptionsSorter)
      },
      {
        creditType: 'AAPA-PI-CME-Category-1',
        options: enduringOption.concat(homeHealthOption.concat(improvementOption.concat(liveProgramOption.concat(performancePCmeOption.concat(precepRegularAndSelfAssessOptions.concat()))))).sort(this.OptionsSorter)
      },
      {
        creditType: 'AAPA-SA-CME-Category-1',
        options: enduringOption.concat(homeHealthOption.concat(improvementOption.concat(liveProgramOption.concat(performancePCmeOption.concat(precepRegularAndSelfAssessOptions.concat()))))).sort(this.OptionsSorter)
      },
      {
        creditType: 'contactHours',
        options: onlineAndPracticeOptions
      },
      {
        creditType: 'application-CPE-activity',
        options: activityOptions
      },
      {
        creditType: 'practice-CPE-activity',
        options: activityOptions
      },
      {
        creditType: 'knowledge-CPE-activity',
        options: activityOptions
      },
      {
        creditType: 'CEH',
        options: [
          {key: 'distributive', value: 'Distributive'},
          {key: 'virtualInstructorCourses', value: 'Virtual Instructor Courses'}
        ]
      },
      {
        creditType: 'CME-hours',
        options: otherOption
      },
      {
        creditType: 'AAFP-CME',
        options: [
          {key: 'performanceImprovement', value: 'Performance improvement in practice'}
        ].concat(enduringOption.concat(liveOption.concat(medicalOption.concat(otherOption.concat(pointOfCareOption.concat()))))).sort(this.OptionsSorter)
      },
      {
        creditType: 'AOA-CME',
        options: [
          {key: 'activityInNonAOAAccreditedInstitutions', value: 'Activity in non-AOA accredited institutions'},
          {key: 'certificationExaminationCredit', value: 'Certification examination credit'},
          {key: 'grandRound', value: 'Grand round (series minimum of 3) '},
          {
            key: 'homeStudy',
            value: 'Home study, viewing non osteopathic medical video, physician administrative training, quality assessment programs, faculty development, medical economics courses etc'
          },
          {key: 'journalReading', value: 'Journal reading'},
          {key: 'Judging', value: 'Judging osteopathic clinical case presentations and research poster presentations'},
          {key: 'nonOsteopathicCMEPrograms', value: 'Non-osteopathic CME programs'},
          {key: 'osteopathicMedicalTeaching', value: 'Osteopathic medical teaching '},
          {key: 'osteopathicPreceptoring', value: 'Osteopathic preceptoring'},
          {key: 'publication', value: 'Publications, inspections, examinations, and committee meetings'},
          {key: 'standardizedFederalAviationCourses', value: 'Standardized federal aviation courses'},
          {key: 'testConstructionCommitteeWork', value: 'Test construction committee work'},
        ].concat(federalAndFormalOptions.concat(otherOption)).sort(this.OptionsSorter)
      },
      {
        creditType: 'AAPA-CME',
        options: [
          {key: 'enduringActivity', value: 'Enduring activity '},
          {
            key: 'hospitalAndHealthSystemQualityImprovement',
            value: 'Hospital and health-system quality improvement'
          },
          {key: 'performanceImprovement', value: 'Performance improvement (PI) CME'}
        ].concat(liveProgramOption.concat(otherOption.concat(precepRegularAndSelfAssessOptions))).sort(this.OptionsSorter)
      },
      {
        creditType: 'ANCC',
        options: onlineAndPracticeOptions.concat(otherOption).sort(this.OptionsSorter)
      },
      {
        creditType: 'ACPE-CPF',
        options: activityOptions.concat(otherOption).sort(this.OptionsSorter)
      },
      {
        creditType: 'other',
        options: otherOption
      },
      {
        creditType: 'pleaseSelect',
        options: otherOption
      }
    ];
  }
}
