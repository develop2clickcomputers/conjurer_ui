import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../adapters/common-http-adapter.service';

import { CommonConstant } from '../constants/common/common.constant';
import { PreviewConstant } from '../constants/preview/preview.constant';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

/**
 * Investment service class
 */
@Injectable()
export class InvestmentService {

  /**
   * Investment service class dependencies
   * @param HttpClient http
   * @param AppConfig config
   * @param CommonHttpAdapterService commonHttpAdapterService
   * @param RxJSHelper rxjsHelper
   */
  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService,
    private rxjsHelper: RxJSHelper
  ) { }

  /**
   * To get investment data
   */
  getInvestments(): Observable<any> {
    let invstData: Object = {};
    invstData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    invstData = JSON.stringify(invstData);

    return this.http.post(this.config.apiEndpoint + 'getInvestments', invstData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get investment transaction
   */
  getInvestmentTransaction(): Observable<any> {
    let invstData: Object = {};
    invstData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUser().userId;
    invstData = JSON.stringify(invstData);

    return this.http.post(this.config.apiEndpoint + 'getInvestmentTransactions', invstData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To update investemnt holding assets, txn and scx
   * @param any data
   */
  updateInvestmentsData(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'updateInvestments', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To delete holding asset transaction
   * @param string txnId
   */
  deletHoldingAssetTransaction(txnId: string) {
    let delTxnData: Object = {}
    delTxnData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    delTxnData[CommonConstant.FLOW] = 'pimoney';
    delTxnData[PreviewConstant.TRANSACTION_ID] = txnId;
    delTxnData = JSON.stringify(delTxnData);

    return this.http.post(this.config.apiEndpoint + 'deleteInvestmentTransaction', delTxnData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get header graph data
   * @param string invest_view
   */
  getInvestmentHeaderGraph(invest_view?: string): Observable<any> {
    let userData = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    if (invest_view) {
      userData['view'] = invest_view;
    } else {
      userData['view'] = 'assetCategory';
    }
    userData = JSON.stringify(userData);
    return this.http.post(this.config.apiEndpoint + 'investmentHeroGraph', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * TO get investment performance
   */
  investmentPerformanceHeader(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'investmentPerformance',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

}
