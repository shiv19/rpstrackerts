import * as appSettings from 'application-settings';
import { Observable, PropertyChangeData, EventData } from 'data/observable';
import { ObservableArray } from 'data/observable-array';
import { NavigationEntry, View } from 'ui/frame';
import { ItemEventData } from 'ui/list-view';
import { Button } from 'ui/button';

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

import * as backlogService from '../../services/backlog.service';
import { navigate } from '../../services/navigation.service';
import { showModalNewItem } from '../../services/modal.service';
import { PtItem, PtUser } from '../../core/models/domain';
import { ROUTES } from '../../shared/routes';
import { CURRENT_USER_KEY, logout } from '../../services/auth.service';
require('../../shared/converters'); // register converters


export class BacklogViewModel extends Observable {
    public items: ObservableArray<PtItem>;
    public drawer: RadSideDrawer;

    constructor() {
        super();
        this.items = new ObservableArray();
        this.refresh();
    }

    public toggleDrawer() {
        this.drawer.toggleDrawerState();
    }

    public onSelectPresetTap(args) {
        appSettings.setString('currentPreset', args.object.preset);
        this.refresh();
    }

    public onRefreshRequested(args) {
        // Get reference to the PullToRefresh;
        const pullToRefresh = args.object;
        this.refresh();
        pullToRefresh.refreshing = false;
    }

    public onListItemTap(args: ItemEventData) {
        const view = <View>args.object;
        const navEntry: NavigationEntry = {
            moduleName: ROUTES.detailPage,
            animated: true,
            transition: {
                name: 'slide',
                duration: 380
            },
            context: args.view.bindingContext
        };
        navigate(navEntry, view.page.frame);
    }

    public onAddTap(args: EventData) {
        const button = <Button>args.object;

        showModalNewItem(button.page)
            .then(newItem => {
                if (newItem) {
                    const assignee: PtUser = JSON.parse(
                        appSettings.getString(CURRENT_USER_KEY, '{}')
                    );
                    this.addItem(newItem, assignee);
                }
            });
    }

    public onSettingsTap(args: EventData) {
        const button = <Button>args.object;
        const navEntry: NavigationEntry = {
            moduleName: ROUTES.settingsPage,
            animated: true,
            transition: {
                name: 'slide',
                duration: 380
            }
        };
        navigate(navEntry, button.page.frame);
    }

    public onLogoutTap(args) {
        logout();
    }

    private refresh() {
        backlogService.fetchItems().then((r: PtItem[]) => {
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
