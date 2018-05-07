import { PtUserRepository } from '~/core/contracts/repositories';
import { PtUser } from '~/core/models/domain';
import * as errorService from '~/core/services/error-handler.service';

export class UserRepository implements PtUserRepository {
  constructor(public apiEndpoint: string) {}

  private getUsersUrl() {
    return `${this.apiEndpoint}/users`;
  }

  public fetchUsers(
    errorHandler: (error: any) => void,
    successHandler: (data: PtUser[]) => void
  ): void {
    fetch(this.getUsersUrl(), {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        successHandler(data);
      })
      .catch(er => {
        errorService.handleErrors(er);
        errorHandler(er);
      });
  }
}
