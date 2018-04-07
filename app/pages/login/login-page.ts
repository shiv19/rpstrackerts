import { StackLayout } from 'ui/layouts/stack-layout';
import { NavigatedData } from 'ui/page';
import { Routes } from '../../shared/routes';
import * as appSettings from 'application-settings';

import { LoginViewModel } from './login-view-model';

/************************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
export function onNavigatingTo(args: NavigatedData) {
    const page = <StackLayout>args.object;
    const loginVm = new LoginViewModel();
    page.bindingContext = loginVm;

    const loginDetails = JSON.parse(
        appSettings.getString('loginDetails', '{}')
    );
    if (loginDetails.username && loginDetails.password) {
        loginVm.email = loginDetails.username;
        loginVm.password = loginDetails.password;
        loginVm.onLogin(args);
    } else {
        loginVm.set('loggedIn', false);
    }
}

export function onGotoRegister(args: any) {
    args.object.page.frame.navigate({
        moduleName: Routes.register,
        animated: false
    });
}
