import { getBacklogService } from '~/globals/dependencies/locator';
import { goToSettingsPage } from '~/shared/helpers/navigation/nav.helper';

let container = null;

export function onLoaded(args) {
  container = args.object;
}

export function onSelectPresetTap(args) {
  const backlogService = getBacklogService();
  const selPreset = args.object.preset;
  backlogService.setPreset(selPreset).then(() => {
    container.presetSelected.apply(container.page.bindingContext, [selPreset]);
  });
}

export function onSettingsTap(args) {
  goToSettingsPage();
}
