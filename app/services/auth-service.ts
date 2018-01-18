import * as appSettings from "application-settings";
const config = require("../config/app-config");
const fetchModule = require("fetch");
const h = require("../shared/helpers");

import {
    PtUser,
    PtLoginModel,
    PtAuthToken,
    PtRegisterModel
} from "../core/models/domain";

const CURRENT_USER_KEY = "CURRENT_USER_KEY";
const AUTH_TOKEN_KEY = "AUTH_TOKEN_KEY";

export class AuthService {
    private get loginUrl() {
        return `${config.apiEndpoint}/auth`;
    }
    private get registerUrl() {
        return `${config.apiEndpoint}/register`;
    }

    get currentUser() {
        const user = appSettings.getString(CURRENT_USER_KEY, "");
        return user;
    }

    set currentUser(ptUser: any) {
        ptUser.avatar = `${config.apiEndpoint}/photo/${ptUser.id}`;
        appSettings.getString(CURRENT_USER_KEY, ptUser);
    }

    public isLoggedIn(): boolean {
        const hasToken =
            appSettings.getString(AUTH_TOKEN_KEY, "") === "" ? false : true;
        const hasCurrentUser = this.currentUser === "" ? false : true;
        return hasToken && hasCurrentUser;
    }

    public login(loginModel: PtLoginModel) {
        const request = new Promise((resolve, reject) => {
            fetchModule
                .fetch(this.loginUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        loginModel: loginModel,
                        grant_type: "password"
                    })
                })
                .then(h.handleErrors)
                .then(response => {
                    if (response.error) {
                        reject(response);
                    } else {
                        const data: {
                            authToken: PtAuthToken;
                            user: PtUser;
                        } = response;
                        appSettings.setString(
                            AUTH_TOKEN_KEY,
                            JSON.stringify(data.authToken)
                        );
                        appSettings.setString(
                            CURRENT_USER_KEY,
                            JSON.stringify(data.user)
                        );
                        resolve(true);
                    }
                });
        });

        return Promise.race([new h.Timeout(), request]);
    }

    public register(registerModel: PtRegisterModel) {
        const request = new Promise((resolve, reject) => {
            fetchModule
                .fetch(this.registerUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        registerModel: registerModel
                    })
                })
                .then(h.handleErrors)
                .then(response => {
                    if (response.error) {
                        reject(response);
                    } else {
                        const data: {
                            authToken: PtAuthToken;
                            user: PtUser;
                        } = response;
                        appSettings.setString(
                            AUTH_TOKEN_KEY,
                            JSON.stringify(data.authToken)
                        );
                        appSettings.setString(
                            CURRENT_USER_KEY,
                            JSON.stringify(data.user)
                        );
                        resolve(true);
                    }
                });
        });

        return Promise.race([new h.Timeout(), request]);
    }

    public logout() {
        appSettings.clear();
    }
}
