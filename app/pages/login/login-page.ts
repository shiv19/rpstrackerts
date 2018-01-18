import { StackLayout } from "ui/layouts/stack-layout";
import { NavigatedData } from "ui/page";
import { Routes } from "../../shared/routes";

import { LoginViewModel } from "./login-view-model";

/************************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
export function onNavigatingTo(args: NavigatedData) {
    const page = <StackLayout>args.object;
    page.bindingContext = new LoginViewModel();
}

export function onGotoRegister(args: any) {
    args.object.page.frame.navigate({
        moduleName: Routes.register,
        animated: false
    });
}
