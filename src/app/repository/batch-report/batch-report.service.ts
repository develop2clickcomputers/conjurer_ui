import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';

import { CommonConstant } from '../../constants/common/common.constant';
import { statmentRepositoryData } from './batch-report.interface';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

/**
 * Batch report service class
 */
@Injectable()
export class BatchReportService {

  /**
   * Class dependencies
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

  /**To get statement repository details */
  getStatementRepositoryDetails(): Observable<any> {
    let repositoryData: Object = {};
    repositoryData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    repositoryData = JSON.stringify(repositoryData);
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.config.apiEndpoint + 'getBatchFileDetail', repositoryData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /** To get dummy batch report data */
  getDummyStatmentRepositoryDetails() {
    return statmentRepositoryData;
  }

  /**
   * To delete statement repository details
   * @param any data
   */
  deletePdfStatement(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'deleteRepository', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To delete batch file
   * @param any data
   */
  deleteBatchFileDetail(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'deleteBatchFileDetail', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To download pdf files
   * @param any data
   */
  downloadPdfStatement(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'downloadPdfStatement', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To download batch report file
   * @param any data
   */
  downloadBatchReportFile(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'getFile', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get batch report file details
   * @param data
   */
  getFileDetails(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'getFileDetail', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

}
