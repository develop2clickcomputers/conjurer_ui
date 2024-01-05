import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../adapters/common-http-adapter.service';

import { CommonConstant } from '../constants/common/common.constant';
import { AccountHelper } from '../helpers/account/account.helper';

import { statementPreviewData, currencyList } from './preview.interface';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

/**
 * Preview service class
 */
@Injectable()
export class PreviewService {

  /** @ignore */
  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService,
    private accountHelper: AccountHelper,
    private rxjsHelper: RxJSHelper
  ) { }

  /**
   * To get preview details
   */
  getStatementData(): Observable<any> {
    let userData: Object = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData[CommonConstant.FLOW] = 'pimoney';
    const statementData = this.accountHelper.getUploadStatementData();
    if (statementData && statementData[CommonConstant.FILE_REPO_ID]) {
      userData[CommonConstant.FILE_REPO_ID] = statementData[CommonConstant.FILE_REPO_ID];
    }
    userData = JSON.stringify(userData);

    return this.http.post(this.config.apiEndpoint + 'statementPreviewDetails', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**To get dummy statement data */
  getDummyStatementData() {
    return statementPreviewData;
  }

  /**
   * To edit holding assets
   * @param any data
   */
  editInvestmentHoldingAssetInfo(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'editInvestmentHoldingAssetInfo', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To edit investment transaction
   * @param any data
   */
  editInvestmentTransaction(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'editInvestmentTransaction', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To save updated investment security master
   * @param any data
   */
  editInvestmentSecurityMaster(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'editInvestmentScx', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To confirm statement uploaded data
   * @param any data
   */
  confirmAccountStatementData(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'confirmAction', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**To reject statement uploaded data */
  rejectAccountStatementData(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'rejectAction', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To update investemnt holding assets, txn and scx
   * @param data
   */
  updateInvestmentsData(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'updateAccounts', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**To get transaction code(transCode) */
  getTransCode(): Observable<any> {
    let transData: Object = {};
    transData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    transData = JSON.stringify(transData);
    return this.http.post(this.config.apiEndpoint + 'fetchTransactionCode', transData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**To get curreny list */
  getCurrenyList(): Observable<any> {
    let currData: Object = {};
    currData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    currData = JSON.stringify(currData);
    return this.http.post(this.config.apiEndpoint + 'currencyList', currData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

}
