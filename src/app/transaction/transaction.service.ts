import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../adapters/common-http-adapter.service';

import { CommonConstant } from '../constants/common/common.constant';
import { TransactionConstant } from '../constants/transaction/transaction.constant';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

/**
 * Transaction service class
 */
@Injectable()
export class TransactionService {

  /**
   * Transaction service dependency injection
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
   * To get all transactions
   * @param string tagType
   */
  getAllTransactions(tagType?: string): Observable<any> {
    let userData = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    if (tagType) {
      userData[CommonConstant.TAG] = tagType;
    } else {
      userData[CommonConstant.TAG] = 'ALL';
    }
    userData = JSON.stringify(userData);
    return this.http.post(this.config.apiEndpoint + 'getTransactions', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To add transaction
   * @param any txndata
   * */
  addTransaction(txndata: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'addTransaction', txndata, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To delete transaction
   * @param any txndata
   */
  deleteTransaction(txndata: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'deleteTransaction',
      txndata, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To split transactions
   * @param any txndata
   */
  splitTransaction(txndata: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'splitTransaction',
      txndata, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To edit transactions
   * @param any txndata
   */
  editTransaction(txndata: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'editTransaction',
      txndata, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }


  /**
   * To get transaction category graph data
   */
  getExpensesCategoryGraphData(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'expensesCategoryGraph',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To top 3 transactions for current month
   * */
  getTopTransaction(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'toptransaction',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get transaction category graph data
   * @param string trans_id
   * @param string tag
   */
  getTransactionCategoryGraphData(trans_id: string, tag: string): Observable<any> {
    let userData = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData[TransactionConstant.TRANSACTION_ID] = trans_id;
    userData[CommonConstant.TAG] = tag;
    userData = JSON.stringify(userData);

    return this.http.post(this.config.apiEndpoint + 'transactionCategoryGraph',
      userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get all transaction institutions
   */
  getInstituions(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'transactionInstitutions',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get all transaction account types
   */
  getAccountTypes(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'transactionAccountTypes',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get all transaction getConfiguration
   */
  getTransactionType(): Observable<any> {
    let data = {};
    data[CommonConstant.TYPE] = 'TXN_TYPE';
    data[CommonConstant.KEY] = '';
    data = JSON.stringify(data);

    return this.http.post(this.config.apiEndpoint + 'getConfiguration',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get all reflected transactions
   */
  getReflectedTransaction(txn_id): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'fetchReflectedTrnsaction',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }
}
