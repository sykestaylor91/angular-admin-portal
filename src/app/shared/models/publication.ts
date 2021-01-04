import {DocumentIdentifier} from './document-identifier';

export class Publication extends DocumentIdentifier {

    static ACTIVE = 'active';
    static INACTIVE = 'inactive';
    static DELETED = 'deleted';

    static validStatusCodes = [
        Publication.ACTIVE,
        Publication.INACTIVE,
        Publication.DELETED
    ];

    text: string;
    userId: string;
    status: string;

    static copy(source: Publication): Publication {
        return new Publication(source);
    }

    constructor(params: any = {}) {
        super(params);
    }

}
