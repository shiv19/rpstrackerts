import { NavigatedData, Page } from 'ui/page';

import { RegisterViewModel } from '../../../shared/view-models/pages/register/register.page.vm';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new RegisterViewModel();
}
