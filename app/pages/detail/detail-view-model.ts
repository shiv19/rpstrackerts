import { Observable, PropertyChangeData } from "data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { PtItem } from "../../core/models/domain";
import { BacklogService } from "../../services/backlog-service";

export class DetailViewModel extends Observable {
    backlogService: BacklogService;
    item: PtItem;
    selectedScreen: string;
    form;
    formMetaData = {
        isReadOnly: false,
        commitMode: "Immediate",
        validationMode: "Immediate",
        propertyAnnotations: [
            {
                name: "title",
                displayName: "Title",
                index: 0
            },
            {
                name: "description",
                displayName: "Description",
                index: 1
            },
            {
                name: "type",
                displayName: "Type",
                index: 2,
                editor: "Picker",
                valuesProvider: ["Bug", "PBI", "Chore", "Impediment"]
            },
            {
                name: "status",
                displayName: "Status",
                index: 3,
                editor: "Picker",
                valuesProvider: ["Submitted", "Open", "Closed", "ReOpened"]
            },
            {
                name: "estimate",
                displayName: "Estimate",
                index: 4,
                editor: "Stepper",
                minimum: 1,
                maximum: 10,
                step: 1
            },
            {
                name: "priority",
                displayName: "Priority",
                index: 5,
                editor: "SegmentedPicker",
                valuesProvider: ["Low", "Medium", "High", "Critical"]
            }
        ]
    };

    constructor(item) {
        super();
        this.item = item;
        this.form = {
            title: item.title,
            description: item.description,
            type: item.type,
            status: item.status,
            estimate: item.estimate,
            priority: item.priority
        };
        this.selectedScreen = "details";
        this.backlogService = new BacklogService();
    }
}
