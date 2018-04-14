import * as app from 'application';
import { NavigationEntry } from 'ui/frame';

import * as localize from 'nativescript-localize';

import * as authService from './services/auth.service';
import { ROUTES } from './shared/routes';
import './bundle-config';
import './rxjs-imports';

app.setResources({ L: localize });

if (authService.isLoggedIn()) {
    const navEntryLoggedIn: NavigationEntry = {
        moduleName: ROUTES.backlogPage,
    };
    app.start(navEntryLoggedIn);
} else {
    const navEntryAnon: NavigationEntry = {
        moduleName: ROUTES.loginPage,
        backstackVisible: false
    };
    app.start(navEntryAnon);
}

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
