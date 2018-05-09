import * as localize from 'nativescript-localize';
import * as app from 'tns-core-modules/application';
import { NavigationEntry } from 'tns-core-modules/ui/frame';
import { ROUTES } from '~/core/routes';
import { getAuthService } from '~/globals/dependencies/locator';
import './bundle-config';
import './globals/dependencies/locator';
import './rxjs-imports';
import './utils/console-color';

global.__assign = Object.assign;

const authService = getAuthService();
app.setResources({ L: localize });

if (authService.isLoggedIn()) {
  const navEntryLoggedIn: NavigationEntry = {
    moduleName: ROUTES.backlogPage
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
