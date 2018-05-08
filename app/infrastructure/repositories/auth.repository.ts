import { PtAuthRepository } from '~/core/contracts/repositories';
import {
  PtAuthToken,
  PtLoginModel,
  PtRegisterModel,
  PtUser
} from '~/core/models/domain';
import * as errorService from '~/core/services/error-handler.service';

export const CURRENT_USER_KEY = 'CURRENT_USER_KEY';

export class AuthRepository implements PtAuthRepository {
  constructor(public apiEndpoint: string) {}

  private getLoginUrl() {
    return `${this.apiEndpoint}/auth`;
  }
  private getRegisterUrl() {
    return `${this.apiEndpoint}/register`;
  }

  public login(
    loginModel: PtLoginModel,
    errorHandler: (error: any) => void,
    successHandler: (data: { authToken: PtAuthToken; user: PtUser }) => void
  ): void {
    fetch(this.getLoginUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        loginModel: loginModel,
        grant_type: 'password'
      })
    })
      .then(response => response.json())
      .then((data: { authToken: PtAuthToken; user: PtUser }) => {
        successHandler(data);
      })
      .catch(er => {
        errorService.handleErrors(er);
        errorHandler(er);
      });
  }

  public register(
    registerModel: PtRegisterModel,
    errorHandler: (error: any) => void,
    successHandler: (data: { authToken: PtAuthToken; user: PtUser }) => void
  ): void {
    fetch(this.getRegisterUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        registerModel: registerModel
      })
    })
      .then(response => response.json())
      .then((data: { authToken: PtAuthToken; user: PtUser }) => {
        successHandler(data);
      })
      .catch(er => {
        errorService.handleErrors(er);
        errorHandler(er);
      });
  }
}
