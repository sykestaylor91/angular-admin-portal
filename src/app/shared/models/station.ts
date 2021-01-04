/**
 * Created by james on 22/05/19.
 */
import {DocumentIdentifier} from './document-identifier';
import {User} from './user';
import {Item} from './item';


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

export class StationSection {
    title?: string;
    items?: Item[];
}

export class Station extends DocumentIdentifier {
    id: string;
    title: string;
    author: string;
    keywords: string;
    dateScheduled: string;
    intro: string;
    subject: string;
    examinerNotes: string;
    candidateNotes: string;
    actorScripts: string;
    text: string;
    sections: StationSection[] = [];
    status: string;
    comments?: Comments = {};


    static copy(source: Station): Station {
        return new Station(source);
    }

    constructor(params: any = {}) {
        super(params);
    }
}
