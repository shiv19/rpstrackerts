import { StackLayout } from "ui/layouts/stack-layout";
import { NavigatedData } from "ui/page";

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
