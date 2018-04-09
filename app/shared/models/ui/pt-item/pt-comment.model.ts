import { Observable, EventData } from 'data/observable';
import { TextField } from 'ui/text-field';

import * as backlogService from '../../../../services/backlog.service';
import { PtItem, PtComment, PtUser } from '../../../../core/models/domain';
import { EMPTY_STRING } from '../../../../core/helpers/string-helpers';


export class PtCommentModel extends Observable implements PtComment {
    public id: number;
    public title?: string;
    public dateCreated: Date;
    public dateModified: Date;
    public dateDeleted?: Date;
    public user: PtUser;

    private lastUpdatedTitle = EMPTY_STRING;

    constructor(ptComment: PtComment, private ptItem: PtItem) {
        super();
        this.id = ptComment.id;
        this.title = ptComment.title;
        this.dateCreated = ptComment.dateCreated;
        this.dateModified = ptComment.dateModified;
        this.dateDeleted = ptComment.dateDeleted;
        this.user = ptComment.user;
    }
}
