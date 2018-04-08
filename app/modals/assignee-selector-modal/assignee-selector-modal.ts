import { PtUser } from '../../core/models/domain';
import { fetchUsers } from '../../services/pt-user.service';
import { getCurrentPage } from '../../services/navigation.service';


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
    const currentPage = getCurrentPage();
    if (currentPage && currentPage.modal) {
        currentPage.modal.closeModal();
    }
}

export function onItemSelected(args) {
    closeCallback(context[args.index]);
}
