import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';

import { CommonConstant } from '../../constants/common/common.constant';
import { statmentRepositoryData } from './statement-repository.interface';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

/**
 * Statement repository component class
 */
@Injectable()
export class StatementRepositoryService {

  /** @ignore */
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
    // repositoryData[CommonConstant.FLOW] = 'pimoney';
    repositoryData = JSON.stringify(repositoryData);
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.config.apiEndpoint + 'statementDetails', repositoryData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /** To get dummy data */
  getDummyStatmentRepositoryDetails() {
    return statmentRepositoryData;
  }

  /**
   * To delete statement repositiry details
   * @param any data
   */
  deletePdfStatement(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'deleteRepository', data, this.commonHttpAdapterService.jwt())
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
   * To download xml data
   * @param any data
   */
  downloadXmlFile(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'downloadXMLFile', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

}
