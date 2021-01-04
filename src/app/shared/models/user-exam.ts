/**
 * Created by steve on 7/22/16.
 */

import {DocumentIdentifier} from './document-identifier';
import {ExamType} from './exam-type';
import {UserExamStatus} from './user-exam-status';
import {Exam} from './exam';
import {RevealAnswerType} from './reveal-answer-type';
import {LearningMaterial} from './learning-material';

export class UserExam extends DocumentIdentifier {
  userId?: string;
  examId?: string;
  type?: ExamType;
  isRetake?: boolean = false;
  retakeAttempts: number  = 0;
  certificate: boolean = false;
  custom?: string;
  introduction?: string;
  numberOfCredits?: string;
  passRate?: string;
  questions?: string[];
  subtitle?: string;
  title?: string;
  welcomeMessage?: string;
  studyMode?: boolean;
  normalMode?: boolean;
  examMode?: boolean;

  currentQuestion?: string;
  dateCompleted?: Date;
  dateIssued?: Date;
  datePaused?: Date;
  elapsedSeconds?: number = 0;
  learningMaterial?: LearningMaterial[];
  plannedExpireDate?: Date;
  score?: number = 0.0;
  status?: UserExamStatus = UserExamStatus.Open;
  notes: NoteArray = {};

  revealAnswers?: RevealAnswerType;

  userEvaluationId?: string;

  securityLock: boolean = false;


  static copy(source: UserExam): UserExam {
    return new UserExam(source);
  }

  constructor(params: Partial<UserExam | Exam> = {}) {
    super(params);
  }

}

export enum ExamMode {
  Normal,
  Preview,
  Resume,
  Retake,
}

export interface ResolvedUserExam {
  exam: Exam;
  userExam: UserExam;
  examModeLabel: ExamMode;
}

export interface NoteArray {
  [key: string]: string | boolean | number;
}
