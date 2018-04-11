import { Page } from 'ui/page';

import { ROUTES } from '../shared/routes';
import { PtModalContext } from '../shared/models/ui';

export interface ModalItem {
    id: number;
    image: string;
    value: string;
}

let modalIsShowing = false;

export function createPtModalContext<T, R>(
    title: string,
    payload: T,
    defaultResult: R = null,
    btnOkText: string = 'Done',
    btnCancelText: string = 'Cancel'
): PtModalContext<T, R> {
    return {
        title,
        payload,
        defaultResult,
        btnOkText,
        btnCancelText
    };
}

function createModal<T, R>(
    page: Page,
    route: string,
    context: PtModalContext<T, R>
): Promise<R> {
    if (modalIsShowing) {
        return Promise.reject<R>('A modal dialog is already showing.');
    }

    return new Promise<R>((resolve, reject) => {
        modalIsShowing = true;

        page.showModal(
            route,
            context,
            (result) => {
                resolve(result);
                modalIsShowing = false;
            },
            true
        );
    });
}

export function showModalTextInput(
    page: Page,
    context: PtModalContext<string, string>
): Promise<string> {
    return createModal<string, string>(page, ROUTES.textInputModal, context);
}

export function showModalListSelector(
    page: Page,
    context: PtModalContext<ModalItem[], ModalItem>
): Promise<ModalItem> {
    return createModal<ModalItem[], ModalItem>(page, ROUTES.listSelectorModal, context);
}

export function showModal<T>(
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
