import { StackLayout } from "ui/layouts/stack-layout";
import { NavigatedData } from "ui/page";

require("../../shared/convertors"); // register convertors

import { BacklogViewModel } from "./backlog-view-model";

/************************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
let drawer;

export function toggleDrawer() {
    drawer.showDrawer();
}

export function onNavigatingTo(args: NavigatedData) {
    const page = <StackLayout>args.object;
    page.bindingContext = new BacklogViewModel();
    drawer = page.getViewById("sideDrawer");
}

export function refreshList(args) {
    // Get reference to the PullToRefresh;
    var pullRefresh = args.object;

    // TODO: perform API call
    pullRefresh.refreshing = false;
}
