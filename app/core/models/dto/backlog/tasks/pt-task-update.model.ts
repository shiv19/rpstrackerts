import { PtTask } from '../../../domain';

export interface PtTaskUpdate {
  task: PtTask;
  toggle: boolean;
  newTitle?: string;
}
