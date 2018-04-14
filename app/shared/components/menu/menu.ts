import * as backlogService from '../../../services/backlog.service';
import * as navService from '../../../services/navigation.service';

let container = null;

export function onLoaded(args) {
    container = args.object;
}

export function onSelectPresetTap(args) {
    const selPreset = args.object.preset;
    backlogService.setPreset(selPreset)
        .then(() => {
            container.presetSelected.apply(container.page.bindingContext, [selPreset]);
        });
}

export function onSettingsTap(args) {
    navService.goToSettingsPage();
}
