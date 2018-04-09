import { NavigatedData, Page } from 'ui/page';

import { BacklogViewModel } from './backlog-view-model';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

/************************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const drawer = page.getViewById('sideDrawer');
    const backLogVm = new BacklogViewModel();
    backLogVm.drawer = <RadSideDrawer>drawer;
    page.bindingContext = backLogVm;
}
