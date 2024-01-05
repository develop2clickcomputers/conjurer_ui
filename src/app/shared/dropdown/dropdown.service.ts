import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';

/**
 * Dropdown service class
 */
@Injectable()
export class DropdownService {

  /** @ignore */
  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService,
  ) { }

  /**
   * To add multiple dropdowns
   * @param data
   */
  submitDropdownData(data): Observable<any[]> {
    return this.http.post(this.config.apiEndpoint + 'addDropdowns', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)));
  }

  /**
   * To get contact information
   * @param data
   */
  addDropdownData(data): Observable<any[]> {
    return this.http.post(this.config.apiEndpoint + 'addDropdown', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)));
  }

  /**
   * To update dropdown list
   * @param data
   */
  updateDropdownData(data): Observable<any[]> {
    return this.http.post(this.config.apiEndpoint + 'updateDropdownList', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)));
  }

  /**
   * To delete dropdown list
   * @param data
   */
  deleteDropdownData(data): Observable<any[]> {
    return this.http.post(this.config.apiEndpoint + 'deleteDropdownList', data, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)));
  }

}
