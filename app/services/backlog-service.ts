import * as appSettings from 'application-settings';

// import * as _ from 'lodash';

const config = require('../config/app-config');
import { PtItem, PtUser, PtTask, PtComment } from '../core/models/domain';
import { PtNewItem, PtNewTask, PtNewComment } from '../shared/models/dto';
import { PriorityEnum, StatusEnum } from '../core/models/domain/enums';
import { getUserAvatarUrl } from '../core/helpers/user-avatar-helper';
import * as backlogRepo from '../repositories/backlog.respository';
import { PresetType } from '../shared/models/ui/types';

const CURRENT_USER_KEY = 'CURRENT_USER_KEY';
const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';


function getCurrentPreset(): PresetType {
    return <PresetType>appSettings.getString('currentPreset', 'open');
}

function getCurrentUserId() {
    const user = JSON.parse(
        appSettings.getString('CURRENT_USER_KEY', '{}')
    );

    return user.id ? user.id : undefined;
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

                appSettings.setString(
                    'backlogItems',
                    JSON.stringify(ptItems)
                );
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
                let backlogItems = JSON.parse(
                    appSettings.getString('backlogItems', '[]')
                );
                backlogItems = [nextItem, ...backlogItems];
                appSettings.setString(
                    'backlogItems',
                    JSON.stringify(backlogItems)
                );
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
                const backlogItems = JSON.parse(
                    appSettings.getString('backlogItems', '[]')
                );
                const updatedItems = backlogItems.filter(i => {
                    return i.id !== item.id;
                });
                appSettings.setString(
                    'backlogItems',
                    JSON.stringify(updatedItems)
                );
                resolve(true);
            }
        );
    });
}

export function addNewPtTask(newTask: PtNewTask, currentItem: PtItem) {
    const task: PtTask = {
        id: 0,
        title: newTask.title,
        completed: false,
        dateCreated: new Date(),
        dateModified: new Date()
    };

    return new Promise((resolve, reject) => {
        backlogRepo.insertPtTask(
            task,
            currentItem.id,
            error => {
                console.dir(error);
            },
            (_nextTask: PtTask) => {
                resolve(_nextTask);
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

    // Optimistically return updated item
    return updatedItem;
}

export function addNewPtComment(newComment: PtNewComment, currentItem: PtItem) {
    const comment: PtComment = {
        id: 0,
        title: newComment.title,
        user: JSON.parse(appSettings.getString(CURRENT_USER_KEY, '{}')),
        dateCreated: new Date(),
        dateModified: new Date()
    };

    return new Promise((resolve, reject) => {
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
