import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../adapters/common-http-adapter.service';

import { CommonConstant } from '../constants/common/common.constant';
import { TransactionConstant } from '../constants/transaction/transaction.constant';
import { BudgetConstant } from '../constants/budget/budget.constant';

import { budgetData, budgetAllocationGraphData } from './budget';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

/**
 * Budget service class
 */
@Injectable()
export class BudgetService {

  /**
   * Budget service class dependencies
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

  /** To get dummy budget data */
  getDummyBudgetData1() {
    return budgetData;
  }

  /**
   * To get all budgets
   * @param any budgetMonth
   * @param any budgetYear
   */
  getBudgets(budgetMonth?: any, budgetYear?: any): Observable<any> {
    const date = new Date();
    let month: any = date.getMonth();
    month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    let userData = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    if (budgetMonth && budgetYear) {
      userData[BudgetConstant.BUDGET_MONTH] = budgetMonth;
      userData[BudgetConstant.BUDGET_YEAR] = budgetYear;
    } else {
      userData[BudgetConstant.BUDGET_MONTH] = month;
      userData[BudgetConstant.BUDGET_YEAR] = year;
    }
    userData = JSON.stringify(userData);

    return this.http.post(this.config.apiEndpoint + 'getBudget', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get budget allocation graph data
   * @param any budgetMonth
   * @param any budgetYear
   */
  getBudgetAllocation(budgetMonth?: any, budgetYear?: any): Observable<any> {
    const date = new Date();
    let month: any = date.getMonth();
    month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    let userData = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    if (budgetMonth && budgetYear) {
      userData[BudgetConstant.BUDGET_MONTH] = budgetMonth;
      userData[BudgetConstant.BUDGET_YEAR] = budgetYear;
    } else {
      userData[BudgetConstant.BUDGET_MONTH] = month;
      userData[BudgetConstant.BUDGET_YEAR] = year;
    }
    userData = JSON.stringify(userData);

    return this.http.post(this.config.apiEndpoint + 'budgetAllocationGraph', userData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get budget vs spent graph data
   * @param any data
   */
  getSpentVsBudgetGraphData(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'spentvsbudgetGraph', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get budget category graph data
   * @param any data
   */
  budgetCategoryGraph(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'categoryWiseSpendingChart', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get dummy budget allocation graph data
   */
  getDummyBudgetAllocation() {
    return budgetAllocationGraphData;
  }

  /**
   * To add new budget
   * @param any data
   */
  addBudget(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'addBudget', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To edit budget
   * @param any data
   */
  editBudget(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'editBudget', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To delete budget
   * @param any data
   */
  deleteBudget(data: any): Observable<any> {
    return this.http.post(this.config.apiEndpoint + 'deleteBudget', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

  /**
   * To get budget year range
   */
  getYearRange() {
    const date = new Date();
    let month: any = date.getMonth();
    month = ('0' + (date.getMonth() + 1)).slice(-2);
    let currYear = date.getFullYear();
    const yearList: any[] = [];
    for (let i = 0; i < 5; i++) {
      yearList.push(currYear);
      currYear = currYear + 1;
    }
    return yearList;
  }

}
