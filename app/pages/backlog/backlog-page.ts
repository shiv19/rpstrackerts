import { NavigatedData, Page, EventData, backgroundColorProperty } from 'ui/page';
import { Button } from 'ui/button';

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

import { BacklogViewModel } from './backlog-view-model';
import { showModalNewItem } from '../../services/modal.service';
import { PtItem } from '../../core/models/domain';

const backLogVm: BacklogViewModel = new BacklogViewModel();
let drawer: RadSideDrawer = null;


export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = backLogVm;
}

export function onLoaded(args: EventData) {
    const page = <Page>args.object;
    backLogVm.refresh();
    drawer = page.getViewById('sideDrawer');
}

export function toggleDrawer() {
    drawer.toggleDrawerState();
}

export function onAddTap(args: EventData) {
    const button = <Button>args.object;
    showModalNewItem(button.page)
        .then((newItem: PtItem) => backLogVm.addNewItemHandler(newItem));
}

export function onRefreshRequested(args) {
    // Get reference to the PullToRefresh;
    const pullToRefresh = args.object;
    backLogVm.refresh();
    pullToRefresh.refreshing = false;
}
