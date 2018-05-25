import { PresetType } from '~/core/models/types';
import { PtItem, PtUser } from './models/domain';

export interface State {
  backlogItems: PtItem[];
  users: PtUser[];
  currentUser: PtUser;
  currentSelectedItem: PtItem;
  selectedPreset: PresetType;
}

export const INITIAL_STATE: State = {
  backlogItems: [],
  users: [],
  currentUser: undefined,
  currentSelectedItem: undefined,
  selectedPreset: 'open'
};
