import * as _ from "lodash";

const config = require("../config/app-config");

import * as appSettings from "application-settings";
import { PtItem, PtUser, PtTask, PtComment } from "../core/models/domain";
import { PtNewItem, PtNewTask, PtNewComment } from "../shared/models/dto";
import { PriorityEnum, StatusEnum } from "../core/models/domain/enums";
import { getUserAvatarUrl } from "../core/helpers/user-avatar-helper";
import { BacklogRepository } from "../repositories/backlog.respository";
import { PresetType } from "../shared/models/ui/types";

const CURRENT_USER_KEY = "CURRENT_USER_KEY";
const AUTH_TOKEN_KEY = "AUTH_TOKEN_KEY";
export class BacklogService {
    private repo: BacklogRepository;

    private get currentPreset(): PresetType {
        return <PresetType>appSettings.getString("currentPreset", "open");
    }

    private get currentUserId() {
        const user = JSON.parse(
            appSettings.getString("CURRENT_USER_KEY", "{}")
        );

        return user.id ? user.id : undefined;
    }

    constructor() {
        this.repo = new BacklogRepository();
    }

    public fetchItems() {
        return new Promise((resolve, reject) => {
            this.repo.getPtItems(
                this.currentPreset,
                this.currentUserId,
                error => {
                    reject(error);
                    console.dir(error);
                },
                (ptItems: PtItem[]) => {
                    ptItems.forEach(i => {
                        this.setUserAvatar(i.assignee);
                        i.comments.forEach(c => this.setUserAvatar(c.user));
                    });

                    appSettings.setString(
                        "backlogItems",
                        JSON.stringify(ptItems)
                    );
                    resolve(ptItems);
                }
            );
        });
    }

    private setUserAvatar(user: PtUser) {
        user.avatar = getUserAvatarUrl(config.apiEndpoint, user.id);
    }

    public addNewPtItem(newItem: PtNewItem, assignee: PtUser) {
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
            this.repo.insertPtItem(
                item,
                error => {
                    reject(error);
                    console.dir(error);
                },
                (nextItem: PtItem) => {
                    this.setUserAvatar(nextItem.assignee);
                    let backlogItems = JSON.parse(
                        appSettings.getString("backlogItems", "[]")
                    );
                    backlogItems = [nextItem, ...backlogItems];
                    appSettings.setString(
                        "backlogItems",
                        JSON.stringify(backlogItems)
                    );
                    resolve(nextItem);
                }
            );
        });
    }

    public updatePtItem(item: PtItem) {
        return new Promise((resolve, reject) => {
            this.repo.updatePtItem(
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

    public deletePtItem(item: PtItem) {
        return new Promise((resolve, reject) => {
            this.repo.deletePtItem(
                item.id,
                error => {
                    reject(error);
                    console.dir(error);
                },
                () => {
                    const backlogItems = JSON.parse(
                        appSettings.getString("backlogItems", "[]")
                    );
                    const updatedItems = backlogItems.filter(i => {
                        return i.id !== item.id;
                    });
                    appSettings.setString(
                        "backlogItems",
                        JSON.stringify(updatedItems)
                    );
                    resolve(true);
                }
            );
        });
    }

    public updatePtTask(
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

        this.repo.updatePtTask(
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
}
