import { NavigatedData, Page, EventData, View } from 'ui/page';
import { ConfirmOptions, confirm } from 'ui/dialogs';

import { RadDataForm, DataFormEventData } from 'nativescript-ui-dataform';

import { PtItemType } from '../../../core/models/domain/types';
import { PriorityEnum } from '../../../core/models/domain/enums';
import { DetailViewModel } from '../../../shared/view-models/pages/detail/detail.page.vm';
import { COLOR_LIGHT, COLOR_DARK } from '../../../core/constants';
import {
  setMultiLineEditorFontSize,
  setPickerEditorImageLocation,
  getPickerEditorValueText,
  setStepperEditorContentOffset,
  setStepperEditorTextPostfix,
  setStepperEditorColors,
  setSegmentedEditorColor
} from '../../../shared/helpers/ui-data-form';

import '../../../shared/converters';
import { showModalAssigneeList } from '../../../shared/helpers/modals';

let detailsVm: DetailViewModel;

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  const currentItem = page.navigationContext;
  const itemDetailsDataForm: RadDataForm = page.getViewById(
    'itemDetailsDataForm'
  );
  detailsVm = new DetailViewModel(currentItem, itemDetailsDataForm);
  page.bindingContext = detailsVm;
}

export function onDeleteTap() {
  const options: ConfirmOptions = {
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item?',
    okButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  };
  // confirm with options, with promise
  confirm(options).then((result: boolean) => {
    // result can be true/false/undefined
    if (result) {
      detailsVm.deleteRequested();
    }
  });
}

export function onAssigneeRowTap(args: EventData) {
  const view = <View>args.object;

  showModalAssigneeList(view.page, detailsVm.getSelectedAssignee()).then(
    selectedAssignee => {
      if (selectedAssignee) {
        detailsVm.setSelectedAssignee(selectedAssignee);
      }
    }
  );
}

export function onEditorUpdate(args: DataFormEventData) {
  switch (args.propertyName) {
    case 'description':
      editorSetupDescription(args.editor);
      break;
    case 'typeStr':
      editorSetupType(args.editor);
      break;
    case 'estimate':
      editorSetupEstimate(args.editor);
      break;
    case 'priorityStr':
      editorSetupPriority(args.editor);
      break;
  }
}

function editorSetupDescription(editor) {
  setMultiLineEditorFontSize(editor, 17);
}

function editorSetupType(editor) {
  setPickerEditorImageLocation(editor);
  const selectedTypeValue = <PtItemType>getPickerEditorValueText(editor);
  detailsVm.updateSelectedTypeValue(selectedTypeValue);
}

function editorSetupEstimate(editor) {
  setStepperEditorContentOffset(editor, -25, 0);
  setStepperEditorTextPostfix(editor, 'point', 'points');
  setStepperEditorColors(editor, COLOR_LIGHT, COLOR_DARK);
}

function editorSetupPriority(editor) {
  const editorPriority = <PriorityEnum>editor.value;
  const selectedPriorityValue = detailsVm.updateSelectedPriorityValue(
    editorPriority
  );
  setSegmentedEditorColor(editor, PriorityEnum.getColor(selectedPriorityValue));
}
