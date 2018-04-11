const config = require('../config/app-config');

import * as errorService from '../services/error-handler.service';
import { PtTask, PtItem, PtComment } from '../core/models/domain';
import { PresetType } from '../shared/models/ui/types';


function getFilteredBacklogUrl(
    currentPreset: PresetType,
    currentUserId?: number
) {
    switch (currentPreset) {
        case 'my':
            if (currentUserId) {
                return `${
                    config.apiEndpoint
                    }/myItems?userId=${currentUserId}`;
            } else {
                return `${config.apiEndpoint}/backlog`;
            }
        case 'open':
            return `${config.apiEndpoint}/openItems`;
        case 'closed':
            return `${config.apiEndpoint}/closedItems`;
        default:
            return `${config.apiEndpoint}/backlog`;
    }
}

function getPtItemUrl(itemId: number) {
    return `${config.apiEndpoint}/item/${itemId}`;
}

function postPtItemUrl() {
    return `${config.apiEndpoint}/item`;
}

function putPtItemUrl(itemId: number) {
    return `${config.apiEndpoint}/item/${itemId}`;
}

function deletePtItemUrl(itemId: number) {
    return `${config.apiEndpoint}/item/${itemId}`;
}

function postPtTaskUrl() {
    return `${config.apiEndpoint}/task`;
}

function putPtTaskUrl(taskId: number) {
    return `${config.apiEndpoint}/task/${taskId}`;
}

function postPtCommentUrl() {
    return `${config.apiEndpoint}/comment`;
}

function deletePtCommentUrl(commentId: number) {
    return `${config.apiEndpoint}/comment/${commentId}`;
}

export function getPtItems(
    currentPreset: PresetType,
    currentUserId: number,
    errorHandler: (error: any) => void,
    successHandler: (data: PtItem[]) => void
) {
    fetch(getFilteredBacklogUrl(currentPreset, currentUserId), {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            successHandler(data);
        })
        .catch(errorService.handleErrors);
}

export function getPtItem(
    ptItemId: number,
    errorHandler: (error: any) => void,
    successHandler: (ptItem: PtItem) => void
) {
    fetch(getPtItemUrl(ptItemId), {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            successHandler(data);
        })
        .catch(errorService.handleErrors);
}

export function insertPtItem(
    item: PtItem,
    errorHandler: (error: any) => void,
    successHandler: (nextItem: PtItem) => void
) {
    fetch(postPtItemUrl(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item: item })
    })
        .then(response => response.json())
        .then(data => {
            successHandler(data);
        })
        .catch(errorService.handleErrors);
}

export function updatePtItem(
    item: PtItem,
    errorHandler: (error: any) => void,
    successHandler: (updatedItem: PtItem) => void
) {
    fetch(putPtItemUrl(item.id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item: item })
    })
        .then(response => response.json())
        .then(data => {
            successHandler(data);
        })
        .catch(errorService.handleErrors);
}

export function deletePtItem(
    itemId: number,
    errorHandler: (error: any) => void,
    successHandler: () => void
) {
    fetch(deletePtItemUrl(itemId), {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            successHandler();
        })
        .catch(errorService.handleErrors);
}

export function insertPtTask(
    task: PtTask,
    ptItemId: number,
    errorHandler: (error: any) => void,
    successHandler: (nextTask: PtTask) => void
) {
    fetch(postPtTaskUrl(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: task, itemId: ptItemId })
    })
        .then(response => response.json())
        .then(data => {
            successHandler(data);
        })
        .catch(errorService.handleErrors);
}

export function updatePtTask(
    task: PtTask,
    ptItemId: number,
    errorHandler: (error: any) => void,
    successHandler: (updatedTask: PtTask) => void
) {
    fetch(putPtTaskUrl(task.id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: task, itemId: ptItemId })
    })
        .then(response => response.json())
        .then(data => {
            successHandler(data);
        })
        .catch(errorService.handleErrors);
}

export function insertPtComment(
    comment: PtComment,
    ptItemId: number,
    errorHandler: (error: any) => void,
    successHandler: (nextComment: PtComment) => void
) {
    fetch(postPtCommentUrl(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            comment: comment,
            itemId: ptItemId
        })
    })
        .then(response => response.json())
        .then(data => {
            successHandler(data);
        })
        .catch(errorService.handleErrors);
}

export function deletePtComment(
    ptCommentId: number,
    errorHandler: (error: any) => void,
    successHandler: () => void
) {
    fetch(deletePtCommentUrl(ptCommentId), {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            successHandler();
        })
        .catch(errorService.handleErrors);
}
