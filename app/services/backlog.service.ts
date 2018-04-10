const config = require('../config/app-config');
import * as backlogRepo from '../repositories/backlog.respository';
import { PtItem, PtUser, PtTask, PtComment } from '../core/models/domain';
import { PtNewItem, PtNewTask, PtNewComment } from '../shared/models/dto';
import { PriorityEnum, StatusEnum } from '../core/models/domain/enums';
import { getUserAvatarUrl } from '../core/helpers/user-avatar-helper';
import { PresetType } from '../shared/models/ui/types';
import { appStore } from '../core/app-store';


function getCurrentPreset(): PresetType {
    return appStore.value.selectedPreset;
}

function getCurrentUserId() {
    if (appStore.value.currentUser) {
        return appStore.value.currentUser.id;
    } else {
        return undefined;
    }
}

export function setPreset(preset) {
    return new Promise((resolve, reject) => {
        if (appStore.value.selectedPreset !== preset) {
            appStore.set('selectedPreset', preset);
            resolve();
        }
    });
}

export function fetchItems() {
    return new Promise((resolve, reject) => {
        backlogRepo.getPtItems(
            getCurrentPreset(),
            getCurrentUserId(),
            error => {
                reject(error);
                console.dir(error);
            },
            (ptItems: PtItem[]) => {
                ptItems.forEach(i => {
                    setUserAvatar(i.assignee);
                    i.comments.forEach(c => setUserAvatar(c.user));
                });

                appStore.set('backlogItems', ptItems);
                resolve(ptItems);
            }
        );
    });
}

function setUserAvatar(user: PtUser) {
    user.avatar = getUserAvatarUrl(config.apiEndpoint, user.id);
}

export function getCurrentUserAvatar() {
    return getUserAvatarUrl(config.apiEndpoint, getCurrentUserId());
}

export function addNewPtItem(newItem: PtNewItem, assignee: PtUser) {
    const item: PtItem = {
        id: 0,
        title: newItem.title,
        description: newItem.description,
        type: newItem.type,
        estimate: 0,
        priority: PriorityEnum.Medium,
        status: StatusEnum.Open,
        assignee: assignee,
        tasks: [],
        comments: [],
        dateCreated: new Date(),
        dateModified: new Date()
    };
    return new Promise((resolve, reject) => {
        backlogRepo.insertPtItem(
            item,
            error => {
                reject(error);
                console.dir(error);
            },
            (nextItem: PtItem) => {
                setUserAvatar(nextItem.assignee);

                appStore.set('backlogItems', [nextItem, ...appStore.value.backlogItems]);

                resolve(nextItem);
            }
        );
    });
}

export function updatePtItem(item: PtItem) {
    return new Promise((resolve, reject) => {
        backlogRepo.updatePtItem(
            item,
            error => {
                reject(error);
                console.dir(error);
            },
            (updatedItem: PtItem) => {
                resolve(updatedItem);
            }
        );
    });
}

export function deletePtItem(item: PtItem) {
    return new Promise((resolve, reject) => {
        backlogRepo.deletePtItem(
            item.id,
            error => {
                reject(error);
                console.dir(error);
            },
            () => {
                const updatedItems = appStore.value.backlogItems.filter((i) => {
                    return i.id !== item.id;
                });
                appStore.set('backlogItems', updatedItems);

                resolve(true);
            }
        );
    });
}

export function addNewPtTask(newTask: PtNewTask, currentItem: PtItem): Promise<PtTask> {
    const task: PtTask = {
        id: 0,
        title: newTask.title,
        completed: false,
        dateCreated: new Date(),
        dateModified: new Date()
    };

    return new Promise<PtTask>((resolve, reject) => {
        backlogRepo.insertPtTask(
            task,
            currentItem.id,
            error => {
                console.dir(error);
            },
            (nextTask: PtTask) => {
                resolve(nextTask);
            }
        );
    });
}

export function updatePtTask(
    currentItem: PtItem,
    task: PtTask,
    toggle: boolean,
    newTitle?: string
) {
    const taskToUpdate: PtTask = {
        id: task.id,
        title: newTitle ? newTitle : task.title,
        completed: toggle ? !task.completed : task.completed,
        dateCreated: task.dateCreated,
        dateModified: new Date()
    };

    const updatedTasks = currentItem.tasks.map(t => {
        if (t.id === task.id) {
            return taskToUpdate;
        } else {
            return t;
        }
    });

    const updatedItem = Object.assign({}, currentItem, {
        tasks: updatedTasks
    });

    backlogRepo.updatePtTask(
        taskToUpdate,
        currentItem.id,
        error => {
            console.dir(error);
        },
        (_updatedTask: PtTask) => {
            // do nothing
        }
    );

    return taskToUpdate;
}

export function addNewPtComment(newComment: PtNewComment, currentItem: PtItem): Promise<PtComment> {
    const comment: PtComment = {
        id: 0,
        title: newComment.title,
        user: appStore.value.currentUser,
        dateCreated: new Date(),
        dateModified: new Date()
    };

    return new Promise<PtComment>((resolve, reject) => {
        backlogRepo.insertPtComment(
            comment,
            currentItem.id,
            error => {
                console.dir(error);
            },
            (_nextComment: PtComment) => {
                resolve(_nextComment);
            }
        );
    });
}
