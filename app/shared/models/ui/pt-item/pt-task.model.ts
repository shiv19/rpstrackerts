import { Observable, EventData } from 'data/observable';
import { TextField } from 'ui/text-field';

import * as backlogService from '../../../../services/backlog.service';
import { PtTask, PtItem } from '../../../../core/models/domain';
import { EMPTY_STRING } from '../../../../core/helpers/string-helpers';
import { PtTaskUpdate } from '../../dto';


export class PtTaskModel extends Observable implements PtTask {
    public id: number;
    public title?: string;
    public dateCreated: Date;
    public dateModified: Date;
    public dateDeleted?: Date;
    public completed: boolean;

    private lastUpdatedTitle = EMPTY_STRING;

    constructor(ptTask: PtTask, private ptItem: PtItem) {
        super();
        this.id = ptTask.id;
        this.title = ptTask.title;
        this.dateCreated = ptTask.dateCreated;
        this.dateModified = ptTask.dateModified;
        this.dateDeleted = ptTask.dateDeleted;
        this.completed = ptTask.completed;
    }

    public onTaskToggleTap(args) {
        const task = args.view.bindingContext;

        const taskUpdate: PtTaskUpdate = {
            task: args.view.bindingContext,
            toggle: true,
            newTitle: task.title
        };

        const updatedTask = this.updateTask(taskUpdate);

        this.set('title', updatedTask.title);
        this.set('dateModified', updatedTask.dateModified);
        this.set('completed', updatedTask.completed);
    }

    public onTaskFocused(args: EventData) {
        const textField = <TextField>args.object;
        this.lastUpdatedTitle = textField.text;
        textField.on('textChange', (a) => this.onTextChange(a));
    }

    public onTaskBlurred(args) {
        args.object.off('textChange');
        this.lastUpdatedTitle = EMPTY_STRING;
    }


    private onTextChange(args: EventData) {
        const textField = <TextField>args.object;
        const changedTitle = textField.text;

        if (this.lastUpdatedTitle !== changedTitle) {
            this.lastUpdatedTitle = changedTitle;

            const taskUpdate: PtTaskUpdate = {
                task: textField.bindingContext,
                toggle: false,
                newTitle: this.lastUpdatedTitle
            };

            this.updateTask(taskUpdate);
        }
    }

    private updateTask(taskUpdate: PtTaskUpdate) {
        return backlogService.updatePtTask(
            this.ptItem,
            taskUpdate.task,
            taskUpdate.toggle,
            taskUpdate.newTitle
        );
    }
}
