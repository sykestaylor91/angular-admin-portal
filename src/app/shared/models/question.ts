/**
 * Created by steve on 7/22/16.
 */

import {DocumentIdentifier} from './document-identifier';
import {User} from './user';
import {UserExam} from './user-exam';
import {QuestionType} from './question-type';
import {Response} from './response';

export interface CommentItem {
    userId?: string;
    person?: string;
    text?: string;
    time?: Date;
    email?:  string;
    user?: User;
    hidden?: boolean;
}

export interface Comment {
    [key: string]: CommentItem[];
}

export class Question extends DocumentIdentifier {
  static DRAFT = 'draft';
  static ISSUED = 'issued';
  static RELEASED = 'released';
  static ARCHIVED = 'archived';
  static DELETED = 'deleted';

  userId: string;
  examId: string;

  answers: string[];  // Rename to choices
  author: string;
  citation: string;
  dataType: QuestionType;
  discussion: string;
  evidence: string;
  intro: string;
  serialQuestions: any[];
  keywords: string;
  levelOfDifficulty: string;
  notes: string;
  number: string;
  question: string;
  references: string;
  reviewDate: string;
  status: string;
  title: string;
  type: string;
  userRef: string;
  comments?: Comment = {};
  availableMarks: number;
  tags: string[] = [];

  static copy(source: Question): Question {
    return new Question(source);
  }

  constructor(params: any = {}) {
    super(params);
  }
}

export class ResolvedQuestion {
  questions: Question[];
  sessionUser: User;
  uniqueUserIds: string[];
}

export class ResolvedQuestionContent {
  questions: Question[];
  userExam: UserExam;
  previewMode?: boolean = false;
  previewQuestionMode?: boolean = false;
  responses: Response[];
}
