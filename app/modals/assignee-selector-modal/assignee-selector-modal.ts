import { topmost } from 'ui/frame';

import { PtUser } from '../../core/models/domain';
import { fetchUsers } from '../../services/pt-user.service';


let closeCallback;
let context;

export function onShownModally(args) {
    context = args.context;
    const modal = args.object;

    closeCallback = args.closeCallback;

    fetchUsers()
        .then((users: PtUser[]) => {
            context = users;
            modal.getViewById('listView').items = users;
        })
        .catch(error => {
            console.dir(error);
        });
}

export function onCancelButtonTap() {
    const page = topmost().currentPage;
    if (page && page.modal) {
        page.modal.closeModal();
    }
}

export function onItemSelected(args) {
    closeCallback(context[args.index]);
}
