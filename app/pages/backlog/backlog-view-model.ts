import { Observable, PropertyChangeData } from 'data/observable';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { PtItem } from '../../core/models/domain';
import * as backlogService from '../../services/backlog-service';

export class BacklogViewModel extends Observable {
    public items: ObservableArray<PtItem>;


    constructor() {
        super();
        this.items = new ObservableArray();
        this.refresh();
    }

    public refresh() {
        backlogService.fetchItems().then((r: PtItem[]) => {
            // empty the array
            this.items.length = 0;

            // push the result into the array
            this.items.push(r);
        });
    }

    public addItem(newItem, assignee) {
        backlogService.addNewPtItem(newItem, assignee)
            .then((r: PtItem) => {
                this.items.unshift(r);
            })
            .catch(() => {
                console.log('some error occured');
            });
    }
}
