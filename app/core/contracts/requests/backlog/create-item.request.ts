import { AppConfig } from '~/core/models/config/app-config.model';
import { PtUser } from '~/core/models/domain';
import { PtNewItem } from '~/core/models/dto/backlog';
import { PtConfigurableRequest } from '../configurable.request';

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
