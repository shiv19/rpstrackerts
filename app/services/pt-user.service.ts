import * as fetchModule from 'fetch';

const config = require('../config/app-config');
import * as helpers from '../shared/helpers';
import { PtUser } from '../core/models/domain';

function getUsersUrl() {
    return `${config.apiEndpoint}/users`;
}

export function fetchUsers() {
    return new Promise((resolve, reject) => {
        fetchModule
            .fetch(getUsersUrl(), {
                method: 'GET'
            })
            .then(helpers.handleErrors)
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
