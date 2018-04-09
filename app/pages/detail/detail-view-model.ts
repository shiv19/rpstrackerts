import * as app from 'application';
import * as appSettings from 'application-settings';
import { Observable, PropertyChangeData } from 'data/observable';
import { ObservableArray } from 'data/observable-array';
import { Button } from 'ui/button';

import { CustomPropertyEditor } from 'nativescript-ui-dataform';

import * as backlogService from '../../services/backlog.service';
import { CURRENT_USER_KEY } from '../../services/auth.service';
import { PtItem, PtUser } from '../../core/models/domain';
import { PtItemType } from '../../core/models/domain/types';
import { ItemType } from '../../core/constants/pt-item-types';
import {
    PT_ITEM_STATUSES,
    PT_ITEM_PRIORITIES,
    COLOR_LIGHT,
    COLOR_DARK
} from '../../core/constants';
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
import { ROUTES } from '../../shared/routes';
import { EMPTY_STRING } from '../../core/helpers/string-helpers';
import { PtNewTask, PtNewComment, PtTaskUpdate } from '../../shared/models/dto';
import { ConfirmOptions, confirm } from 'tns-core-modules/ui/dialogs/dialogs';
import { PtItemModel } from '../../shared/models/ui/pt-item/pt-item.model';
require('../../shared/converters'); // register converters


export class DetailViewModel extends Observable {

    itemModel: PtItemModel;
    selectedScreen = 'details';
    currentUser: PtUser;
    currentUserAvatar: string;
    newTaskTitle = EMPTY_STRING;
    newCommentText = EMPTY_STRING;
    lastUpdatedTitle = EMPTY_STRING;

    private itemTypeEditorBtnHelper: ButtonEditorHelper;
    private itemTypeEditorViewConnected = false;
    private itemTypeNativeView;
    form;
    formMetaData = {
        isReadOnly: false,
        commitMode: 'Immediate',
        validationMode: 'Immediate',
        propertyAnnotations: [
            {
                name: 'title',
                displayName: 'Title',
                index: 1
            },
            {
                name: 'description',
                displayName: 'Description',
                index: 2
            },
            {
                name: 'type',
                displayName: 'Type',
                index: 3,
                editor: 'Picker',
                valuesProvider: ItemType.List.map(t => t.PtItemType)
            },
            {
                name: 'status',
                displayName: 'Status',
                index: 4,
                editor: 'Picker',
                valuesProvider: PT_ITEM_STATUSES
            },
            {
                name: 'estimate',
                displayName: 'Estimate',
                index: 5,
                editor: 'Stepper',
                minimum: 1,
                maximum: 10,
                step: 1
            },
            {
                name: 'priority',
                displayName: 'Priority',
                index: 6,
                editor: 'SegmentedPicker',
                valuesProvider: PT_ITEM_PRIORITIES
            }
        ]
    };


    constructor(private ptItem: PtItem) {
        super();
        // this.itemModel = item;
        this.itemModel = new PtItemModel(ptItem);
        this.form = {
            title: ptItem.title,
            description: ptItem.description,
            type: ptItem.type,
            status: ptItem.status,
            estimate: ptItem.estimate,
            priority: ptItem.priority,
            assigneeName: ptItem.assignee.fullName
        };


        this.currentUser = JSON.parse(
            appSettings.getString(CURRENT_USER_KEY, '{}')
        );
        this.currentUserAvatar = backlogService.getCurrentUserAvatar();
    }

    public onNavBackTap(args) {
        args.object.page.frame.goBack();
    }

    public onTabDetailsTap(args) {
        args.object.page.bindingContext.set('selectedScreen', 'details');
    }

    public onTabTasksTap(args) {
        args.object.page.bindingContext.set('selectedScreen', 'tasks');
    }

    public onTabChitchatTap(args) {
        args.object.page.bindingContext.set('selectedScreen', 'chitchat');
    }

    public onDeleteTap(args) {
        const page = args.object.page;

        // Better approach with promise
        const options: ConfirmOptions = {
            title: 'Delete Item',
            message: 'Are you sure you want to delete this item?',
            okButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        };
        // confirm with options, with promise
        confirm(options).then((result: boolean) => {
            // result can be true/false/undefined
            if (result) {
                backlogService.deletePtItem(this.ptItem)
                    .then(() => {
                        page.frame.goBack();
                    })
                    .catch(() => {
                        console.log('some error occured');
                        page.frame.goBack();
                    });
            }
        });
    }

    /* details START */

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
                this.itemModel.addTaskToStart(addedTask, this.ptItem);
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
                this.itemModel.addCommentToStart(addedComment, this.ptItem);
                this.set('newCommentText', EMPTY_STRING);
            })
            .catch(error => {
                console.log('something went wrong when adding task');
            });
    }
    /* comments END */

    onPropertyCommitted() {
        this.itemModel.title = this.form.title;
        this.itemModel.description = this.form.description;
        this.itemModel.type = this.form.type;
        this.itemModel.status = this.form.status;
        this.itemModel.estimate = this.form.estimate;
        this.itemModel.priority = this.form.priority;
        backlogService.updatePtItem(this.ptItem);
    }

    onAssigneeSelect(args) {
        const page = args.object.page;
        page.showModal(
            ROUTES.assigneeSelectorModal,
            {},
            assignee => {
                if (assignee) {
                    this.itemModel.assignee = assignee;
                    page.getViewById('assigneeBtn').text = assignee.fullName;
                    page.getViewById('assigneeImg').src = assignee.avatar;
                    this.onPropertyCommitted();
                }
            },
            true
        );
    }
}
