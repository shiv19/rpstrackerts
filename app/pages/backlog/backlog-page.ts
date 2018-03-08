import { StackLayout } from "ui/layouts/stack-layout";
import { NavigatedData } from "ui/page";
import { Routes } from "../../shared/routes";
import * as appSettings from "application-settings";

require("../../shared/convertors"); // register convertors

import { BacklogViewModel } from "./backlog-view-model";
import { PtNewItem } from "../../shared/models/dto";
import { CURRENT_USER_KEY, AuthService } from "../../services/auth-service";
import { PtUser } from "../../core/models/domain";

/************************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
let drawer;
let backLogVm;
let authService = new AuthService();

export function toggleDrawer() {
    drawer.showDrawer();
}

export function onNavigatingTo(args: NavigatedData) {
    const page = <StackLayout>args.object;
    backLogVm = new BacklogViewModel();
    page.bindingContext = backLogVm;
    drawer = page.getViewById("sideDrawer");
}

export function refreshList(args) {
    // Get reference to the PullToRefresh;
    var pullRefresh = args.object;

    backLogVm.refresh();

    pullRefresh.refreshing = false;
}

export function listItemTap(args) {
    const page = args.object.page;

    page.frame.navigate({
        moduleName: Routes.detail,
        animated: true,
        transition: {
            name: "slide",
            duration: 380
        },
        context: args.view.bindingContext
    });
}

export function onAddTap(args) {
    const page = args.object.page;

    page.showModal(
        Routes.newItemModal,
        {
            btnOkText: "Save"
        },
        newItem => {
            if (newItem) {
                const assignee: PtUser = JSON.parse(
                    appSettings.getString(CURRENT_USER_KEY, "{}")
                );
                backLogVm.addItem(newItem, assignee);
            }
        },
        true
    );
}

export function onLogout(args) {
    authService.logout();
}

export function onSelectPresetTap(args) {
    appSettings.setString("currentPreset", args.object.preset);
    backLogVm.refresh();
}

export function onSettingsTap(args) {
    args.object.page.frame.navigate({
        moduleName: Routes.settings,
        animated: true,
        transition: {
            name: "slide",
            duration: 380
        }
    });
}
