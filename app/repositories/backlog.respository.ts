const config = require("../config/app-config");
const fetchModule = require("fetch");
const h = require("../shared/helpers");
import { PtTask, PtItem, PtComment } from "../core/models/domain";
import { PresetType } from "../shared/models/ui/types";

export class BacklogRepository {
    constructor() {}

    private getFilteredBacklogUrl(
        currentPreset: PresetType,
        currentUserId?: number
    ) {
        switch (currentPreset) {
            case "my":
                if (currentUserId) {
                    return `${
                        config.apiEndpoint
                    }/myItems?userId=${currentUserId}`;
                } else {
                    return `${config.apiEndpoint}/backlog`;
                }
            case "open":
                return `${config.apiEndpoint}/openItems`;
            case "closed":
                return `${config.apiEndpoint}/closedItems`;
            default:
                return `${config.apiEndpoint}/backlog`;
        }
    }

    private getPtItemUrl(itemId: number) {
        return `${config.apiEndpoint}/item/${itemId}`;
    }

    private postPtItemUrl() {
        return `${config.apiEndpoint}/item`;
    }

    private putPtItemUrl(itemId: number) {
        return `${config.apiEndpoint}/item/${itemId}`;
    }

    private deletePtItemUrl(itemId: number) {
        return `${config.apiEndpoint}/item/${itemId}`;
    }

    private postPtTaskUrl() {
        return `${config.apiEndpoint}/task`;
    }

    private putPtTaskUrl(taskId: number) {
        return `${config.apiEndpoint}/task/${taskId}`;
    }

    private postPtCommentUrl() {
        return `${config.apiEndpoint}/comment`;
    }

    private deletePtCommentUrl(commentId: number) {
        return `${config.apiEndpoint}/comment/${commentId}`;
    }

    public getPtItems(
        currentPreset: PresetType,
        currentUserId: number,
        errorHandler: (error: any) => void,
        successHandler: (data: PtItem[]) => void
    ) {
        fetchModule
            .fetch(this.getFilteredBacklogUrl(currentPreset, currentUserId), {
                method: "GET"
            })
            .then(h.handleErrors)
            .then(response => {
                if (response.error) {
                    errorHandler(response);
                } else {
                    successHandler(response);
                }
            });
    }

    public getPtItem(
        ptItemId: number,
        errorHandler: (error: any) => void,
        successHandler: (ptItem: PtItem) => void
    ) {
        fetchModule
            .fetch(this.getPtItemUrl(ptItemId), {
                method: "GET"
            })
            .then(h.handleErrors)
            .then(response => {
                if (response.error) {
                    errorHandler(response);
                } else {
                    successHandler(response);
                }
            });
    }

    public insertPtItem(
        item: PtItem,
        errorHandler: (error: any) => void,
        successHandler: (nextItem: PtItem) => void
    ) {
        fetchModule
            .fetch(this.postPtItemUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ item: item })
            })
            .then(h.handleErrors)
            .then(response => {
                if (response.error) {
                    errorHandler(response);
                } else {
                    successHandler(response);
                }
            });
    }

    public updatePtItem(
        item: PtItem,
        errorHandler: (error: any) => void,
        successHandler: (updatedItem: PtItem) => void
    ) {
        fetchModule
            .fetch(this.putPtItemUrl(item.id), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ item: item })
            })
            .then(h.handleErrors)
            .then(response => {
                if (response.error) {
                    errorHandler(response);
                } else {
                    successHandler(response);
                }
            });
    }

    public deletePtItem(
        itemId: number,
        errorHandler: (error: any) => void,
        successHandler: () => void
    ) {
        fetchModule
            .fetch(this.deletePtItemUrl(itemId), {
                method: "DELETE"
            })
            .then(h.handleErrors)
            .then(response => {
                if (response.error) {
                    errorHandler(response);
                } else {
                    successHandler();
                }
            });
    }

    public insertPtTask(
        task: PtTask,
        ptItemId: number,
        errorHandler: (error: any) => void,
        successHandler: (nextTask: PtTask) => void
    ) {
        fetchModule
            .fetch(this.postPtTaskUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ task: task, itemId: ptItemId })
            })
            .then(h.handleErrors)
            .then(response => {
                if (response.error) {
                    errorHandler(response);
                } else {
                    successHandler(response);
                }
            });
    }

    public updatePtTask(
        task: PtTask,
        ptItemId: number,
        errorHandler: (error: any) => void,
        successHandler: (updatedTask: PtTask) => void
    ) {
        fetchModule
            .fetch(this.putPtTaskUrl(task.id), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ task: task, itemId: ptItemId })
            })
            .then(h.handleErrors)
            .then(response => {
                if (response.error) {
                    errorHandler(response);
                } else {
                    successHandler(response);
                }
            });
    }

    public insertPtComment(
        comment: PtComment,
        ptItemId: number,
        errorHandler: (error: any) => void,
        successHandler: (nextComment: PtComment) => void
    ) {
        fetchModule
            .fetch(this.postPtCommentUrl(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    comment: comment,
                    itemId: ptItemId
                })
            })
            .then(h.handleErrors)
            .then(response => {
                if (response.error) {
                    errorHandler(response);
                } else {
                    successHandler(response);
                }
            });
    }

    public deletePtComment(
        ptCommentId: number,
        errorHandler: (error: any) => void,
        successHandler: () => void
    ) {
        fetchModule
            .fetch(this.deletePtCommentUrl(ptCommentId), {
                method: "DELETE"
            })
            .then(h.handleErrors)
            .then(response => {
                if (response.error) {
                    errorHandler(response);
                } else {
                    successHandler();
                }
            });
    }
}
