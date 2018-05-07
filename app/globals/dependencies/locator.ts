import {
  PtAuthService,
  PtBacklogService,
  PtCommentService,
  PtStorageService,
  PtTaskService,
  PtUserService
} from '~/core/contracts/services';
import { appDeps } from '~/globals/dependencies/startup';

export function getAuthService(): PtAuthService {
  return appDeps.authService;
}

export function getBacklogService(): PtBacklogService {
  return appDeps.backlogService;
}

export function getCommentService(): PtCommentService {
  return appDeps.commentService;
}

export function getStorageService(): PtStorageService {
  return appDeps.storageService;
}

export function getTaskService(): PtTaskService {
  return appDeps.taskService;
}

export function getUserService(): PtUserService {
  return appDeps.userService;
}
