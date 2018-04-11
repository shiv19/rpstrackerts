import { Page } from 'ui/page';

const config = require('../config/app-config');
import * as modalService from './modal.service';
import { PtUser } from '../core/models/domain';
import { appStore } from '../core/app-store';
import { EMPTY_STRING } from '../core/models/domain/constants/strings';

function getUsersUrl() {
    return `${config.apiEndpoint}/users`;
}

export function getLocalUsers() {
    return appStore.value.users;
}

export function getUserAvatarUrl(apiEndPoint: string, userId: number) {
    return `${apiEndPoint}/photo/${userId}`;
}

export function fetchUsers(refresh?: boolean): Promise<PtUser[]> {
    return new Promise<PtUser[]>((resolve, reject) => {
        const localUsers = getLocalUsers();
        if (localUsers.length === 0 || refresh) {
            fetch(getUsersUrl(), {
                method: 'GET'
            })
                .then(response => response.json())
                .then((data: PtUser[]) => {
                    data.forEach(u => {
                        u.avatar = `${config.apiEndpoint}/photo/${u.id}`;
                    });
                    resolve(data);
                });
        } else {
            resolve(localUsers);
        }
    });
}

export function showModalAssigneeList(page: Page, currentAssignee: PtUser): Promise<PtUser> {
    return new Promise<PtUser>((resolve, reject) => {
        fetchUsers()
            .then(users => {
                const items = users.map(u => {
                    return { id: u.id, image: '', value: u.fullName };
                });
                const defaultItem = { id: currentAssignee.id, image: currentAssignee.avatar, value: currentAssignee.fullName };

                const ctx =
                    modalService.createPtModalContext<modalService.ModalItem[], modalService.ModalItem>(
                        'Select Assignee',
                        items,
                        defaultItem,
                        EMPTY_STRING,
                        'Cancel');

                modalService.showModalListSelector(page, ctx)
                    .then((modalItem) => {
                        const matchedUser = users.find(u => u.id === modalItem.id);
                        if (matchedUser.id === currentAssignee.id) {
                            resolve();
                        } else {
                            resolve(matchedUser);
                        }
                    });
            });
    });
}
