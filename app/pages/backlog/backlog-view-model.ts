import { Observable, PropertyChangeData, EventData } from 'data/observable';
import { ObservableArray } from 'data/observable-array';
import { ItemEventData } from 'ui/list-view';

import * as backlogService from '../../services/backlog.service';
import { navigate, goToDetailPage, goToSettingsPage } from '../../services/navigation.service';
import { PtItem, PtUser } from '../../core/models/domain';
import { logout } from '../../services/auth.service';
import { appStore } from '../../core/app-store';
require('../../shared/converters'); // register converters


export class BacklogViewModel extends Observable {
    public items: ObservableArray<PtItem> = new ObservableArray<PtItem>();

    constructor() {
        super();
        this.refresh();
    }

    public onSelectPresetTap(args) {
        appStore.set('selectedPreset', args.object.preset);
        this.refresh();
    }

    public onSettingsTap(args: EventData) {
        goToSettingsPage();
    }

    public onListItemTap(args: ItemEventData) {
        goToDetailPage(args.view.bindingContext);
    }

    public addNewItemHandler(newItem: PtItem) {
        if (newItem) {
            this.addItem(newItem, appStore.value.currentUser);
        }
    }

    public onLogoutTap(args) {
        logout();
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
