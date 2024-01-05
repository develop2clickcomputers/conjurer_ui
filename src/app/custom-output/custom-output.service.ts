import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../adapters/common-http-adapter.service';

import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

/**
 * Custom output header service class
 */
@Injectable()
export class CustomOutputService {

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

  /**
   * To get custom header group list
   * @param any data
   */
  getCustomHeaderList(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'getCustomHeaderList', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get custom header fields
   * @param any data
   */
  getCustomFields(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'getCustomFields', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get pimoney header fields
   * @param any data
   */
  getPimoneyFields(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'getPimoneyFields', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get custom headers
   * @param any data
   */
  addCustomHeaders(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'addCustomeHeaders', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To delete custom fields
   * @param any data
   */
  deleteCustomeHeaders(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'deleteCustomeHeaders', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

}
