import { PtUserService } from '../../core/services/pt-user.service';
import { PtUser } from '../../core/models/domain';
import { topmost } from 'ui/frame';

let closeCallback;
let context;

export function onShownModally(args) {
    context = args.context;
    const modal = args.object;
    const userService = new PtUserService();
    closeCallback = args.closeCallback;

    userService
        .fetchUsers()
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
