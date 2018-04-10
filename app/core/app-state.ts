import { PtItem, PtUser } from './models/domain';
import { PresetType } from '../shared/models/ui/types';


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

