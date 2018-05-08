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
import { LoggingService, StorageService, UserService } from '~/core/services';
import { AuthService } from '~/core/services/auth';
import {
  BacklogService,
  CommentService,
  TaskService
} from '~/core/services/backlog';
import {
  AuthRepository,
  BacklogRepository,
  LoggingRepository,
  StorageRepository,
  UserRepository
} from '~/infrastructure/repositories';

const config = <AppConfig>appConfig;

// Init Repositories
const loggingRepo: PtLoggingRepository = new LoggingRepository(
  config.loggingEnabled,
  config.loggingLevel
);
const backlogRepo: PtBacklogRepository = new BacklogRepository(
  config.apiEndpoint
);
const authRepo: PtAuthRepository = new AuthRepository(config.apiEndpoint);
const storageRepo: PtStorageRepository = new StorageRepository();
const userRepo: PtUserRepository = new UserRepository(config.apiEndpoint);

// Init Services
const loggingService: PtLoggingService = new LoggingService(loggingRepo);
const storageService: PtStorageService = new StorageService(storageRepo);
const authService: PtAuthService = new AuthService(
  loggingService,
  authRepo,
  storageService
);
const backlogService: PtBacklogService = new BacklogService(
  loggingService,
  backlogRepo
);
const commentService: PtCommentService = new CommentService(
  loggingService,
  backlogRepo
);
const taskService: PtTaskService = new TaskService(loggingService, backlogRepo);
const userService: PtUserService = new UserService(loggingService, userRepo);

// Service providers
export function getAuthService(): PtAuthService {
  return authService;
}

export function getBacklogService(): PtBacklogService {
  return backlogService;
}

export function getCommentService(): PtCommentService {
  return commentService;
}

export function getLoggingService(): PtLoggingService {
  return loggingService;
}

export function getStorageService(): PtStorageService {
  return storageService;
}

export function getTaskService(): PtTaskService {
  return taskService;
}

export function getUserService(): PtUserService {
  return userService;
}

export function getApiEndpoint() {
  return config.apiEndpoint;
}
