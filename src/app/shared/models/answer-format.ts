/**
 * Created by james on 22/05/19.
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

export class AnswerFormat extends DocumentIdentifier {
    id: string;
    title: string = '';
    author: string;
    options: string[] = [];
    status: string;

    comments?: Comments = {};

    static copy(source: AnswerFormat): AnswerFormat {
        return new AnswerFormat(source);
    }

    constructor(params: any = {}) {
        super(params);
    }
}
