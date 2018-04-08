import * as appSettings from 'application-settings';
import { EventData } from 'data/observable';
import { NavigatedData, View } from 'ui/page';
import { StackLayout } from 'ui/layouts/stack-layout';
import { Button } from 'ui/button';
import { ItemEventData } from 'ui/list-view';

require('../../shared/converters'); // register converters

import { BacklogViewModel } from './backlog-view-model';
import { PtNewItem } from '../../shared/models/dto';
import { CURRENT_USER_KEY, logout } from '../../services/auth.service';
import { PtUser } from '../../core/models/domain';
import { navigate } from '../../services/navigation.service';
import { showModalNewItem } from '../../services/modal.service';
import { NavigationEntry } from 'tns-core-modules/ui/frame/frame';
import { ROUTES } from '../../shared/routes';



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

export function listItemTap(args: ItemEventData) {
    const view = <View>args.object;
    const navEntry: NavigationEntry = {
        moduleName: ROUTES.detailPage,
        animated: true,
        transition: {
            name: 'slide',
            duration: 380
        },
        context: args.view.bindingContext
    };
    navigate(navEntry, view.page.frame)
}

export function onAddTap(args: EventData) {
    const button = <Button>args.object;

    showModalNewItem(button.page)
        .then(newItem => {
            if (newItem) {
                const assignee: PtUser = JSON.parse(
                    appSettings.getString(CURRENT_USER_KEY, '{}')
                );
                backLogVm.addItem(newItem, assignee);
            }
        });
}

export function onLogout(args) {
    logout();
}

export function onSelectPresetTap(args) {
    appSettings.setString('currentPreset', args.object.preset);
    backLogVm.refresh();
}

export function onSettingsTap(args: EventData) {
    const button = <Button>args.object;
    const navEntry: NavigationEntry = {
        moduleName: ROUTES.settingsPage,
        animated: true,
        transition: {
            name: 'slide',
            duration: 380
        }
    };
    navigate(navEntry, button.page.frame);
}
