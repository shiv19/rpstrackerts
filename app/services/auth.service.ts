const fetchModule = require('fetch');

import * as storageService from './storage.service';
import * as authTokenService from './auth-token.service';
const config = require('../config/app-config');
const h = require('../shared/helpers');

import { PtUser, PtLoginModel, PtAuthToken, PtRegisterModel } from '../core/models/domain';
import { goToLoginPage } from './navigation.service';
import { getUserAvatarUrl } from '../core/helpers/user-avatar-helper';
import { appStore } from '../core/app-store';
import { Observable } from 'rxjs/Observable';
import { EMPTY_STRING } from '../core/helpers/string-helpers';

export const CURRENT_USER_KEY = 'CURRENT_USER_KEY';

function getLoginUrl() {
    return `${config.apiEndpoint}/auth`;
}
function getRegisterUrl() {
    return `${config.apiEndpoint}/register`;
}

export function getCurrentUser(): PtUser {
    const user = storageService.getItem<PtUser>(CURRENT_USER_KEY);
    if (!appStore.value.currentUser && user) {
        appStore.set('currentUser', user);
    }
    return user;
}

function setCurrentUser(ptUser: any) {
    ptUser.avatar = getUserAvatarUrl(config.apiEndpoint, ptUser.id);
    storageService.setItem<PtUser>(CURRENT_USER_KEY, ptUser);
    appStore.set('currentUser', ptUser);
}

export function isLoggedIn(): boolean {
    const hasToken = !!authTokenService.getToken();
    const hasCurrentUser = !!getCurrentUser();
    return hasToken && hasCurrentUser;
}

export function login(loginModel: PtLoginModel): Promise<PtUser> {
    return new Promise<PtUser>((resolve, reject) => {
        fetch(getLoginUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                loginModel: loginModel,
                grant_type: 'password'
            })
        })
            .then(response => response.json())
            .then((data: { authToken: PtAuthToken, user: PtUser }) => {
                authTokenService.setToken(data.authToken);
                setCurrentUser(data.user);
                resolve(getCurrentUser());
            })
            .catch(h.handleErrors);
    });
}

export function register(registerModel: PtRegisterModel): Promise<PtUser> {
    return new Promise<PtUser>((resolve, reject) => {
        fetch(getRegisterUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                registerModel: registerModel
            })
        })
            .then(response => response.json())
            .then((data: { authToken: PtAuthToken, user: PtUser }) => {
                authTokenService.setToken(data.authToken);
                setCurrentUser(data.user);
                resolve(getCurrentUser());
            })
            .catch(h.handleErrors);
    });
}

export function logout() {
    authTokenService.setToken({ access_token: EMPTY_STRING, dateExpires: new Date() });
    storageService.setItem(CURRENT_USER_KEY, EMPTY_STRING);
    goToLoginPage();
}
