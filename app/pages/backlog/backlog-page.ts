import * as appSettings from 'application-settings';
import { NavigatedData } from 'ui/page';
import { StackLayout } from 'ui/layouts/stack-layout';

import { ROUTES } from '../../shared/routes';
require('../../shared/converters'); // register converters

import { BacklogViewModel } from './backlog-view-model';
import { PtNewItem } from '../../shared/models/dto';
import { CURRENT_USER_KEY, logout } from '../../services/auth.service';
import { PtUser } from '../../core/models/domain';

/************************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
let drawer;
let backLogVm;

export function toggleDrawer() {
    drawer.showDrawer();
}

export function onNavigatingTo(args: NavigatedData) {
    const page = <StackLayout>args.object;
    backLogVm = new BacklogViewModel();
    page.bindingContext = backLogVm;
    drawer = page.getViewById('sideDrawer');
}

export function refreshList(args) {
    // Get reference to the PullToRefresh;
    const pullRefresh = args.object;

    backLogVm.refresh();

    pullRefresh.refreshing = false;
}

export function listItemTap(args) {
    const page = args.object.page;

    page.frame.navigate({
        moduleName: ROUTES.detailPage,
        animated: true,
        transition: {
            name: 'slide',
            duration: 380
        },
        context: args.view.bindingContext
    });
}

export function onAddTap(args) {
    const page = args.object.page;

    page.showModal(
        ROUTES.newItemModal,
        {
            btnOkText: 'Save'
        },
        newItem => {
            if (newItem) {
                const assignee: PtUser = JSON.parse(
                    appSettings.getString(CURRENT_USER_KEY, '{}')
                );
                backLogVm.addItem(newItem, assignee);
            }
        },
        true
    );
}

export function onLogout(args) {
    logout();
}

export function onSelectPresetTap(args) {
    appSettings.setString('currentPreset', args.object.preset);
    backLogVm.refresh();
}

export function onSettingsTap(args) {
    args.object.page.frame.navigate({
        moduleName: ROUTES.settingsPage,
        animated: true,
        transition: {
            name: 'slide',
            duration: 380
        }
    });
}
