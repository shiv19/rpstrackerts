import { Observable } from 'data/observable';
import { ObservableArray } from 'data/observable-array';

import { RadDataForm } from 'nativescript-ui-dataform';

import * as backlogService from '../../services/backlog.service';
import * as navService from '../../services/navigation.service';
import { PtItem, PtUser } from '../../core/models/domain';
import { PtItemType } from '../../core/models/domain/types';
import { ItemType } from '../../core/constants/pt-item-types';
import { PtNewTask, PtNewComment } from '../../shared/models/dto';
import { DetailScreenType } from '../../shared/models/ui/types';
import { ptItemToFormModel, PtItemDetailsEditFormModel } from '../../shared/models/forms';
import { PtTaskModel } from '../../shared/models/ui/pt-item/pt-task.model';
import { PtCommentModel } from '../../shared/models/ui/pt-item/pt-comment.model';
import { EMPTY_STRING } from '../../core/models/domain/constants/strings';
import {
    PT_ITEM_STATUSES,
    PT_ITEM_PRIORITIES,
    // COLOR_LIGHT,
    // COLOR_DARK
} from '../../core/constants';
/*
import {
    ButtonEditorHelper,
    setMultiLineEditorFontSize,
    setPickerEditorImageLocation,
    setStepperEditorTextPostfix,
    setStepperEditorContentOffset,
    setStepperEditorColors,
    setSegmentedEditorColor,
    getPickerEditorValueText
} from '../../shared/helpers/ui-data-form';
*/
require('../../shared/converters'); // register converters


export class DetailViewModel extends Observable {

    private _selectedTypeValue: PtItemType;

    public selectedScreen: DetailScreenType = 'details';
    public itemTitle: string;
    private selectedAssignee: PtUser;

    /* details form */
    public itemForm: PtItemDetailsEditFormModel = null;
    public itemTypesProvider = ItemType.List.map((t) => t.PtItemType);
    public statusesProvider = PT_ITEM_STATUSES;
    public prioritiesProvider = PT_ITEM_PRIORITIES;
    /* details form END */

    /* tasks */
    public newTaskTitle = EMPTY_STRING;
    public tasks: ObservableArray<PtTaskModel>;
    /* tasks END */

    /* comments */
    public currentUserAvatar: string;
    public newCommentText = EMPTY_STRING;
    public comments: ObservableArray<PtCommentModel>;
    /* comments END */


    public get itemTypeImage() {
        return ItemType.imageResFromType(this._selectedTypeValue);
    }

    public get itemTypeEditorDisplayName() {
        return 'Type';
    }

    public getSelectedAssignee() {
        return this.selectedAssignee ? this.selectedAssignee : this.ptItem.assignee;
    }

    public setSelectedAssignee(selectedAssignee: PtUser) {
        if (selectedAssignee) {
            this.set('selectedAssignee', selectedAssignee);
            this.onPropertyCommitted();
        }
    }

    constructor(
        private ptItem: PtItem,
        private itemDetailsDataForm: RadDataForm
    ) {
        super();
        this.itemForm = ptItemToFormModel(ptItem);
        this.itemDetailsDataForm = itemDetailsDataForm;
        this.currentUserAvatar = backlogService.getCurrentUserAvatar();
        this.itemTitle = ptItem.title;
        this.selectedAssignee = ptItem.assignee;

        this.tasks = new ObservableArray<PtTaskModel>(ptItem.tasks.map(task => new PtTaskModel(task, ptItem)));
        this.comments = new ObservableArray<PtCommentModel>(ptItem.comments.map(comment => new PtCommentModel(comment)));
    }

    public onNavBackTap() {
        navService.back();
    }

    public onTabDetailsTap(args) {
        this.set('selectedScreen', 'details');
    }

    public onTabTasksTap(args) {
        this.set('selectedScreen', 'tasks');
    }

    public onTabChitchatTap(args) {
        this.set('selectedScreen', 'chitchat');
    }

    /* details START */
    public deleteRequested() {
        backlogService.deletePtItem(this.ptItem)
            .then(() => {
                navService.back();
            })
            .catch(() => {
                console.log('some error occured');
                navService.back();
            });
    }
    /* details END */

    /* tasks START */
    public onAddTask(args) {
        const newTitle = this.newTaskTitle.trim();
        if (newTitle.length === 0) {
            return;
        }

        const newTask: PtNewTask = {
            title: newTitle,
            completed: false
        };

        backlogService.addNewPtTask(newTask, this.ptItem)
            .then(addedTask => {
                this.tasks.unshift(new PtTaskModel(addedTask, this.ptItem));
                this.set('newTaskTitle', EMPTY_STRING);
            })
            .catch(error => {
                console.log('something went wrong when adding task');
            });
    }
    /* tasks END */

    /* comments START */
    public onAddComment(args) {
        const newCommentTxt = this.newCommentText.trim();
        if (newCommentTxt.length === 0) {
            return;
        }

        const newComment: PtNewComment = {
            title: newCommentTxt
        };

        backlogService.addNewPtComment(newComment, this.ptItem)
            .then(addedComment => {
                addedComment.user.avatar = this.currentUserAvatar;
                this.comments.unshift(new PtCommentModel(addedComment));
                this.set('newCommentText', EMPTY_STRING);
            })
            .catch(error => {
                console.log('something went wrong when adding comment');
            });
    }
    /* comments END */

    public onPropertyCommitted() {
        this.notifyUpdateItem();
    }

    private notifyUpdateItem() {
        this.itemDetailsDataForm.validateAll()
            .then(ok => {
                if (ok) {
                    const updatedItem = this.getUpdatedItem(this.ptItem, this.itemForm, this.selectedAssignee);
                    backlogService.updatePtItem(updatedItem);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    private getUpdatedItem(
        origPtItem: PtItem,
        itemForm: PtItemDetailsEditFormModel,
        reselectedAssignee: PtUser
    ): PtItem {
        const updatedAssignee = reselectedAssignee ? reselectedAssignee : origPtItem.assignee;

        const updatedItem = Object.assign({}, origPtItem, {
            title: itemForm.title,
            description: itemForm.description,
            type: itemForm.typeStr,
            status: itemForm.statusStr,
            priority: itemForm.priorityStr,
            estimate: itemForm.estimate,
            assignee: updatedAssignee
        });
        return updatedItem;
    }
}
