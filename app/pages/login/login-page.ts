import * as appSettings from 'application-settings';
import { Page, NavigatedData } from 'ui/page';

import { LoginViewModel } from './login-view-model';

/************************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const loginVm = new LoginViewModel();
    page.bindingContext = loginVm;

    /*
    const loginDetails = JSON.parse(
        appSettings.getString('loginDetails', '{}')
    );
    if (loginDetails.username && loginDetails.password) {
        loginVm.email = loginDetails.username;
        loginVm.password = loginDetails.password;
        loginVm.onLoginTap(args);
    } else {
        loginVm.set('loggedIn', false);
    }
    */
}

