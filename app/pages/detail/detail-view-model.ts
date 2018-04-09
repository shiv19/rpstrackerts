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


export class DetailViewModel extends Observable {

    item: PtItem;
    selectedScreen: string;
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
    currentUser: PtUser;
    currentUserAvatar: string;
    newTaskTitle: string;
    newCommentText: string;

    private itemTypeEditorBtnHelper: ButtonEditorHelper;
    private itemTypeEditorViewConnected = false;
    private itemTypeNativeView;

    constructor(item, selectedScreen = 'details') {
        super();
        this.item = item;
        this.form = {
            title: item.title,
            description: item.description,
            type: item.type,
            status: item.status,
            estimate: item.estimate,
            priority: item.priority,
            assigneeName: item.assigneeName
        };

        this.selectedScreen = selectedScreen;
        this.newTaskTitle = '';
        this.newCommentText = '';

        this.currentUser = JSON.parse(
            appSettings.getString(CURRENT_USER_KEY, '{}')
        );
        this.currentUserAvatar = backlogService.getCurrentUserAvatar();
    }

    onPropertyCommitted() {
        this.item.title = this.form.title;
        this.item.description = this.form.description;
        this.item.type = this.form.type;
        this.item.status = this.form.status;
        this.item.estimate = this.form.estimate;
        this.item.priority = this.form.priority;
        backlogService.updatePtItem(this.item);
    }

    onAssigneeSelect(args) {
        const page = args.object.page;
        page.showModal(
            ROUTES.assigneeSelectorModal,
            {},
            assignee => {
                if (assignee) {
                    this.item.assignee = assignee;
                    page.getViewById('assigneeBtn').text = assignee.fullName;
                    page.getViewById('assigneeImg').src = assignee.avatar;
                    this.onPropertyCommitted();
                }
            },
            true
        );
    }
}
