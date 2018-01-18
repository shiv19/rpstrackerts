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
}
