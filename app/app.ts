import * as localize from 'nativescript-localize';
import * as application from 'tns-core-modules/application';
import { getAuthService } from '~/globals/dependencies/locator';
import './bundle-config';
import './globals/dependencies/locator';
import './rxjs-imports';
import './utils/console-color';

global.__assign = Object.assign;

const authService = getAuthService();
application.setResources({ L: localize });

if (authService.isLoggedIn()) {
  /*
  const navEntryLoggedIn: NavigationEntry = {
    moduleName: ROUTES.backlogPage
  };
  */
  // app.start(navEntryLoggedIn);
  application.run({ moduleName: 'app-root-authenticated.xml' });
} else {
  /*
  const navEntryAnon: NavigationEntry = {
    moduleName: ROUTES.loginPage,
    backstackVisible: false
  };
  */
  // app.start(navEntryAnon);
  application.run({ moduleName: 'app-root-anonymous.xml' });
}

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
