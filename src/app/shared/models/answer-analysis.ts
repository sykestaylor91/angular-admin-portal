/**
 * Created by James 2020.
 */
import {DocumentIdentifier} from './document-identifier';
import {User} from './user';


export interface Comment {
    userId?: string;
    person?: string;
    text?: string;
    time?: Date;
    email?:  string;
    user?: User;
    hidden?: boolean;
}


export interface Comments {
    [key: string]: Comment[];
}

export class AnswerAnalysis extends DocumentIdentifier {
    qId: string;
    title: string;
    author: string;
    options: string[] = [];
    status: string;

    comments?: Comments = {};

    static copy(source: AnswerAnalysis): AnswerAnalysis {
        return new AnswerAnalysis(source);
    }

    constructor(params: any = {}) {
        super(params);
    }
}
