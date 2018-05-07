import { PtConfigurableRequest } from '../configurable.request';
import { PtNewItem } from '~/core/models/dto/backlog';
import { PtUser } from '~/core/models/domain';
import { AppConfig } from '~/core/models/config/app-config.model';

export interface CreateItemRequest extends PtConfigurableRequest {
  newItem: PtNewItem;
  assignee: PtUser;
}

export function toCreateItemRequest(
  appConfig: AppConfig,
  newItem: PtNewItem,
  assignee: PtUser
): CreateItemRequest {
  return {
    appConfig,
    newItem,
    assignee
  };
}
