import { StackLayout } from "ui/layouts/stack-layout";
import { NavigatedData, Page } from "ui/page";
import { confirm, ConfirmOptions } from "ui/dialogs";

require("../../shared/convertors"); // register convertors

import { DetailViewModel } from "./detail-view-model";
import { BacklogService } from "../../services/backlog-service";

/************************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
let drawer;
let backlogService = new BacklogService();

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

export function onDeleteTap(args) {
    const page = args.object.page;

    // Simple approach
    // if (confirm('Are you sure you want to delete this item?')) {

    // }

    // Better approach with promise
    const options: ConfirmOptions = {
        title: "Delete Item",
        message: "Are you sure you want to delete this item?",
        okButtonText: "Yes",
        cancelButtonText: "Cancel"
    };
    // confirm without options, with promise
    // confirm('Are you sure you want to delete this item?')
    // confirm with options, with promise
    confirm(options).then((result: boolean) => {
        // result can be true/false/undefined
        if (result) {
            backlogService
                .deletePtItem(page.navigationContext)
                .then(() => {
                    page.frame.goBack();
                })
                .catch(() => {
                    console.log("some error occured");
                    page.frame.goBack();
                });
        }
    });
}
