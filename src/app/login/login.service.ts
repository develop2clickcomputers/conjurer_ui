import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../adapters/common-http-adapter.service';

import { CommonConstant } from '../constants/common/common.constant';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

/**
 * Login service class
 */
@Injectable()
export class LoginService {

  /** @ignore */
  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService,
    private rxjsHelper: RxJSHelper
  ) { }

  /**
   * To login
   * @param string username
   * @param string password
   */
  login(username: string, password: string): Observable<any> {

    let userData: any = {};
    userData[CommonConstant.USERNAME] = username;
    userData[CommonConstant.PASSWORD] = password;
    userData[CommonConstant.PLATFORM] = CommonConstant.PLATFORM_NAME;

    userData = JSON.stringify(userData);

    return this.http.post(this.config.apiAuthEndPoint + 'auth/login', userData, this.commonHttpAdapterService.headerOptions())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));

  }

  /**
   * To check backend api
   */
  checkBackendAPI(): Observable<any[]> {
    return this.http.get(this.config.apiEndpoint + 'users')
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

}
