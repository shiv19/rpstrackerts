import { Observable } from 'data/observable';
import { ShownModallyData } from 'ui/page';

import { RadDataForm } from 'nativescript-ui-dataform';

import { PtNewItemForm, initializeNewItemForm } from '../../../models/forms';
import { ItemType } from '../../../../core/constants';
import { PtItemType } from '../../../../core/models/domain/types';
import { PtNewItem } from '../../../models/dto';


export class NewItemModalViewModel extends Observable {

    protected closeCallback: Function;
    private selectedTypeValue: PtItemType = 'Bug';

    public newItemForm: PtNewItemForm;
    public itemTypesProvider = ItemType.List.map((t) => t.PtItemType);
    public btnOkText = 'Save';
    public itemTypeImage;

    constructor(
        private modalData: ShownModallyData,
        private itemDetailsDataForm: RadDataForm
    ) {
        super();

        this.closeCallback = this.modalData.closeCallback;
        this.newItemForm = initializeNewItemForm();
    }

    public updateSelectedTypeValue(selTypeValue: PtItemType) {
        this.set('selectedTypeValue', selTypeValue);
        this.set('itemTypeImage', ItemType.imageResFromType(this.selectedTypeValue));
    }

    public onOkButtonTap() {
        this.itemDetailsDataForm.validateAndCommitAll()
            .then(ok => {
                if (ok) {
                    const newItem: PtNewItem = {
                        title: this.newItemForm.title,
                        description: this.newItemForm.description,
                        type: <PtItemType>this.newItemForm.typeStr
                    };

                    this.closeCallback(newItem);
                }
            });
    }

    public onCancelButtonTap(): void {
        this.closeCallback(null);
    }
}
