import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';

import { CommonConstant } from '../../constants/common/common.constant';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

@Injectable()
export class CommonService {

  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService,
    private rxjsHelper: RxJSHelper
  ) { }

  /**To get curreny list */
  getCurrenyList(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'currencyList',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**To get merchant list */
  getmerchantList(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'getMerchants',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**To get category and it's corresponding subcategory */
  getCategorySubcategoryList(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'getCategories',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**To get user preferred currency */
  getUserPreferredCurrency(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'getUserPreferredCurrency',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To update assets, txn and scx etc
   * @param data
   */
  updateAccounts(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'updateAccounts', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To update password
   * @param data
   */
  updateCredentials(data: any): Observable<any> {
    return this.http.post(this.config.apiAuthEndPoint + 'secure/editCredential', data, this.commonHttpAdapterService.SSOJwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * Forgot password
   * @param data
   */
  forgotPassword(data: any): Observable<any> {
    return this.http.post(this.config.apiAuthEndPoint + 'auth/forgotpassword', data, this.commonHttpAdapterService.headerOptions())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * Forgot password
   * @param data
   */
  resetPassword(data: any): Observable<any> {
    return this.http.post(this.config.apiAuthEndPoint + 'auth/updatepassword', data, this.commonHttpAdapterService.headerOptions())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**To delete data */
  delete(apiName, data): Observable<any> {
    return this.http.post(this.config.apiEndpoint + apiName, data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }


}
