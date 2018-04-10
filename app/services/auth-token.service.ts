import * as storageService from './storage.service';
import { PtAuthToken } from '../core/models/domain';


const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';

export function getToken(): PtAuthToken {
    return storageService.getItem<PtAuthToken>(AUTH_TOKEN_KEY);
}

export function setToken(authToken: PtAuthToken) {
    storageService.setItem<PtAuthToken>(AUTH_TOKEN_KEY, authToken);
}

