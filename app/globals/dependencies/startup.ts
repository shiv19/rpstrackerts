import { appConfig } from '~/config/app-config';
import {
  PtAuthRepository,
  PtBacklogRepository,
  PtStorageRepository,
  PtUserRepository
} from '~/core/contracts/repositories';
import {
  PtAuthService,
  PtBacklogService,
  PtCommentService,
  PtStorageService,
  PtTaskService,
  PtUserService
} from '~/core/contracts/services';
import { AppConfig } from '~/core/models/config/app-config.model';
import { AuthService } from '~/core/services/auth';
import {
  BacklogService,
  CommentService,
  TaskService
} from '~/core/services/backlog';
import { StorageService } from '~/core/services/storage.service';
import { UserService } from '~/core/services/user.service';
import { AuthRepository } from '~/infrastructure/repositories/auth.repository';
import { BacklogRepository } from '~/infrastructure/repositories/backlog.respository';
import { StorageRepository } from '~/infrastructure/repositories/storage.repository';
import { UserRepository } from '~/infrastructure/repositories/user.repository';

const config = <AppConfig>appConfig;

export interface AppDependencies {
  authService: PtAuthService;
  backlogService: PtBacklogService;
  commentService: PtCommentService;
  storageService: PtStorageService;
  taskService: PtTaskService;
  userService: PtUserService;
}

function initDependencies(): AppDependencies {
  const authRepo: PtAuthRepository = new AuthRepository(config.apiEndpoint);
  const backlogRepo: PtBacklogRepository = new BacklogRepository(
    config.apiEndpoint
  );
  const storageRepo: PtStorageRepository = new StorageRepository();
  const userRepo: PtUserRepository = new UserRepository(config.apiEndpoint);

  const storageService = new StorageService(storageRepo);
  const authService = new AuthService(authRepo, storageService);
  const backlogService = new BacklogService(backlogRepo);
  const commentService = new CommentService(backlogRepo);

  const taskService = new TaskService(backlogRepo);
  const userService = new UserService(userRepo);

  return {
    authService: authService,
    backlogService: backlogService,
    commentService: commentService,
    storageService: storageService,
    taskService: taskService,
    userService: userService
  };
}

export const appDeps = initDependencies();
