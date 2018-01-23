import * as fetchModule from "fetch";
import * as h from "../../shared/helpers";
const config = require("../../config/app-config");

import { PtUser } from "../models/domain";

export class PtUserService {
    private get usersUrl() {
        return `${config.apiEndpoint}/users`;
    }

    constructor() {}

    public fetchUsers() {
        return new Promise((resolve, reject) => {
            fetchModule
                .fetch(this.usersUrl, {
                    method: "GET"
                })
                .then(h.handleErrors)
                .then(response => {
                    if (response.error) {
                        console.dir(response.error);
                        reject(response);
                    } else {
                        const data: PtUser[] = response;
                        data.forEach(u => {
                            u.avatar = `${config.apiEndpoint}/photo/${u.id}`;
                        });
                        resolve(data);
                    }
                });
        });
    }
}
