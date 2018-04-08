import * as appSettings from 'application-settings';
const fetchModule = require('fetch');

const config = require('../config/app-config');
const h = require('../shared/helpers');

import {
    PtUser,
    PtLoginModel,
    PtAuthToken,
    PtRegisterModel
} from '../core/models/domain';
import { topmost } from 'tns-core-modules/ui/frame/frame';
import { ROUTES } from '../shared/routes';

export const CURRENT_USER_KEY = 'CURRENT_USER_KEY';
const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';



function getLoginUrl() {
    return `${config.apiEndpoint}/auth`;
}
function getRegisterUrl() {
    return `${config.apiEndpoint}/register`;
}

function getCurrentUser() {
    const user = appSettings.getString(CURRENT_USER_KEY, '');
    return user;
}

function setCurrentUser(ptUser: any) {
    ptUser.avatar = `${config.apiEndpoint}/photo/${ptUser.id}`;
    appSettings.getString(CURRENT_USER_KEY, ptUser);
}

export function isLoggedIn(): boolean {
    const hasToken =
        appSettings.getString(AUTH_TOKEN_KEY, '') === '' ? false : true;
    const hasCurrentUser = getCurrentUser() === '' ? false : true;
    return hasToken && hasCurrentUser;
}

export function login(loginModel: PtLoginModel) {
    const request = new Promise((resolve, reject) => {
        fetchModule
            .fetch(getLoginUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    loginModel: loginModel,
                    grant_type: 'password'
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

export function register(registerModel: PtRegisterModel) {
    const request = new Promise((resolve, reject) => {
        fetchModule
            .fetch(getRegisterUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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

export function logout() {
    appSettings.clear();
    topmost().navigate({
        moduleName: ROUTES.loginPage,
        clearHistory: true
    });
}
