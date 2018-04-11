import { Page, NavigatedData } from 'ui/page';

import { LoginViewModel } from '../../../shared/view-models/pages/login/login.page.vm';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const loginVm = new LoginViewModel();
    page.bindingContext = loginVm;
}
