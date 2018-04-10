import { Page } from 'ui/page';

import { ROUTES } from '../shared/routes';

export function showModalNewItem<T>(
    page: Page,
): Promise<T> {
    const context = {
        btnOkText: 'Save'
    };
    return showModal<T>(page, ROUTES.newItemModal, true, context);
}

function showModal<T>(
    page: Page,
    route: string,
    fullscreen: boolean,
    context: any,
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        page.showModal(
            route,
            context,
            resolve,
            fullscreen
        );
    });
}
