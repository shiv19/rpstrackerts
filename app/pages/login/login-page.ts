import { Page, NavigatedData } from 'ui/page';

import { LoginViewModel } from './login-view-model';


export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const loginVm = new LoginViewModel();
    page.bindingContext = loginVm;
}
