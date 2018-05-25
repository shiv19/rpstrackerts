import { appStore } from '~/core/app-store';
import { PtUserRepository } from '~/core/contracts/repositories';
import { PtLoggingService, PtUserService } from '~/core/contracts/services';
import { PtUser } from '~/core/models/domain';

export class UserService implements PtUserService {
  constructor(
    private loggingService: PtLoggingService,
    private userRepo: PtUserRepository
  ) {}

  public getLocalUsers() {
    return appStore.value.users;
  }

  public fetchUsers(refresh?: boolean): Promise<PtUser[]> {
    const localUsers = this.getLocalUsers();

    if (localUsers.length === 0 || refresh) {
      return new Promise<PtUser[]>((resolve, reject) => {
        this.userRepo.fetchUsers(
          error => {
            this.loggingService.error('Fetching users failed');
            reject(error);
          },
          (users: PtUser[]) => {
            users.forEach(u => {
              u.avatar = `${this.userRepo.apiEndpoint}/photo/${u.id}`;
            });
            resolve(users);
          }
        );
      });
    } else {
      return Promise.resolve(localUsers);
    }
  }
}
