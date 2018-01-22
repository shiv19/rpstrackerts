import { StackLayout } from "ui/layouts/stack-layout";
import { NavigatedData, Page } from "ui/page";

require("../../shared/convertors"); // register convertors

import { DetailViewModel } from "./detail-view-model";

/************************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
let drawer;

export function toggleDrawer() {
    drawer.showDrawer();
}

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new DetailViewModel(page.navigationContext);
    drawer = page.getViewById("sideDrawer");
}

export function refreshList(args) {
    // Get reference to the PullToRefresh;
    var pullRefresh = args.object;

    // TODO: perform API call
    pullRefresh.refreshing = false;
}

export function onNavBackTap(args) {
    args.object.page.frame.goBack();
}

export function onDetailsTap(args) {
    args.object.page.bindingContext.set("selectedScreen", "details");
}

export function onTasksTap(args) {
    args.object.page.bindingContext.set("selectedScreen", "tasks");
}

export function onChitchatTap(args) {
    args.object.page.bindingContext.set("selectedScreen", "chitchat");
}
