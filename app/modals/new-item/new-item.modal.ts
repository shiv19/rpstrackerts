import * as observableModule from 'data/observable';
import { isIOS } from 'platform';

import { ItemType } from '../../core/constants/pt-item-types';
import { getCurrentPage } from '../../services/navigation.service';

// let selectedTypeValue;
let modal;
let closeCallback;
export function onShownModally(args) {
    modal = args.object;
    closeCallback = args.closeCallback;
    const context = args.context;
    const newItemVm = observableModule.fromObject({
        form: {
            title: '',
            description: '',
            type: ItemType.List[0].PtItemType
        },
        typesProvider: ItemType.List.map(t => t.PtItemType),
        btnOkText: context.btnOkText
    });

    modal.bindingContext = newItemVm;
}

export function onSaveTap(args) {
    const newItemForm = modal.getViewById('newItemForm');
    newItemForm.validateAndCommitAll().then(ok => {
        if (ok) {
        }
    });
    if (
        modal.bindingContext.form.title.trim() !== '' &&
        modal.bindingContext.form.description.trim() !== ''
    ) {
        closeCallback(modal.bindingContext.form);
    }
}

export function onCancelTap(args) {
    const currentPage = getCurrentPage();
    if (currentPage && currentPage.modal) {
        currentPage.modal.closeModal();
    }
}

export function onEditorUpdate(args) {
    switch (args.propertyName) {
        case 'title':
            editorSetupMultiLine(args.editor);
            break;
        case 'description':
            editorSetupMultiLine(args.editor);
            break;
    }
}

function editorSetupMultiLine(editor) {
    setMultiLineEditorFontSize(editor, 17);
}

function setMultiLineEditorFontSize(editor, size: number): void {
    if (isIOS) {
        if (editor.textView) {
            const textViewDef = editor.gridLayout.definitionForView(
                editor.textView
            );
            if (textViewDef.view && textViewDef.view.font) {
                textViewDef.view.font = UIFont.fontWithNameSize(
                    textViewDef.view.font.fontName,
                    size
                );
            }
        }
    }
}
