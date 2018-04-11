import { NavigatedData, Page, EventData, View } from 'ui/page';
import { ConfirmOptions, confirm } from 'ui/dialogs';

import { RadDataForm } from 'nativescript-ui-dataform';

import * as userService from '../../services/pt-user.service';
import { DetailViewModel } from './detail-view-model';



let detailsVm: DetailViewModel;

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const currentItem = page.navigationContext;
    const itemDetailsDataForm: RadDataForm = page.getViewById('itemDetailsDataForm');
    detailsVm = new DetailViewModel(currentItem, itemDetailsDataForm);
    page.bindingContext = detailsVm;
}

export function onDeleteTap() {
    const options: ConfirmOptions = {
        title: 'Delete Item',
        message: 'Are you sure you want to delete this item?',
        okButtonText: 'Yes',
        cancelButtonText: 'Cancel'
    };
    // confirm with options, with promise
    confirm(options)
        .then((result: boolean) => {
            // result can be true/false/undefined
            if (result) {
                detailsVm.deleteRequested();
            }
        });
}

export function onAssigneeRowTap(args: EventData) {
    const view = <View>args.object;

    userService.showModalAssigneeList(view.page, detailsVm.getSelectedAssignee())
        .then(selectedAssignee => {
            if (selectedAssignee) {
                detailsVm.setSelectedAssignee(selectedAssignee);
            }
        });
}

