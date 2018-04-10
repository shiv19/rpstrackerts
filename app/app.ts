import * as app from 'application';

import * as localize from 'nativescript-localize';

import * as authService from './services/auth.service';
import * as navService from './services/navigation.service';
import { ROUTES } from './shared/routes';
import './bundle-config';
import './rxjs-imports';
import { NavigationEntry } from 'tns-core-modules/ui/frame/frame';


app.setResources({ L: localize });

// Enable back button handling

if (app.android) {
    app.android.on(app.AndroidApplication.activityBackPressedEvent, backEvent);
}
function backEvent(args) {
    const currentPage = <any>navService.getCurrentPage();
    if (
        currentPage &&
        currentPage.exports &&
        typeof currentPage.exports.backEvent === 'function'
    ) {
        currentPage.exports.backEvent(args);
    }
}

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
