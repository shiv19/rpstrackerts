import { ShownModallyData, Page } from 'ui/page';

import { TextInputModalViewModel } from './text-input.modal.vm';

export function onShownModally(args: ShownModallyData) {
    const page = <Page>args.object;
    const textInputModal = new TextInputModalViewModel(args);
    page.bindingContext = textInputModal;
}
