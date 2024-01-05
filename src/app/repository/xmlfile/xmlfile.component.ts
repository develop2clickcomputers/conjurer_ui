import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../../shared/common/modal.config';

import { CommonConstant } from '../../constants/common/common.constant';

import { AccountHelper } from '../../helpers/account/account.helper';
import { XmlfileService } from './xmlfile.service';
import { CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';
import { CommonHelperService } from '../../helpers/common/common.helper';

/**
 * XML file component class
 */
@Component({
  selector: 'app-xmlfile',
  templateUrl: './xmlfile.component.html',
  styleUrls: ['./xmlfile.component.css'],
  providers: [
    XmlfileService, CommonHttpAdapterService, CommonHelperService,
    RxJSHelper
  ]
})
export class XmlfileComponent implements OnInit, OnDestroy {

  /** Delete statement modal reference */
  @ViewChild('deleteStatementModal', {static: false}) deleteStatementModal: TemplateRef<any>;

  /** View XML file modal reference */
  @ViewChild('viewXMLFileModal', {static: false}) viewXMLFileModal: TemplateRef<any>;

  public xmlFilesData: any = [];
  public xmlFilesDataByDate: Array<any> = [];
  public xmlFileDataByInstitution: Array<any> = [];
  public xmlFileList: any = [];
  private xmlObj: any = {};
  public xmlFileRepoId: any;
  public deleteStatementModalRef: BsModalRef;
  public viewXMLFileModalRef: BsModalRef;

  delStatementDataLoading = false;
  statementRepoError = false;
  statementRepoPageLoad = false;

  /** add more list here not to show view icon */
  public xmlViewIgnoreList: string[] = [
    'xlsx', 'csv', 'json', 'xls', 'xlx'
  ];

  /**
   * XML file component class dependencies
   * @param Title titleService
   * @param XMLFileService XMLFileService
   * @param CommonHttpAdapterService commonHttpAdapterService
   * @param AccountHelper accountHelper
   * @param Router router
   * @param BsModalService modalService
   * @param ModalConfig modalConfig
   * @param CommonHelperService commonHelperService
   * @param RxJSHelper rxjsHelper
   */
  constructor(
    private titleService: Title,
    private XMLFileService: XmlfileService,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private accountHelper: AccountHelper,
    private router: Router,
    private modalService: BsModalService,
    private modalConfig: ModalConfig,
    private commonHelperService: CommonHelperService,
    private rxjsHelper: RxJSHelper
  ) {
    this.titleService.setTitle('Conjurer | XML Repo');
  }

  /** @ignore */
  ngOnInit() {
    this.getXMLFilesData();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();

    this.closeModals();
  }

  /** To close all the modals */
  closeModals() {
    this.closeViewXMLFileModal();
    this.cancelDeleteStatementModal();
  }

  /**To get statement repository details */
  getXMLFilesData() {
    this.XMLFileService.getXMLFiles().subscribe(
      res => {
        this.statementRepoPageLoad = true;
        this.xmlFilesData = res.statementDetails;
        this.arrangeStatementRepoData();
      },
      error => {
        console.log(error);
        this.statementRepoError = true;
      }
    )
  }

  /**
   * To show view icon only for xml files
   * @param string xml
   */
  filterToView(xml: string) {
    const fileExtension = xml.split('.').pop();
    if (this.xmlViewIgnoreList.includes(fileExtension)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * To check statement date
   * @param any obj
   * @param any[] list
   */
  checkStatementDateValue(obj: any, list: any[]) {
    let i: number;
    for (i = 0; i < list.length; i++) {
      if (list[i].statementDate === obj.statementDate) {
        return i;
      }
    }
    return null;
  }

  /**
   * To check statement date
   * @param any obj
   * @param any[] list
   */
  checkInstitutionValue(obj: any, list: any[]) {
    let i: number;
    for (i = 0; i < list.length; i++) {
      if (list[i].institutionName === obj.institutionName) {
        return i;
      }
    }
    return null;
  }

  /** To arrange data by statement date and institution */
  arrangeStatementRepoData() {
    if (this.xmlFilesData) {
      let xmlFilesDataByDateObject: Object = {}
      const xmlFilesDataByDateArray: Array<any> = [];

      let xmlFilesDataByInstitutionObject: Object = {}
      const xmlFilesDataByInstitutionArray: Array<any> = [];

      this.xmlFilesData.forEach((element, key) => {
        xmlFilesDataByDateObject = {}
        const index = this.checkStatementDateValue(element, xmlFilesDataByDateArray);
        if (index === 0 || index > 0) {
          xmlFilesDataByDateArray[index].statementDetails.push(element);
        } else {
          xmlFilesDataByDateObject['statementDate'] = element.statementDate;
          xmlFilesDataByDateObject['statementDetails'] = [];
          xmlFilesDataByDateObject['statementDetails'].push(element);
        }
        if (Object.keys(xmlFilesDataByDateObject).length > 0) {
          xmlFilesDataByDateArray.push(xmlFilesDataByDateObject);
        }

        // arrange data by institution name
        xmlFilesDataByInstitutionObject = {}
        const instIndex = this.checkInstitutionValue(element, xmlFilesDataByInstitutionArray);
        if (instIndex === 0 || instIndex > 0) {
          xmlFilesDataByInstitutionArray[instIndex].statementDetails.push(element);
        } else {
          xmlFilesDataByInstitutionObject['institutionName'] = element.institutionName;
          xmlFilesDataByInstitutionObject['statementDetails'] = [];
          xmlFilesDataByInstitutionObject['statementDetails'].push(element);
        }
        if (Object.keys(xmlFilesDataByInstitutionObject).length > 0) {
          xmlFilesDataByInstitutionArray.push(xmlFilesDataByInstitutionObject);
        }

      });

      this.xmlFilesDataByDate = xmlFilesDataByDateArray;
      this.xmlFileDataByInstitution = xmlFilesDataByInstitutionArray;
    }
  }


  /**
   * To prepare delete statement
   * @param any statement
   */
  prepareStatementDelete(statement: any) {
    if (statement) {
      this.xmlObj = statement;
      this.openDeleteStatementModal(this.deleteStatementModal);
    }
  }

  /**
   * To open delete Statement modal
   * @param TemplateRef template
   */
  openDeleteStatementModal(template: TemplateRef<any>) {
    // tslint:disable-next-line:max-line-length
    this.deleteStatementModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, {class: 'modal-md deleteTransconfModal'}));
  }

  /** To close deleteStatementModal */
  cancelDeleteStatementModal() {
    if (this.deleteStatementModalRef) {
      this.deleteStatementModalRef.hide();
      this.deleteStatementModalRef = null;
    }
    this.delStatementDataLoading = false;
  }

  /**To delete pdf statement */
  deleteStatement() {
    if (this.xmlObj) {
      this.delStatementDataLoading = true;
      let deleteStmtData = {};
      deleteStmtData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
      deleteStmtData[CommonConstant.FLOW] = 'gx';
      deleteStmtData[CommonConstant.REPO_ID] = this.xmlObj.id;
      deleteStmtData[CommonConstant.ACCOUNT_NUMBER] = this.xmlObj.accountNumber;
      // deleteStmtData[CommonConstant.TAG] = this.xmlObj[CommonConstant.TAG];
      deleteStmtData = JSON.stringify(deleteStmtData);

      this.XMLFileService.deleteFile(deleteStmtData).subscribe(
        res => {
          this.delStatementDataLoading = false;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // to hide delete modal
            this.cancelDeleteStatementModal();
            // to get statement repository list
            this.XMLFileService.getXMLFiles().subscribe(
              data => {
                this.getXMLFilesData();
              },
              error => {
                console.log(error);
              }
            )
          } else {
            document.getElementById('delStatementRepoError').innerHTML = res[CommonConstant.MESSAGE];
          }
        },
        error => {
          this.delStatementDataLoading = false;
          document.getElementById('delStatementRepoError').innerHTML = 'Something went wrong..Please try again';
        }
      )
    }
  }

  /**
   * To download pdf statement
   * @param any statement
   */
  downloadPdfStatement(statement: any) {
    const dynamic_anchor_tag: any = document.createElement('a');  // Creating anchor tag dynamically
    document.body.appendChild(dynamic_anchor_tag);
    dynamic_anchor_tag.style = 'display: none';

    if (statement) {

      let downloadStmtData = {};
      downloadStmtData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
      downloadStmtData[CommonConstant.FLOW] = 'gx';
      downloadStmtData[CommonConstant.REPO_ID] = statement.id;
      // downloadStmtData[CommonConstant.TAG] = statement[CommonConstant.TAG];
      downloadStmtData = JSON.stringify(downloadStmtData);

      // call service to download
      this.XMLFileService.downloadFile(downloadStmtData).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            dynamic_anchor_tag.href = CommonConstant.PDF_FILE_HEAD + res[CommonConstant.BYTE_CODE];
            dynamic_anchor_tag.download = statement.fileName;
            dynamic_anchor_tag.click();
          } else {
            console.log('Something went wrong');
          }
        },
        error => {
          console.log('Something went wrong');
        }
      )
    }

  }

  /**
   * To open viewXMLFileModal
   * @param any statement
   */
  openViewXMLFileModal(statement: any) {
    this.xmlFileRepoId = statement[CommonConstant.PLAIN_ID];
    if (statement[CommonConstant.FILES]) {
      this.xmlFileList = statement[CommonConstant.FILES];
    } else {
      this.xmlFileList = [];
    }
    // tslint:disable-next-line:max-line-length
    this.viewXMLFileModalRef = this.modalService.show(this.viewXMLFileModal, Object.assign({}, this.modalConfig.config, {class: 'modal-sm deleteTransconfModal'}));
  }

  /** To close deleteStatementModal */
  closeViewXMLFileModal() {
    if (this.viewXMLFileModalRef) {
      this.viewXMLFileModalRef.hide();
      this.viewXMLFileModalRef = null;
    }
    // this.delStatementDataLoading = false;
  }

  /**
   * To download xml file
   * @param string xmlData
   */
  downloadXmlFiles(xmlData: string) {
    const dynamic_anchor_tag: any = document.createElement('a');  // Creating anchor tag dynamically
    document.body.appendChild(dynamic_anchor_tag);
    dynamic_anchor_tag.style = 'display: none';

    let downloadXmlData: any = {};
    downloadXmlData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    downloadXmlData[CommonConstant.FLOW] = 'gx';
    downloadXmlData[CommonConstant.REPO_ID] = this.xmlFileRepoId;
    downloadXmlData[CommonConstant.NAME] = xmlData;
    // downloadXmlData[CommonConstant.TAG] = CommonConstant.TAG;
    downloadXmlData = JSON.stringify(downloadXmlData);

    this.XMLFileService.downloadXmlFile(downloadXmlData).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          if (xmlData.indexOf('.csv') > 0 || xmlData.indexOf('.json') > 0 || xmlData.indexOf('.xlsx') > 0) {
            res[CommonConstant.BYTE_CODE] = atob(res[CommonConstant.BYTE_CODE]);
            dynamic_anchor_tag.href = CommonConstant.CSV_FILE_HEAD + res[CommonConstant.BYTE_CODE];
          } else {
            dynamic_anchor_tag.href = CommonConstant.XML_FILE_HEAD + res[CommonConstant.BYTE_CODE];
          }
          dynamic_anchor_tag.download = xmlData;
          dynamic_anchor_tag.click();
        } else {
          console.log('Something went wrong');
        }
      },
      error => {
        console.log('Something went wrong');
      }
    )
  }

  /** To review selected file and edit */
  reviewSelectedFile(xmlFileName: string) {
    if (xmlFileName) {
      // To store xml file and repo Id
      this.commonHelperService.setXMLFileViewData(this.xmlFileRepoId, xmlFileName);
      this.closeViewXMLFileModal();
      setTimeout(() => {
        this.router.navigateByUrl('/xmlview');
      }, 400);
    }
  }

}
