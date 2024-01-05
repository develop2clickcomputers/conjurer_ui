import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../../shared/common/modal.config';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { CommonConstant } from '../../constants/common/common.constant';
import { BatchReportService } from './batch-report.service';
import { CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';
import { CommonHelperService } from '../../helpers/common/common.helper';
import { CommonNotificationComponent } from '../../shared/notification.component';

/**
 * Batch report component class
 */
@Component({
  selector: 'app-batch-report',
  templateUrl: './batch-report.component.html',
  styleUrls: ['./batch-report.component.css'],
  providers: [
    BatchReportService, CommonHttpAdapterService, RxJSHelper
  ]
})
export class BatchReportComponent implements OnInit, OnDestroy {

  /** Delete statement modal reference */
  @ViewChild('deleteStatementModal', {static: false}) deleteStatementModal: TemplateRef<any>;

  /** View batch file data modal reference */
  @ViewChild('viewBatchFileModal', {static: false}) viewBatchFileModal: TemplateRef<any>;

  /** Notification component reference */
  @ViewChild('notificationComponent', {static: false}) notificationComponent: CommonNotificationComponent;

  /** Set credential modal reference for password protected files */
  @ViewChild('setCredentialModal', {static: false}) setCredentialModal: TemplateRef<any>;

  public batchReportData: any = [];
  public xmlFileList: any = [];
  public stmtRepoFileDataByBatchId: Array<any> = [];
  private batchReportObj: any = {};

  public credentialForm: FormGroup;

  public deleteBatchFileModalRef: BsModalRef;
  public viewBatchFileModalRef: BsModalRef;
  public setCredentialModalRef: BsModalRef;

  public p = 1;
  public pagesize = 10;
  public search: any = {
    institutionName: '',
    portfolioNumber: '',
  };
  public searchInst: any = {
    batchId: ''
  };
  hasFilter = false;
  batchReportError = false;
  batchReportPageLoad = false;
  updateCredentialLoader = false;

  delBatchReportDataLoading = false;
  selectedManualInstitution = false;

  // initialize statementData to get data for all filters
  statementData: any = {
    'batchId': [],
    'institutionName': [],
    'portfolioNumber': [],
  };

  /** @ignore */
  constructor(
    private titleService: Title,
    private batchReportService: BatchReportService,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private modalService: BsModalService,
    private modalConfig: ModalConfig,
    private rxjsHelper: RxJSHelper,
    private commonHelper: CommonHelperService,
    private bsModalService: BsModalService,
    private _fb: FormBuilder,
    private loaderService: Ng4LoadingSpinnerService
  ) {
    this.titleService.setTitle('Conjurer | Batch Reports');
  }

  /** @ignore */
  ngOnInit() {
    this.getStatementRepositoryData();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();

    this.closeModals();
  }

  /** @ignore */
  closeModals() {
    this.cancelDeleteStatementModal();
  }


  /**To get statement repository details */
  getStatementRepositoryData() {
    this.batchReportService.getStatementRepositoryDetails().subscribe(
      res => {
        this.batchReportError = false;
        this.batchReportPageLoad = true;
        if (res[CommonConstant.ERROR_CODE] === 0) {
          const resData = res[CommonConstant.DATA];
          this.batchReportData = resData;
          this.arrangeStatementRepoData();
          this.showFilterData();
        } else {
          console.log('Something went wrong');
        }
      },
      error => {
        this.batchReportError = true;
        console.log('Something went wrong');
      }
    )
  }

  /** To arrange data by statement date and institution */
  arrangeStatementRepoData() {
    if (this.batchReportData) {

      let xmlFilesDataByInstitutionObject: Object = {}
      const xmlFilesDataByInstitutionArray: Array<any> = [];

      this.batchReportData.forEach((element, key) => {
        // arrange data by institution name
        xmlFilesDataByInstitutionObject = {};
        const instIndex = this.commonHelper.checkForDuplicateValue(element, xmlFilesDataByInstitutionArray, 'batchId');
        if (instIndex === 0 || instIndex > 0) {
          xmlFilesDataByInstitutionArray[instIndex].statementDetails.push(element);
        } else {
          xmlFilesDataByInstitutionObject['batchId'] = element.batchId;
          xmlFilesDataByInstitutionObject['statementDetails'] = [];
          xmlFilesDataByInstitutionObject['statementDetails'].push(element);
        }
        if (Object.keys(xmlFilesDataByInstitutionObject).length > 0) {
          xmlFilesDataByInstitutionArray.push(xmlFilesDataByInstitutionObject);
        }

      });

      this.stmtRepoFileDataByBatchId = xmlFilesDataByInstitutionArray;
    }
  }

  /**To clear filter */
  clearAllFilter() {
    this.search = {
      institutionName: '',
      portfolioNumber: '',
    };

    this.searchInst = {
      batchId: ''
    };

    this.hasFilter = false;
  }

  /**To set filter */
  setFilter() {
    let count = 0;
    if (this.search.institutionName === '' ) { count++; }
    if (this.search.portfolioNumber === '' ) { count++; }
    if (this.searchInst.batchId === '' ) { count++; }

    if (count === 3) {
        this.hasFilter = false;
    } else if (count < 3) {
        this.hasFilter = true;
    }
  }

  /**To show filter drop down data */
  showFilterData() {
    if (this.batchReportData) {
      // initialize search for filters
      this.search = {
          // batchId: '',
          institutionName: '',
          portfolioNumber: '',
      };

      // To clear all the filter
      this.clearAllFilter();

      this.batchReportData.forEach(element => {
        if (this.statementData.batchId.indexOf(element.batchId) === -1) {
          this.statementData['batchId'].push(element.batchId);
        }

        if (!this.statementData.institutionName.includes(element.institutionName)) {
          this.statementData.institutionName.push(element.institutionName);
        }

        if (!this.statementData.portfolioNumber.includes(element.portfolioNumber)) {
          this.statementData.portfolioNumber.push(element.portfolioNumber);
        }
      });
    }
  }

  /**
   * To get xml files object from statement
   * @param any statement
   */
  getXMLFilesFromStatements(statement: any) {
    if (statement) {
      this.xmlFileList = statement.files;
    }
  }

  /**
   * To open delete Statement modal
   */
  openDeleteStatementModal() {
    // tslint:disable-next-line:max-line-length
    this.deleteBatchFileModalRef = this.modalService.show(this.deleteStatementModal, Object.assign({}, this.modalConfig.config, {class: 'modal-sm deleteTransconfModal'}));
  }

  /** To close deleteStatementModal */
  cancelDeleteStatementModal() {
    if (this.deleteBatchFileModalRef) {
      this.deleteBatchFileModalRef.hide();
      this.deleteBatchFileModalRef = null;
    }
    this.delBatchReportDataLoading = false;
  }

  /**
   * To prepare delete statement
   * @param batch
   */
  prepareStatementDelete(batch: any) {
    if (batch) {
      this.batchReportObj = batch;
      this.openDeleteStatementModal();
    }
  }

  /**To delete pdf statement */
  deleteBatch() {
    if (this.batchReportObj) {
      let deleteStmtData = {};
      deleteStmtData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
      deleteStmtData['batchId'] = this.batchReportObj['batchId'];
      deleteStmtData = JSON.stringify(deleteStmtData);
      this.loaderService.show();
      this.batchReportService.deleteBatchFileDetail(deleteStmtData).subscribe(
        res => {
          this.loaderService.hide();
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // to hide delete modal
            this.cancelDeleteStatementModal();
            // refresh batch data
            this.getStatementRepositoryData();
          } else {
            this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          this.loaderService.hide();
          this.notificationComponent.openNotificationModal('Something went wrong..Please try again');
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
      downloadStmtData[CommonConstant.FLOW] = 'pimoney';
      downloadStmtData[CommonConstant.REPO_ID] = statement.id;
      downloadStmtData[CommonConstant.TAG] = statement[CommonConstant.TAG];
      downloadStmtData = JSON.stringify(downloadStmtData);

      // call service to download
      this.batchReportService.downloadPdfStatement(downloadStmtData).subscribe(
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
   * To download xml file
   * @param any batchReport
   */
  downloadBatchReportFiles(batchReport: any) {
    const dynamic_anchor_tag: any = document.createElement('a');  // Creating anchor tag dynamically
    document.body.appendChild(dynamic_anchor_tag);
    dynamic_anchor_tag.style = 'display: none';

    const fileName = batchReport[CommonConstant.NAME];

    let downloadReqData: any = {};
    downloadReqData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    // downloadReqData[StatementRepositoryConstant.FILE_HASH] = batchReport.fileHash;
    // downloadReqData[CommonConstant.TAG] = batchReport[CommonConstant.TAG];
    downloadReqData[CommonConstant.FILE_NAME] = batchReport[CommonConstant.NAME];
    downloadReqData[CommonConstant.FILE_PATH] = this.batchReportObj[CommonConstant.FILE_PATH];
    downloadReqData = JSON.stringify(downloadReqData);

    this.batchReportService.downloadBatchReportFile(downloadReqData).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          if (fileName.indexOf('.xlsx') > 0) {
            res[CommonConstant.DATA] = atob(res[CommonConstant.DATA]);
            dynamic_anchor_tag.href = CommonConstant.EXCEL_FILE_HEAD + res[CommonConstant.DATA];
          } else {
            dynamic_anchor_tag.href = CommonConstant.XML_FILE_HEAD + res[CommonConstant.DATA];
          }
          dynamic_anchor_tag.download = fileName;
          dynamic_anchor_tag.click();
        } else {
          this.notificationComponent.notificationMessage = res[CommonConstant.MESSAGE];
          this.notificationComponent.openComonNotificationModal();
        }
      },
      error => {
        this.notificationComponent.notificationMessage = 'Something went wrong..Please try again later';
        this.notificationComponent.openComonNotificationModal();
      }
    )
  }

  /**
   * To get file details
   * @param any statement
   */
  getFileDetails(statement: any) {
    this.batchReportObj = statement;
    const filePath = statement.filePath;
    let requestData: any = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    requestData[CommonConstant.PLAIN_ID] = statement[CommonConstant.PLAIN_ID];
    requestData[CommonConstant.FILE_PATH] = statement[CommonConstant.FILE_PATH];
    requestData[CommonConstant.REMEMBER] = statement[CommonConstant.REMEMBER];
    requestData = JSON.stringify(requestData);

    this.callGetFileDetailApi(requestData);
  }

  /**
   * To get file details by calling rest api
   * @param any requestData
   */
  callGetFileDetailApi(requestData: any) {
    this.updateCredentialLoader = true;
    if (document.getElementById('updateCredentailErrorMsg') != null) {
      document.getElementById('updateCredentailErrorMsg').innerHTML = '';
    }
    this.loaderService.show();
    this.batchReportService.getFileDetails(requestData).subscribe(
        res => {
          this.updateCredentialLoader = false;
          this.loaderService.hide();
          if (res[CommonConstant.ERROR_CODE] === 0) {
            const resData = res[CommonConstant.DATA];
            this.formatFiles(resData);
            this.closeSetCredentialModal();
            this.openViewXMLFileModal();
          } else {
            // console.log();
            if (document.getElementById('updateCredentailErrorMsg') != null) {
              document.getElementById('updateCredentailErrorMsg').innerHTML = res[CommonConstant.MESSAGE];
            }
            this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          this.updateCredentialLoader = false;
          this.loaderService.hide();
          if (document.getElementById('updateCredentailErrorMsg') != null) {
            document.getElementById('updateCredentailErrorMsg').innerHTML = 'Something went wrong..Please try again';
          }
          this.notificationComponent.openNotificationModal('Something went wrong..Please try again');
        }
      )
  }

  /**
   * To format files
   * @param any[] resData
   */
  formatFiles(resData: any[]) {
    let dataObj: any = {};
    this.xmlFileList = [];
    resData.forEach(element => {
      dataObj = {};
      const filePath = <String>element.name;
      if (filePath) {
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
        dataObj[CommonConstant.NAME] = fileName;
        dataObj[CommonConstant.FILE_PATH] = element.name;

        this.xmlFileList.push(dataObj);
      }
    });
  }

  /**
   * To open viewBatchFileModal
   */
  openViewXMLFileModal() {
    // tslint:disable-next-line:max-line-length
    this.viewBatchFileModalRef = this.modalService.show(this.viewBatchFileModal, Object.assign({}, this.modalConfig.config, {class: 'modal-md deleteTransconfModal'}));
  }

  /** To close deleteStatementModal */
  closeViewXMLFileModal() {
    if (this.viewBatchFileModalRef) {
      this.viewBatchFileModalRef.hide();
      this.viewBatchFileModalRef = null;
    }
  }

  /**
   * Set credential functionality
   */

  /**
   * To open delete Statement modal
   */
  openSetCredentailModal() {
    this.createCredentailForm();
    // tslint:disable-next-line:max-line-length
    this.deleteBatchFileModalRef = this.modalService.show(this.setCredentialModal, Object.assign({}, this.modalConfig.config, {class: 'modal-sm'}));
  }

  /** To close deleteStatementModal */
  closeSetCredentialModal() {
    if (this.setCredentialModalRef) {
      this.setCredentialModalRef.hide();
      this.setCredentialModalRef = null;
    }
    this.updateCredentialLoader = false;
  }

  /** To create Credential form */
  createCredentailForm() {
    return this.credentialForm = this._fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  /**
   * To update credentials
   */
  updateCredential() {
    const credentialFormData = this.credentialForm.getRawValue();
    const username = credentialFormData['username'];
    const password = credentialFormData['password'];
    let requestData: any = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    requestData[CommonConstant.PLAIN_ID] = this.batchReportObj[CommonConstant.PLAIN_ID];
    requestData[CommonConstant.FILE_PATH] = this.batchReportObj[CommonConstant.FILE_PATH];
    requestData[CommonConstant.REMEMBER] = this.batchReportObj[CommonConstant.REMEMBER];
    requestData['dflUname'] = username;
    requestData['dflPass'] = password;
    requestData = JSON.stringify(requestData);
    // calling api
    this.callGetFileDetailApi(requestData);
  }

}
