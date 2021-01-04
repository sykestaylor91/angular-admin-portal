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
export class Circuit extends DocumentIdentifier {
    id: string;
    title: string;
    author: string;
    keywords: string;
    dateScheduled: string;
    intro: string;
    additionalInfo: string;
    examinerNotes: string;
    candidateNotes: string;
    actorScripts: string;
    text: string;
    stations: Array<any>;
    status: string;
    comments?: Comments = {};


    static copy(source: Circuit): Circuit {
        return new Circuit(source);
    }

    constructor(params: any = {}) {
        super(params);
    }
}
