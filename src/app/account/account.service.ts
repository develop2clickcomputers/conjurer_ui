import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../adapters/common-http-adapter.service';

import { CommonConstant } from '../constants/common/common.constant';
import { CarrierConstant } from '../constants/carrier/carrier.constant';
import { ClientConstant } from '../constants/client/client.constant';
import { CarrierHelper } from '../helpers/carrier/carrier.helper';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

/**
 * Account service class
 */
@Injectable()
export class AccountService {

  /**
   * Account service dependencies
   * @param HttpClient http
   * @param AppConfig config
   * @param CommonHttpAdapterService commonHttpAdapterService
   * @param CarrierHelper carrierHelper
   * @param RxJSHelper rxjsHelper
   */
  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService,
    private carrierHelper: CarrierHelper,
    private rxjsHelper: RxJSHelper
  ) { }

  /**
   * To get statement country list
  */
  getDashboardData(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'dashboardDetails',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get statement country list
   */
  getManageAccountDetails(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'getManageAccountsDetails',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get statement country list
   */
  getBudgetData(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'getBudgetData',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get online institution
   */
  getInstitutions(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'getInstitutions',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get prompts
   * @param any data
   */
  getPrompts(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'getPrompt', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To add online account
   * @param any data
   */
  addAccount(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'addAccount', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To check refresh details
   * @param any data
   */
  checkRefreshDetail(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'getRefreshDetail',
      data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To check mfa
   * @param any data
   */
  checkMFA(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'checkMFA',
      data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To process MFA
   * @param any data
   */
  processMFA(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'processMFA',
      data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To update online account
   * @param any data
   */
  updateAccountCredential(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'updateCredential', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }


  /**
   * To refresh online account
   * @param any data
   */
  refreshAccount(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'refreshAccount', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To delete online account
   * @param any data
   */
  deleteOnlineAccount(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'deleteOnlineAccount', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }


  /**
   * To get statement country list
   */
  getStatementCountryList(): Observable<any> {
    let countryData: any = {};
    countryData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    countryData = JSON.stringify(countryData);
    return this.http.post(this.config.apiEndpoint + 'pdfCountryList', countryData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get statement institution list
   * @param string country_code
   */
  getStatementInstitutions(country_code: string): Observable<any> {
    let instData: any = {};
    instData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    instData[CommonConstant.CODE] = country_code;
    instData = JSON.stringify(instData);

    return this.http.post(this.config.apiEndpoint + 'pdfInstitutions', instData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To check statement file encription
   * @param any stmtFile
   */
  checkFileEncryption(stmtFile: any): Observable<any> {

    let checkEncriptionData: any = {};
    checkEncriptionData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    checkEncriptionData['docByte'] = stmtFile;
    checkEncriptionData = JSON.stringify(checkEncriptionData);

    return this.http.post(this.config.apiEndpoint + 'checkFileEncryption', checkEncriptionData,
      this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To upload statement
   * @param any data
   */
  parseStatement(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'statementParsing', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To delete statement
   * @param any data
   */
  deleteManualAccount(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'deleteManualAccount', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To delete statement
   */
  deleteGroupStatements(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'deleteGroupStatements', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get curreny list
   */
  getCurrenyList(): Observable<any> {
    let currData: Object = {};
    currData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    currData = JSON.stringify(currData);
    return this.http.post(this.config.apiEndpoint + 'currencyList', currData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To add property
   * @param any data
   */
  addProperty(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'addProperty', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To edit property
   * @param any data
   */
  editProperty(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'editProperty', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To delete property
   * @param any data
   */
  deleteProperty(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'deleteProperty', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To change preferred currency
   * @param any data
   */
  changePreferredCurrency(preferredCurrency: any): Observable<any> {
    let userData = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData[CommonConstant.PREFERRED_CURRENCY] = preferredCurrency;
    userData = JSON.stringify(userData);

    return this.http.post(this.config.apiEndpoint + 'changePreferredCurrency', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }


  /**
   * Everest API integration for insurance
   */

  /**
   * To get policy from everest platform
   */
  getPolicies() {
    let reqData: any = {};
    reqData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    reqData = JSON.stringify(reqData);
    console.log("getPolicies:reqData:"+reqData);
    return this.http.post(this.config.everestApiUrl + 'getPolicyByUserId', reqData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get dropdown list
   * @param string dropdownType
   */
  getDropdownList(dropdownType: string): Observable<any> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData[CommonConstant.DROPDOWN_TYPE] = dropdownType;
    userData = JSON.stringify(userData);

    return this.http.post(this.config.everestApiUrl + 'getDropdownList', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get all currencies
   */
  getCurrencies(): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'getCurrencyList',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get all advisors
   */
  getAdvisors(): Observable<any> {

    return this.http.post(this.config.everestApiUrl + 'getAdvisors',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get all advisors
   * @param any data
   */
  getAdvisorById(data: any): Observable<any> {

    return this.http.post(this.config.everestApiUrl + 'getAdvisorById', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To update client(map advisor to client)
   * @param any data
   */
  updateClientAdvisor(data: any): Observable<any> {
    return this.http.post(this.config.everestApiUrl + 'updateClientAdvisor', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get advisors by user id
   */
  getAdvisorByUserId(): Observable<any> {

    return this.http.post(this.config.everestApiUrl + 'getAdvisorByUserId',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To add policy/insurance
   */
  submitInsurance(data: any) {
    return this.http.post(this.config.apiEndpoint + 'addInsurance', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get policies information by policy id
   * @param string carrierId
   * @param string policyId
   */
  getRider(carrierId: string, policyId: string): Observable<any[]> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData[CarrierConstant.CARRIER_ID] = carrierId;
    userData[CarrierConstant.POLICY_PLAN_ID] = policyId;
    userData = JSON.stringify(userData);

    return this.http.post(this.config.apiEndpoint + 'getRider', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get all carriers
   */
  getCarriers(): Observable<any[]> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData = JSON.stringify(userData);
    return this.http.post(this.config.apiEndpoint + 'getCarrier', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get policies information
   * @param string carrierId
   */
  getPolicyInformation(carrierId?: string): Observable<any[]> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    if (carrierId) {
      userData[CarrierConstant.CARRIER_ID] = carrierId;
    }
    userData = JSON.stringify(userData);

    return this.http.post(this.config.apiEndpoint + 'getPolicyPlan', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get the client details
   * @param string type
   * @param string clientId
   */
  getClients(type?: string, clientId?: string): Observable<any[]> {
    let userData: any = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    if (type) {
      type = type.toUpperCase();
      userData[CommonConstant.TYPE] = type;
    } else {
      userData[CommonConstant.TYPE] = 'ALL';
    }

    if (clientId) {
      userData[ClientConstant.CLIENT_ID] = clientId;
    }
    userData = JSON.stringify(userData);

    return this.http.post(this.config.everestApiUrl + 'getClient',
      userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To submit contact information
   * @param any data
   */
  submitContactInformation(data: any): Observable<any[]> {
    return this.http.post(this.config.apiEndpoint + 'addCarrier', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To submit policy information
   * @param any data
   */
  submitNewPlanInfo(data: any): Observable<any[]> {
    return this.http.post(this.config.apiEndpoint + 'addPolicyPlan', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To copy and create new carrier rider
   * @param any data
   */
  submitNewRider(data: any): Observable<any[]> {
    return this.http.post(this.config.apiEndpoint + 'addRider', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get policy details
   */
  getInsurance() {
    let reqData: any = {};
    reqData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    reqData = JSON.stringify(reqData);

    return this.http.post(this.config.apiEndpoint + 'getInsurance', reqData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To upload multiple pdf statement
   */
  multipleStatementParsing(): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'multipleStatementParsing',
      this.commonHttpAdapterService.getUserIdResponseStructure(), this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To store statement
   * @param any data
   */
  storeStatement(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'storeStatement', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

}
