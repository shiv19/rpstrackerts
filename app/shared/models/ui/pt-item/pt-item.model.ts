import { PtItem, PtUser, PtTask, PtComment } from '../../../../core/models/domain';
import { PtItemType } from '../../../../core/models/domain/types';
import { PriorityEnum, StatusEnum } from '../../../../core/models/domain/enums';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { PtTaskModel } from './pt-task.model';


export class PtItemModel {
    id: number;
    title?: string;
    dateCreated: Date;
    dateModified: Date;
    dateDeleted?: Date;

    description?: string;
    type: PtItemType;
    estimate: number;
    priority: PriorityEnum;
    status: StatusEnum;
    assignee: PtUser;
    tasks: ObservableArray<PtTaskModel>;
    comments: PtComment[];

    constructor(ptItem: PtItem) {
        this.id = ptItem.id;
        this.title = ptItem.title;
        this.dateCreated = ptItem.dateCreated;
        this.dateModified = ptItem.dateModified;
        this.dateDeleted = ptItem.dateDeleted;

        this.description = ptItem.description;
        this.type = ptItem.type;
        this.estimate = ptItem.estimate;
        this.priority = ptItem.priority;
        this.status = ptItem.status;
        this.assignee = ptItem.assignee;

        this.tasks = new ObservableArray<PtTaskModel>(ptItem.tasks.map(task => new PtTaskModel(task, ptItem)));
        this.comments = ptItem.comments;
    }

    public addTaskToStart(ptTask: PtTask, ptItem: PtItem) {
        this.tasks.unshift(new PtTaskModel(ptTask, ptItem));
    }
}
