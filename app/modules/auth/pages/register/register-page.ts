import { StackLayout } from "ui/layouts/stack-layout";
import { NavigatedData } from "ui/page";
import { Routes } from "../../../../shared/routes";

import { RegisterViewModel } from "./register-view-model";

/************************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
export function onNavigatingTo(args: NavigatedData) {
    const page = <StackLayout>args.object;
    page.bindingContext = new RegisterViewModel();
}

export function onGotoLogin(args: any) {
    args.object.page.frame.navigate({
        moduleName: Routes.login,
        animated: false,
        clearHistory: true
    })
}
