/**
 * Created by james on 22/05/19.
 */
import {DocumentIdentifier} from './document-identifier';
import {Station} from './station';
import {Circuit} from './circuit';

export class ClinicalExam extends DocumentIdentifier {

  id: string;
  title: string;
  author: string;
  status: string;
  dateScheduled: string;
  circuits: string[];
  examiners: any[];
  candidates: any[];
  stations: Station[];
  stationExaminerAllocations: any[];
  candidateCircuitAllocations: any[];
  duration: any;

  comments: string;

    static copy(source: ClinicalExam): ClinicalExam {
        return new ClinicalExam(source);
    }

    constructor(params: any = {}) {
        super(params);
    }
}

