import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../../shared/common/modal.config';

import { CommonConstant } from '../../constants/common/common.constant';
import { StatementRepositoryConstant } from '../../constants/statement-repository/statement-repository.constant';

import { StatementRepositoryService } from './statement-repository.service';
import { CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';

/**
 * Statement Repository Component Class
 */
@Component({
  selector: 'app-statement-repository',
  templateUrl: './statement-repository.component.html',
  styleUrls: ['./statement-repository.component.css'],
  providers: [
    StatementRepositoryService, CommonHttpAdapterService, RxJSHelper
  ]
})
export class StatementRepositoryComponent implements OnInit, OnDestroy {

  /** Delete statement modal reference */
  @ViewChild('deleteStatementModal') deleteStatementModal: TemplateRef<any>

  public statmentRepositoryData: any = [];
  public xmlFileList: any = [];
  public stmtRepoFileDataByInstitution: Array<any> = [];
  private statementObj: any = {};
  public deleteStatementModalRef: BsModalRef;
  public p = 1;
  public pagesize = 10;
  public search: any = {
    accountType: '',
    accountNumber: '',
    country: '',
    filterMonth: ''
  };
  public searchInst = {
    institutionName: ''
  };
  hasFilter = false;
  statementRepoError = false;
  statementRepoPageLoad = false;

  delStatementDataLoading = false;
  selectedManualInstitution = false;

  // initialize statementData to get data for all filters
  statementData: any = {
    'accountType': [],
    'accountNumber': [],
    'institutionName': [],
    'country': [],
    'filterMonth': []
  };

  /** @ignore */
  constructor(
    private titleService: Title,
    private statementRepositoryService: StatementRepositoryService,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private modalService: BsModalService,
    private modalConfig: ModalConfig,
    private rxjsHelper: RxJSHelper
  ) {
    /** To set the page title */
    this.titleService.setTitle('Conjurer | Statement Repo');
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

  /** To close modals */
  closeModals() {
    this.cancelDeleteStatementModal();
  }


  /**To get statement repository details */
  getStatementRepositoryData() {
    this.statementRepositoryService.getStatementRepositoryDetails().subscribe(
      res => {
        this.statementRepoError = false;
        this.statementRepoPageLoad = true;
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.statmentRepositoryData = res.statementDetails;
          this.arrangeStatementRepoData();
          this.showFilterData();
        } else {
          console.log('Something went wrong');
        }
      },
      error => {
        this.statementRepoError = true;
        console.log('Something went wrong');
      }
    )
  }

  /**
   * To check statement date
   * @param any obj
   * @param any[] list
   */
  checkInstitutionValue(obj: any, list: any[]) {
    let i;
    for (i = 0; i < list.length; i++) {
      if (list[i].institutionName === obj.institutionName) {
        return i;
      }
    }
    return false;
  }

  /**  To arrange data by statement date and institution */
  arrangeStatementRepoData() {
    if (this.statmentRepositoryData) {

      let xmlFilesDataByInstitutionObject: Object = {}
      const xmlFilesDataByInstitutionArray: Array<any> = [];

      this.statmentRepositoryData.forEach((element, key) => {
        // arrange data by institution name
        xmlFilesDataByInstitutionObject = {};
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

      this.stmtRepoFileDataByInstitution = xmlFilesDataByInstitutionArray;
    }
  }

  /** To clear filter */
  clearAllFilter() {
    this.search = {
      accountType: '',
      accountNumber: '',
      country: '',
      filterMonth: ''
    };

    this.searchInst = {
      institutionName: ''
    }

    this.hasFilter = false;
  }

  /** To set filter */
  setFilter() {
    let count = 0;
    if (this.searchInst.institutionName === '' ) { count++; }
    if (this.search.accountType === '' ) { count++; }
    if (this.search.accountNumber === '' ) { count++; }
    if (this.search.country === '' ) { count++; }
    if (this.search.filterMonth === '' ) { count++; }

    if (count === 5) {
        this.hasFilter = false;
    } else if (count < 5) {
        this.hasFilter = true;
    }
  }

  /**To show filter drop down data */
  showFilterData() {
    if (this.statmentRepositoryData) {
      // initialize search for filters
      this.search = {
          accountType: '',
          accountNumber: '',
          institutionName: '',
          country: '',
          filterMonth: ''
      };

      this.searchInst = {
        institutionName: ''
      };

      // To clear all the filter
      this.clearAllFilter();

      this.statmentRepositoryData.forEach(element => {
        if (this.statementData.accountNumber.indexOf(element.accountNumber) === -1) {
          this.statementData['accountNumber'].push(element.accountNumber);
        }

        if (!this.statementData.institutionName.includes(element.institutionName)) {
          this.statementData.institutionName.push(element.institutionName);
        }

        if (!this.statementData.country.includes(element.country)) {
          this.statementData.country.push(element.country);
        }

        if (!this.statementData.country.includes(element.filterMonth)) {
          this.statementData.filterMonth.push(element.filterMonth);
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

  /**
   * To prepare delete statement
   * @param any statement
   */
  prepareStatementDelete(statement: any) {
    if (statement) {
      this.statementObj = statement;
      this.openDeleteStatementModal(this.deleteStatementModal);
    }
  }

  /** To delete pdf statement */
  deleteStatement() {
    if (this.statementObj) {
      this.delStatementDataLoading = true;
      let deleteStmtData = {};
      deleteStmtData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
      deleteStmtData[CommonConstant.FLOW] = 'pimoney';
      deleteStmtData[CommonConstant.REPO_ID] = this.statementObj.id;
      deleteStmtData[CommonConstant.ACCOUNT_NUMBER] = this.statementObj.accountNumber;
      deleteStmtData[CommonConstant.TAG] = this.statementObj[CommonConstant.TAG];
      deleteStmtData = JSON.stringify(deleteStmtData);

      this.statementRepositoryService.deletePdfStatement(deleteStmtData).subscribe(
        res => {
          this.delStatementDataLoading = false;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // to hide delete modal
            this.cancelDeleteStatementModal();
            // to get statement repository list
            this.statementRepositoryService.getStatementRepositoryDetails().subscribe(
              data => {
                this.statmentRepositoryData = data.statementDetails;
                this.arrangeStatementRepoData();
                this.showFilterData(); // to refresh filter data
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
      downloadStmtData[CommonConstant.FLOW] = 'pimoney';
      downloadStmtData[CommonConstant.REPO_ID] = statement.id;
      downloadStmtData[CommonConstant.TAG] = statement[CommonConstant.TAG];
      downloadStmtData = JSON.stringify(downloadStmtData);

      // call service to download
      this.statementRepositoryService.downloadPdfStatement(downloadStmtData).subscribe(
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
   * @param any xmlData
   */
  downloadXmlFiles(xmlData: any) {
    const dynamic_anchor_tag: any = document.createElement('a');  // Creating anchor tag dynamically
    document.body.appendChild(dynamic_anchor_tag);
    dynamic_anchor_tag.style = 'display: none';

    let downloadXmlData: any = {};
    downloadXmlData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    downloadXmlData[StatementRepositoryConstant.FILE_HASH] = xmlData.fileHash;
    downloadXmlData[CommonConstant.TAG] = xmlData[CommonConstant.TAG];
    downloadXmlData = JSON.stringify(downloadXmlData);

    this.statementRepositoryService.downloadXmlFile(downloadXmlData).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          dynamic_anchor_tag.href = res.file;
          dynamic_anchor_tag.download = xmlData.fileName;
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
