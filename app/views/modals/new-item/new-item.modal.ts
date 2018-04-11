import { ShownModallyData, Page } from 'ui/page';

import { DataFormEventData, RadDataForm } from 'nativescript-ui-dataform';

import { PtItemType } from '../../../core/models/domain/types';
import { NewItemModalViewModel } from '../../../shared/view-models/modals/new-item/new-item.modal.vm';
import {
    setMultiLineEditorFontSize,
    setPickerEditorImageLocation,
    getPickerEditorValueText,
} from '../../../shared/helpers/ui-data-form';

let textInputModalVm: NewItemModalViewModel = null;

export function onShownModally(args: ShownModallyData) {
    const page = <Page>args.object;
    const itemDetailsDataForm: RadDataForm = page.getViewById('itemDetailsDataForm');
    textInputModalVm = new NewItemModalViewModel(args, itemDetailsDataForm);
    page.bindingContext = textInputModalVm;
}

export function onEditorUpdate(args: DataFormEventData) {
    switch (args.propertyName) {
        case 'title': editorSetupMultiLine(args.editor); break;
        case 'description': editorSetupMultiLine(args.editor); break;
        case 'typeStr': editorSetupType(args.editor); break;
    }
}

function editorSetupMultiLine(editor) {
    setMultiLineEditorFontSize(editor, 17);
}

function editorSetupType(editor) {
    setPickerEditorImageLocation(editor);
    const selectedTypeValue = <PtItemType>getPickerEditorValueText(editor);
    textInputModalVm.updateSelectedTypeValue(selectedTypeValue);
}
