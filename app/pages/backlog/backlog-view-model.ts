import { Observable, PropertyChangeData } from "data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { PtItem } from "../../core/models/domain";
import { BacklogService } from "../../services/backlog-service";

export class BacklogViewModel extends Observable {
    public items: ObservableArray<PtItem> = new ObservableArray();
    backlogService: BacklogService;
    constructor() {
        super();
        this.backlogService = new BacklogService();
        this.backlogService.fetchItems().then((r: PtItem[]) => {
            this.items.push(r);
        });
    }
}
