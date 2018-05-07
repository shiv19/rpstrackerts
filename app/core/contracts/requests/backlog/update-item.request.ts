import { PtConfigurableRequest } from '~/core/contracts/requests/configurable.request';
import { AppConfig } from '~/core/models/config/app-config.model';
import { PtItem } from '~/core/models/domain';

export interface UpdateItemRequest extends PtConfigurableRequest {
  itemToUpdate: PtItem;
}

export function toUpdateItemRequest(
  appConfig: AppConfig,
  itemToUpdate: PtItem
): UpdateItemRequest {
  return {
    appConfig,
    itemToUpdate
  };
}
