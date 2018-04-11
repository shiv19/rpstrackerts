import { Observable } from 'data/observable';
import { ObservableArray } from 'data/observable-array';
import { ItemEventData } from 'ui/list-view';

import * as authService from '../../../../services/auth.service';
import * as backlogService from '../../../../services/backlog.service';
import * as navService from '../../../../services/navigation.service';
import { PtItem } from '../../../../core/models/domain';
import { PresetType } from '../../../models/ui/types';

export class BacklogViewModel extends Observable {
    public items: ObservableArray<PtItem> = new ObservableArray<PtItem>();

    constructor() {
        super();
    }

    public onPresetSelected(preset: PresetType) {
        this.refresh();
    }

    public onListItemTap(args: ItemEventData) {
        navService.goToDetailPage(args.view.bindingContext);
    }

    public addNewItemHandler(newItem: PtItem) {
        if (newItem) {
            this.addItem(newItem, authService.getCurrentUser());
        }
    }

    public onLogoutTap(args) {
        authService.logout();
    }

    public refresh() {
        backlogService.fetchItems()
            .then((r: PtItem[]) => {
                // empty the array
                this.items.length = 0;

                // push the result into the array
                this.items.push(r);
            });
    }

    private addItem(newItem, assignee) {
        backlogService.addNewPtItem(newItem, assignee)
            .then((r: PtItem) => {
                this.items.unshift(r);
            })
            .catch(() => {
                console.log('some error occured');
            });
    }
}
