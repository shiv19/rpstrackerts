import * as app from 'application';
import * as appSettings from 'application-settings';

import * as localize from 'nativescript-localize';

import './bundle-config';
import { ROUTES } from './shared/routes';
import { getCurrentPage } from './services/navigation.service';
import './rxjs-imports';

app.setResources({ L: localize });

// Enable back button handling

if (app.android) {
    app.android.on(app.AndroidApplication.activityBackPressedEvent, backEvent);
}
function backEvent(args) {
    const currentPage = <any>getCurrentPage();
    if (
        currentPage &&
        currentPage.exports &&
        typeof currentPage.exports.backEvent === 'function'
    ) {
        currentPage.exports.backEvent(args);
    }
}

appSettings.setString('currentPreset', 'open');

app.start({ moduleName: ROUTES.loginPage });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
