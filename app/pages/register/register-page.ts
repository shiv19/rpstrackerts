import { NavigatedData, Page } from 'ui/page';

import { RegisterViewModel } from './register-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new RegisterViewModel();
}
