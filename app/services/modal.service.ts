import { Page } from 'ui/page';

import { ROUTES } from '../shared/routes';

export function showModalNewItem(
    page: Page,
): Promise<void> {
    const context = {
        btnOkText: 'Save'
    };
    return showModal(page, ROUTES.newItemModal, true, context);
}

function showModal(
    page: Page,
    route: string,
    fullscreen: boolean,
    context: any,
): Promise<void> {
    return new Promise((resolve, reject) => {
        page.showModal(
            route,
            context,
            resolve,
            fullscreen
        );
    });
}
