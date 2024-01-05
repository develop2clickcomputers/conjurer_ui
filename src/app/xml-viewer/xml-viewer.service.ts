import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

import { K2_APP_CONFIG, AppConfig } from '../app-config';
import { K2_APP_HTTP_ADAPTER, CommonHttpAdapterService } from '../adapters/common-http-adapter.service';

import { CommonHelperService } from '../helpers/common/common.helper';
import { CommonConstant } from '../constants/common/common.constant';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

/** XML viewer service class */
@Injectable()
export class XMLViewerService {

  /** @ignore */
  constructor(
    private http: HttpClient,
    @Inject(K2_APP_CONFIG) private config: AppConfig,
    @Inject(K2_APP_HTTP_ADAPTER) private commonHttpAdapterService: CommonHttpAdapterService,
    private commonHelperService: CommonHelperService,
    private rxjsHelper: RxJSHelper
  ) { }

  /**
   * To get fileName
   */
  getFileName() {
    const xmlData = this.commonHelperService.getXMLFileViewData();
    if (typeof xmlData === 'object' && Object.keys(xmlData).length > 0) {
      return xmlData[CommonConstant.NAME];
    }
  }

  /**
   * To get fileRepoId
   */
  getFileRepoId() {
    const xmlData = this.commonHelperService.getXMLFileViewData();
    if (typeof xmlData === 'object' && Object.keys(xmlData).length > 0) {
      return xmlData[CommonConstant.REPO_ID];
    }
  }

  /**
   * To get xml data
   */
  getXmlFile(): Observable<any> {

    let downloadXmlData: any = {};
    const xmlData = this.commonHelperService.getXMLFileViewData();
    if (typeof xmlData === 'object' && Object.keys(xmlData).length > 0) {
      downloadXmlData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
      downloadXmlData[CommonConstant.FLOW] = 'gx';
      downloadXmlData[CommonConstant.REPO_ID] = xmlData[CommonConstant.REPO_ID];
      downloadXmlData[CommonConstant.NAME] = xmlData[CommonConstant.NAME];
      // downloadXmlData[CommonConstant.TAG] = CommonConstant.TAG;
      downloadXmlData = JSON.stringify(downloadXmlData);

      return this.http.post(this.config.apiEndpoint + 'getXMLFileContent', downloadXmlData, this.commonHttpAdapterService.jwt())
        .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
          catchError(error => this.commonHttpAdapterService.handleError(error)),
          takeUntil(this.rxjsHelper.unSubscribeServices));
    }
  }

  /**
   * To save updated xml file
   * @param any xml
   */
  saveXMLFile(xml: any): Observable<any> {
    let updatedXMLData: any = {};
    updatedXMLData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    updatedXMLData[CommonConstant.REPO_ID] = this.getFileRepoId();
    updatedXMLData[CommonConstant.FILE_NAME] = this.getFileName();
    updatedXMLData[CommonConstant.XML] = xml;
    updatedXMLData = JSON.stringify(updatedXMLData);
    return this.http.post(this.config.apiEndpoint + 'updateXMLFile', updatedXMLData, this.commonHttpAdapterService.jwt())
      .pipe(map(res => this.commonHttpAdapterService.extractData(res)),
        catchError(error => this.commonHttpAdapterService.handleError(error)),
        takeUntil(this.rxjsHelper.unSubscribeServices));
  }

}
