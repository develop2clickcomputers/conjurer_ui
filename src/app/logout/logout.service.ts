import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../adapters/common-http-adapter.service';

import { AuthenticationService } from '../services/authentication.service';
import { CommonConstant } from '../constants/common/common.constant';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

/**
 * Logout service class
 */
@Injectable()
export class LogoutService {

  /** @ignore */
  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService,
    private authenticationService: AuthenticationService,
    private rxjsHelper: RxJSHelper
  ) { }

  /**
   * Real logout function
   * @param data
   */
  logout(userId): Observable<any> {
    let userData: any = {}
    userData[CommonConstant.USER_ID] = userId;
    userData[CommonConstant.PLATFORM] = CommonConstant.PLATFORM_NAME;
    userData = JSON.stringify(userData);

    return this.http.post(this.config.apiAuthEndPoint + 'secure/logout', userData, this.commonHttpAdapterService.SSOJwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /* logout() {
    this.authenticationService.logout();
  } */

}
