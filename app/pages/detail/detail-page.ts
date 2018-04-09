import { NavigatedData, Page } from 'ui/page';
import { DetailViewModel } from './detail-view-model';


/************************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const currentItem = page.navigationContext;
    const detailsVm = new DetailViewModel(currentItem);
    page.bindingContext = detailsVm;
}
