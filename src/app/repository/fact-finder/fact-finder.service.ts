import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { Response } from '@angular/http';

import { K2_APP_CONFIG, AppConfig } from '../../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';

import { CommonConstant } from '../../constants/common/common.constant';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

/**
 * Fact Finder Service class
 */
@Injectable()
export class FactFinderService {

  /**
   * Dependencies
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
   * To get fact finder histories
   */
  getFactFindersHistory(): Observable<any[]> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData[CommonConstant.PLAIN_ID] = this.commonHttpAdapterService.getCurrentUserId();

    userData = JSON.stringify(userData);

    return this.http.post(this.config.everestApiUrl + 'getFactFinderRequestByClientId', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To generate fact finder
   * @param any data
   */
  generateFactFinder(data: any): Observable<any[]> {

    return this.http.post(this.config.apiEndpoint + 'generateFactFinder', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To download fact finder statement
   * @param any data
   */
  downloadFactFinderStatement(data: any): Observable<any[]> {

    return this.http.post(this.config.everestApiUrl + 'getFactFinderFileByClientId', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To delete statement repositiry details
   * @param any data
   */
  deleteFactFinderStatement(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'deleteFactFinderById', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get resources
   * @param any url
   */
  getHtmlFile(url: any): Observable<any> {
    return this.http.get(url).pipe(
      map(this.extractData)
      , catchError(this.handleError)
    )
  }

  /**
   * To handle common success response for all api's
   * @param res
   */
  public extractData(res) {
    return res || '';
  }

  /**
   * To handle common error response for all api's
   * @param Response error
   */
  public handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    // console.error(errMsg);
    return Promise.reject(errMsg);
  }

  /**
   * To update fact finder form
   * @param any data
   */
  updateFactFinderFormData(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'editHtmlFile', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To send otp to approve fact finder
   * @param data
   */
  sendOtpForApproval(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'sendOtpForApproval', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To veryfy and approve fact finder
   * @param data
   */
  verifAndApprove(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'enterOtpForApproval', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

}
