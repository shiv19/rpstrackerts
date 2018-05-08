import { appStore } from '~/core/app-store';
import { PtAuthRepository } from '~/core/contracts/repositories';
import {
  PtAuthService,
  PtLoggingService,
  PtStorageService
} from '~/core/contracts/services';
import {
  PtAuthToken,
  PtLoginModel,
  PtRegisterModel,
  PtUser
} from '~/core/models/domain';
import { EMPTY_STRING } from '~/core/models/domain/constants/strings';
import { getUserAvatarUrl } from '~/core/services';

const CURRENT_USER_KEY = 'CURRENT_USER_KEY';
const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';

export class AuthService implements PtAuthService {
  constructor(
    private loggingService: PtLoggingService,
    private authRepo: PtAuthRepository,
    private storageService: PtStorageService
  ) {}

  private getToken(): PtAuthToken {
    return this.storageService.getItem<PtAuthToken>(AUTH_TOKEN_KEY);
  }

  private setToken(authToken: PtAuthToken) {
    this.storageService.setItem<PtAuthToken>(AUTH_TOKEN_KEY, authToken);
  }

  private setCurrentUser(ptUser: any) {
    ptUser.avatar = getUserAvatarUrl(this.authRepo.apiEndpoint, ptUser.id);
    this.storageService.setItem<PtUser>(CURRENT_USER_KEY, ptUser);
    appStore.set('currentUser', ptUser);
  }

  public getCurrentUser(): PtUser {
    const user = this.storageService.getItem<PtUser>(CURRENT_USER_KEY);
    if (!appStore.value.currentUser && user) {
      appStore.set('currentUser', user);
    }
    return user;
  }

  public getCurrentUserId() {
    if (appStore.value.currentUser) {
      return appStore.value.currentUser.id;
    } else {
      return undefined;
    }
  }

  public isLoggedIn(): boolean {
    const hasToken = !!this.getToken();
    const hasCurrentUser = !!this.getCurrentUser();
    return hasToken && hasCurrentUser;
  }

  public login(loginModel: PtLoginModel): Promise<PtUser> {
    return new Promise<PtUser>((resolve, reject) => {
      this.authRepo.login(
        loginModel,
        error => {
          this.loggingService.error('Login failed');
          reject(error);
        },
        (data: { authToken: PtAuthToken; user: PtUser }) => {
          this.setToken(data.authToken);
          this.setCurrentUser(data.user);
          resolve(this.getCurrentUser());
        }
      );
    });
  }

  public register(registerModel: PtRegisterModel): Promise<PtUser> {
    return new Promise<PtUser>((resolve, reject) => {
      this.authRepo.register(
        registerModel,
        error => {
          this.loggingService.error('Registration failed');
          reject(error);
        },
        (data: { authToken: PtAuthToken; user: PtUser }) => {
          this.setToken(data.authToken);
          this.setCurrentUser(data.user);
          resolve(this.getCurrentUser());
        }
      );
    });
  }

  public logout(): Promise<void> {
    this.setToken({
      access_token: EMPTY_STRING,
      dateExpires: new Date()
    });
    this.storageService.setItem(CURRENT_USER_KEY, EMPTY_STRING);
    return Promise.resolve();
  }
}
