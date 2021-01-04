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
export class Item extends DocumentIdentifier {
    id: string;
    title: string;
    author: string;
    text: string;
    answerFormat: string;
    attributes: string;
    status: string;
    required: boolean;

    comments?: Comments = {};


    static copy(source: Item): Item {
        return new Item(source);
    }

    constructor(params: any = {}) {
        super(params);
    }
}
