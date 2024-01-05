import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../adapters/common-http-adapter.service';

import { CommonConstant } from '../constants/common/common.constant';
import { LoginConstant } from '../constants/login/login.constant';

@Injectable()
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService
  ) { }

  /* login(username: string, password: string) {
    let userData: any = {};
    userData[CommonConstant.USERNAME] = username;
    userData[CommonConstant.PASSWORD] = password;

    userData = JSON.stringify(userData);

    return this.http.post(this.config.apiEndpoint + 'login', userData, this.commonHttpAdapterService.headerOptions())
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        const user = response.json();
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        return user;
      }).catch((error: any) => {
          if (error.status === 500) {
              return Observable.throw(new Error(error.status));
          }
      });
  } */

  logout() {
    // remove user from local storage to log user out
    // localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }

  /**To get session data */
  getSessionData() {
    let currentUser = sessionStorage.getItem('currentUser');

    if (currentUser) {
      currentUser = JSON.parse(currentUser);
      return currentUser;
    }

    return {};
  }

  /**
   * To set credential to sessionStorage
   * @param loginData
   */
  setSessionData(loginData) {

    if (Object.keys(loginData).length > 0) {
      let authData: any = {};
      authData[CommonConstant.USERNAME] = loginData.username;
      authData[CommonConstant.USER_ID] = loginData.userId;
      authData[CommonConstant.AUTH_TOKEN] = loginData.token;

      authData = JSON.stringify(authData);

      sessionStorage.setItem('currentUser', authData);

      let currentUser = sessionStorage.getItem('currentUser');
      currentUser = JSON.parse(currentUser);
    }
  }

}
