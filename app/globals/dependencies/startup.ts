import { appConfig } from '~/config/app-config';
import {
  PtAuthRepository,
  PtBacklogRepository,
  PtLoggingRepository,
  PtStorageRepository,
  PtUserRepository
} from '~/core/contracts/repositories';
import {
  PtAuthService,
  PtBacklogService,
  PtCommentService,
  PtLoggingService,
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
import { LoggingService } from '~/core/services/logging.service';
import { StorageService } from '~/core/services/storage.service';
import { UserService } from '~/core/services/user.service';
import { AuthRepository } from '~/infrastructure/repositories/auth.repository';
import { BacklogRepository } from '~/infrastructure/repositories/backlog.respository';
import { LoggingRepository } from '~/infrastructure/repositories/logging.repository';
import { StorageRepository } from '~/infrastructure/repositories/storage.repository';
import { UserRepository } from '~/infrastructure/repositories/user.repository';

const config = <AppConfig>appConfig;

export function getApiEndpoint() {
  return config.apiEndpoint;
}

export interface AppDependencies {
  authService: PtAuthService;
  backlogService: PtBacklogService;
  commentService: PtCommentService;
  loggingService: PtLoggingService;
  storageService: PtStorageService;
  taskService: PtTaskService;
  userService: PtUserService;
}

function initDependencies(): AppDependencies {
  const authRepo: PtAuthRepository = new AuthRepository(config.apiEndpoint);
  const backlogRepo: PtBacklogRepository = new BacklogRepository(
    config.apiEndpoint
  );
  const loggingRepo: PtLoggingRepository = new LoggingRepository(
    config.loggingEnabled,
    config.loggingLevel
  );
  const storageRepo: PtStorageRepository = new StorageRepository();
  const userRepo: PtUserRepository = new UserRepository(config.apiEndpoint);

  const storageService = new StorageService(storageRepo);
  const authService = new AuthService(authRepo, storageService);
  const backlogService = new BacklogService(backlogRepo);
  const commentService = new CommentService(backlogRepo);
  const loggingService = new LoggingService(loggingRepo);
  const taskService = new TaskService(backlogRepo);
  const userService = new UserService(userRepo);

  return {
    authService: authService,
    backlogService: backlogService,
    commentService: commentService,
    loggingService: loggingService,
    storageService: storageService,
    taskService: taskService,
    userService: userService
  };
}

export const appDeps = initDependencies();
