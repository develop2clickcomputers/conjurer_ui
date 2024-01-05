import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../../shared/common/modal.config';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { CommonConstant } from '../../constants/common/common.constant';
import { ClientConstant } from '../../constants/client/client.constant';
import { CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';
import { CommonNotificationComponent } from '../../shared/notification.component';
import { FactFinderService } from './fact-finder.service';

@Component({
  selector: 'app-fact-finder',
  templateUrl: './fact-finder.component.html',
  styleUrls: ['./fact-finder.component.css'],
  providers: [
    FactFinderService, CommonHttpAdapterService,
    RxJSHelper
  ]
})
export class FactFinderComponent implements OnInit, OnDestroy {

  /** Detele fact finder history modal reference */
  @ViewChild('deleteFactFinderHistoryModal') deleteFactFinderHistoryModal: TemplateRef<any>;

  /** pdf preview modal reference */
  @ViewChild('pdfPreviewModal') pdfPreviewModal: TemplateRef<any>;

  /** Fact finder form modal reference */
  @ViewChild('factFinderFormModal') factFinderFormModal: TemplateRef<any>;

  /** Review fact finder form modal reference */
  @ViewChild('reviewFormModal') reviewFormModal: TemplateRef<any>;

  /** Notification component reference */
  @ViewChild('notificationComponent') notificationComponent: CommonNotificationComponent;

  /** Otp modal reference */
  @ViewChild('otpModal') otpModal: TemplateRef<any>;

  public factFinderHistory: any[] = [];
  public clientObject: any = {};
  public clientObj: any = {};
  public businessClient: any = {};
  public individualClient: any = {};
  private factFinderHistoryObj: any = {};

  private deleteFactFinderHistoryModalRef: BsModalRef;
  public delFactFinderHistoryLoading = false;
  public generateFactFinderLoader = false;

  private pdfPreviewModalRef: BsModalRef;
  private factFinderFormModalRef: BsModalRef;
  private reviewFormModalRef: BsModalRef;
  private otpModalRef: BsModalRef;

  individualFormView = false;
  businessFormView = false;
  clientLevelMenu = false;

  showPdfPreview = false;

  private factFinderDocId: string;
  private factFinderDocPath: string;
  private finalFactFinderDocPath;

  public htmlDoc: any;
  public remarksModalText: string;
  public updateFactFinderLoader = false;
  public factFinderHistoryError = false;

  // approve
  public otpObj: any = {};
  public sendOtpLoader = false;
  public verifyOtpLoader = false;

  private signatureMap = [
    'digitalsign-clientname', 'digitalsign-clientsignature', 'digitalsign-spousename', 'digitalsign-spousesignature',
    'digitalsign-SpouseJointApplicantSignatureform2', 'digitalsign-ClientSignature/Dateform2', 'digitalsign-dataprotectionclientsignature',
    'digitalsign-Productrecomclientsignatureform2', 'digitalsign-Noticesurveyclientsign', 'digitalsign-Noticesurveyspousesigndate',
    'digitalsign-DeclarationIppname', 'digitalsign-clntstatesign-1', 'digitalsign-clientnameform3', 'digitalsign-clientsignatureform3',
    'digitalsign-spousenameform3', 'digitalsign-spousesignatureform3', 'digitalsign-signatureofclientform3', 'digitalsign-Fartimestamp',
    'digitalsign-Farname', 'digitalsign-farsignauture', 'digitalsign-IPPFAFARName&Signature/Date', 'digitalsign-Farnameform3',
    'digitalsign-farsignautureform3', 'digitalsign-managername', 'digitalsign-managersign', 'digitalsign-Managernamefomr2',
    'digitalsign-ManagerName&Signature/Date', 'digitalsign-Followupmanagersign', 'digitalsign-managersignform3',
    'digitalsign-managernameform3'
  ];

  /** @ignore */
  constructor(
    private titleService: Title,
    private factFinderService: FactFinderService,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private rxjsHelper: RxJSHelper,
    private router: Router,
    private modalService: BsModalService,
    private modalConfig: ModalConfig,
    private sanitized: DomSanitizer,
    private http: Http,
    private loaderService: Ng4LoadingSpinnerService
  ) {
    /** To set page title */
    this.titleService.setTitle('Conjurer | Fact Finder');
  }

  /** @ignore */
  ngOnInit() {
    this.getFactFinderHistory();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();

    this.closeModals();
  }

  /** To close all the modals of any of these modals are not closed */
  closeModals() {
    this.closeDeleteStatementModal();
    this.closeFactFinderFormModal();
    this.closePdfPreviewModal();
    this.closeReviewFormModal();
    this.closeOtpModal();
  }

  /**
   * To sanitize html data
   * @param any value
   */
  sanitizedData(value: any) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }

  /**
   * To get html doc path
   */
  getFactFinderDocPath() {
    // const url = this.factFinderDocPath;
    const loc = window.location.host;
    const url = loc + '/assets/pdfFiles/combined.html';
    const sanitizedUrl = this.sanitized.bypassSecurityTrustResourceUrl(url);
    this.finalFactFinderDocPath = sanitizedUrl;
  }

  /**
   * To open common notification modal
   * @param string message
   */
  openCommonNotificationModal(message?: string) {
    if (message) {
      this.notificationComponent.notificationMessage = message;
    } else {
      this.notificationComponent.notificationMessage = 'Something went wrong..Please try again';
    }
    this.notificationComponent.openComonNotificationModal();
  }

  /**
   * To get fact finder history
   */
  getFactFinderHistory() {
    this.loaderService.show();
    this.factFinderService.getFactFindersHistory().subscribe(
      res => {
        this.loaderService.hide();
        if (res[CommonConstant.ERROR_CODE] === 0) {
          const resData = res[CommonConstant.DATA].factfinders;
          this.factFinderHistory = resData;
          this.factFinderHistoryError = false;
        } else {
          this.factFinderHistoryError = true;
        }
      },
      error => {
        this.loaderService.hide();
        this.factFinderHistoryError = true;
      }
    )
  }


  /**
   * To download fact finder statement
   * @param any statement
   */
  downloadFactFinderStatement(statement: any) {
    const dynamic_anchor_tag: any = document.createElement('a');  // Creating anchor tag dynamically
    document.body.appendChild(dynamic_anchor_tag);
    dynamic_anchor_tag.style = 'display: none';

    if (statement) {
      let downloadStmtData = {};
      downloadStmtData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
      downloadStmtData[CommonConstant.PLAIN_ID] = statement.id;
      downloadStmtData = JSON.stringify(downloadStmtData);

      // call service to download
      this.loaderService.show();
      this.factFinderService.downloadFactFinderStatement(downloadStmtData).subscribe(
        res => {
          this.loaderService.hide();
          if (res[CommonConstant.ERROR_CODE] === 0) {
            const resData = res[CommonConstant.DATA];
            dynamic_anchor_tag.href = CommonConstant.PDF_FILE_HEAD + resData[CommonConstant.BYTE_CODE];
            dynamic_anchor_tag.download = statement.fileName;
            dynamic_anchor_tag.click();
          } else {
            this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          this.loaderService.hide();
          this.notificationComponent.openNotificationModal();
        }
      )
    }

  }

  /**
   * To open delete Statement modal
   */
  openDeleteStatementModal() {
    // tslint:disable-next-line:max-line-length
    this.deleteFactFinderHistoryModalRef = this.modalService.show(this.deleteFactFinderHistoryModal, Object.assign({}, this.modalConfig.config, {class: 'modal-md deleteTransconfModal'}));
  }

  /** To close deleteStatementModal */
  closeDeleteStatementModal() {
    if (this.deleteFactFinderHistoryModalRef) {
      this.deleteFactFinderHistoryModalRef.hide();
      this.deleteFactFinderHistoryModalRef = null;
    }
    this.delFactFinderHistoryLoading = false;
  }


  /**
   * To prepare delete statement
   * @param any statement
   */
  prepareStatementDelete(statement: any) {
    if (statement) {
      this.factFinderHistoryObj = statement;
      this.openDeleteStatementModal();
    }
  }

  /**To delete pdf statement */
  deleteStatement() {
    if (this.factFinderHistoryObj) {
      this.delFactFinderHistoryLoading = true;
      let deleteStmtData = {};
      deleteStmtData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
      deleteStmtData[CommonConstant.PLAIN_ID] = this.factFinderHistoryObj.id;
      deleteStmtData = JSON.stringify(deleteStmtData);

      this.factFinderService.deleteFactFinderStatement(deleteStmtData).subscribe(
        res => {
          this.delFactFinderHistoryLoading = false;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // to hide delete modal
            this.closeDeleteStatementModal();
            this.getFactFinderHistory();
          } else {
            document.getElementById('delStatementRepoError').innerHTML = res[CommonConstant.MESSAGE];
          }
        },
        error => {
          this.delFactFinderHistoryLoading = false;
          document.getElementById('delStatementRepoError').innerHTML = 'Something went wrong..Please try again';
        }
      )
    }
  }

  /**
   * Pdf preview functionality
   */

  /**
   * To open fact finder preview modal
   */
  openPdfPreviewModal() {
    this.pdfPreviewModalRef = this.modalService.show(this.pdfPreviewModal, Object.assign({}, this.modalConfig.config, {class: 'modal-xl'}));
  }

  /** To close fact finder statement */
  closePdfPreviewModal() {
    if (this.pdfPreviewModalRef) {
      this.pdfPreviewModalRef.hide();
      this.pdfPreviewModalRef = null;
    }
    this.showPdfPreview = false;
  }

  /**
   * To download pdf statement
   * @param any statement
   */
  previewFactFinder(statement: any) {
    if (statement) {
      this.factFinderHistoryObj = Object.assign({}, statement);
      this.factFinderDocId = statement[CommonConstant.PLAIN_ID];
      if (statement[CommonConstant.TEMPLATE_LOCATION]) {
        this.factFinderDocPath = statement[CommonConstant.TEMPLATE_LOCATION];
        this.getFactFinderDocPath();
      }

      let downloadStmtData = {};
      downloadStmtData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
      downloadStmtData[CommonConstant.PLAIN_ID] = statement.id;
      downloadStmtData = JSON.stringify(downloadStmtData);

      // call service to download
      this.loaderService.show();
      this.factFinderService.downloadFactFinderStatement(downloadStmtData).subscribe(
        res => {
          this.loaderService.hide();
          if (res[CommonConstant.ERROR_CODE] === 0) {
            const resData = res[CommonConstant.DATA];
            const pdf = resData[CommonConstant.BYTE_CODE];
            // this.showPdfPreview = true;
            this.openPdfPreviewModal();
            fetch(`data:application/pdf;base64, ${pdf}`)
              .then(response => response.blob())
              .then(blob => {
                document.querySelector('iframe').src = URL.createObjectURL(blob)
              })
          } else {
            this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          this.loaderService.hide();
          this.notificationComponent.openNotificationModal();
        }
      )
    }

  }

  /**
   * Fact finder update functionality
   */
  openFactFinderFormModal() {
    this.factFinderFormModalRef = this.modalService.show(this.factFinderFormModal,
      Object.assign({}, this.modalConfig.config, { class: 'modal-xl' }));

  }

  /** To close fact finder form modal */
  closeFactFinderFormModal() {
    if (this.factFinderFormModalRef) {
      this.factFinderFormModalRef.hide();
      this.factFinderFormModalRef = null;

      // push dynamically generated input fields fileds
      const innerDoc = this.getFrameInnerDoc();
      const dynamicInputFields = innerDoc.querySelectorAll('input[id^="dynamicInputField"]');
      if (dynamicInputFields.length > 0) {
        this.getFactFinderHistory();
      }
    }
  }

  /**
   * To load html template
   * @param any url
   */
  loadHtmlTemplate(url: any) {
    this.factFinderService.getHtmlFile(url).subscribe(
      res => {
        this.generateFactFinderLoader = false;
        this.htmlDoc = res;
        // step 1: get the DOM object of the iframe.
        const iframe = document.getElementById('iframeId');

        // step 2: obtain the document associated with the iframe tag
        // tslint:disable-next-line:max-line-length
        // most of the browser supports .document. Some supports (such as the NetScape series) .contentDocumet, while some (e.g. IE5/6) supports .contentWindow.document
        // we try to read whatever that exists.
        let iframedoc = iframe['document'];
        if (iframe['contentDocument']) {
          iframedoc = iframe['contentDocument'];
        } else if (iframe['contentWindow']) {
          iframedoc = iframe['contentWindow'].document;
        }
        if (iframedoc) {
          // Put the content in the iframe
          iframedoc.open();
          iframedoc.writeln(this.htmlDoc);
          iframedoc.close();
        } else {
          // just in case of browsers that don't support the above 3 properties.
          // fortunately we don't come across such case so far.
          alert('Cannot inject dynamic contents into iframe.');
        }
        setTimeout(() => {
          this.setDocData();
        }, 400);
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * To check duplication array object value
   * @param any obj
   * @param any[] list
   * @param string field
   */
  checkArrayDuplicateValue(obj: any, list: any[], field: string) {
    let i;
    for (i = 0; i < list.length; i++) {
      if (list[i][field] === obj[field]) {
        return i;
      }
    }
    return false;
  }

  /**
   * To get html doc data
   */
  getDocData() {
    let factFinderFields: any = {};
    if (Object.keys(this.factFinderHistoryObj).length > 0) {
      factFinderFields = this.factFinderHistoryObj[CommonConstant.FIELDS];
      const iframe = document.getElementById('iframeId');
      const innerDoc = (iframe['contentDocument']) ? iframe['contentDocument'] : iframe['contentWindow'].document;

      for (const key in factFinderFields) {
        if (factFinderFields.hasOwnProperty(key)) {
          const elementKey = key;
          const elementValue = factFinderFields[key];
          if (elementValue.length > 0) {

            let reqValue: any;
            elementValue.forEach(element => {
              if (innerDoc.getElementById(element.fieldId) !== null) {
                const htmlDomElement = innerDoc.getElementById(element.fieldId);
                if (htmlDomElement.type === 'checkbox') {
                  reqValue = (htmlDomElement.checked) ? CommonConstant.CHECKED_VALUE : CommonConstant.UNCHECKED_VALUE;
                } else {
                  reqValue = innerDoc.getElementById(element.fieldId).value;
                }
                element['value'] = reqValue;
              }
            });
          }
        }
      }

      // push dynamically generated input fields fileds
      const dynamicInputFields = innerDoc.querySelectorAll('input[id^="dynamicInputField"]');
      let obj: any = {};
      if (dynamicInputFields.length > 0) {
        for (let index = 0; index < dynamicInputFields.length; index++) {
          obj = {};
          const element = dynamicInputFields[index];
          obj[CommonConstant.FIELD_NAME] = null;
          obj[CommonConstant.FIELD_ID] = element.id;
          obj[CommonConstant.VALUE] = element.value;
          obj[CommonConstant.FIELD_OLD_VALUE] = null;
          obj[CommonConstant.EDITED] = false;
          obj[CommonConstant.REMARKS] = null;
          obj[CommonConstant.EDITED_BY] = 0;

          const closestSectionElement = (<HTMLInputElement>dynamicInputFields[index]).closest('section');
          const closestSectionElementClassList = closestSectionElement.classList;
          for (const key in factFinderFields) {
            if (factFinderFields.hasOwnProperty(key)) {
              const elementKey = key;
              const elementValue = factFinderFields[key];
              const arrayElementIndex = this.checkArrayDuplicateValue(obj, elementValue, CommonConstant.FIELD_ID);
              if (closestSectionElementClassList.contains(elementKey)) {
                if (!arrayElementIndex) {
                  elementValue.push(obj);
                }
              }
            }
          }

          // factFinderFields.push(obj);
        }
      }
    }

    return factFinderFields;
  }

  /** To set html doc data */
  setDocData() {
    if (Object.keys(this.factFinderHistoryObj).length > 0) {
      let factFinderFields: any = {};
      factFinderFields = this.factFinderHistoryObj[CommonConstant.FIELDS];
      const iframe = document.getElementById('iframeId');
      const innerDoc = (iframe['contentDocument']) ? iframe['contentDocument'] : iframe['contentWindow'].document;
      for (const key in factFinderFields) {
        if (factFinderFields.hasOwnProperty(key)) {
          const elementKey = key;
          const elementValue = factFinderFields[key];

          let reqValue: any;
          elementValue.forEach(element => {
            if (innerDoc.getElementById(element.fieldId) !== null) {
              const htmlDomElement = innerDoc.getElementById(element.fieldId);

              // getting closet section element
              const sectionElement = (<HTMLInputElement>htmlDomElement).closest('section');
              const sectionClassList = sectionElement.classList;
              if (!sectionClassList.contains(elementKey)) {
                sectionClassList.add(elementKey);
              }

              if (htmlDomElement.type === 'checkbox') {
                const checkboxVal = element['value'];
                reqValue = (checkboxVal !== '' && checkboxVal === CommonConstant.CHECKED_VALUE) ? true : false;
                innerDoc.getElementById(element.fieldId).checked = reqValue;
              } else {
                // innerDoc.getElementById(element.fieldId).value = element['value'];
                if (this.signatureMap.indexOf(element.fieldId) > -1) {
                  reqValue = element.value;
                } else {
                  reqValue = innerDoc.getElementById(element.fieldId).value;
                }
              }
            }
          });
        }
      }
    }
    this.affixSignature();
    this.generateAddMoreButtons();
  }

  /**
   * To affix signature in fact finder template
   */
  affixSignature() {
    if (Object.keys(this.factFinderHistoryObj).length > 0) {
      const innerDoc = this.getFrameInnerDoc();

      // when approved by client/spouse
      if (!this.factFinderHistoryObj.approvedByClient) {

        // form 1
        const digiSigClientName = innerDoc.getElementById('digitalsign-clientname')
        if (digiSigClientName != null) {
          digiSigClientName.value = '';
        }
        const digiSigClientSig = innerDoc.getElementById('digitalsign-clientsignature')
        if (digiSigClientSig != null) {
          digiSigClientSig.value = '';
        }
        const digiSigClientSpouseName = innerDoc.getElementById('digitalsign-spousename');
        if (digiSigClientSpouseName != null) {
          digiSigClientSpouseName.value = '';
        }
        const digiSigClientSpouseSig = innerDoc.getElementById('digitalsign-spousesignature');
        if (digiSigClientSpouseSig != null) {
          digiSigClientSpouseSig.value = '';
        }

        // form 2
        const digiSigClientNameForm3 = innerDoc.getElementById('digitalsign-SpouseJointApplicantSignatureform2');
        if (digiSigClientNameForm3 != null) {
          digiSigClientNameForm3.value = '';
        }
        const digiSigClientSigForm2 = innerDoc.getElementById('digitalsign-ClientSignature/Dateform2');
        if (digiSigClientSigForm2 != null) {
          digiSigClientSigForm2.value = '';
        }
        const digiSigDataprotectionclientsignature = innerDoc.getElementById('digitalsign-dataprotectionclientsignature');
        if (digiSigDataprotectionclientsignature != null) {
          digiSigDataprotectionclientsignature.value = '';
        }
        const digiSigProductClientSignForm2 = innerDoc.getElementById('digitalsign-Productrecomclientsignatureform2');
        if (digiSigProductClientSignForm2 != null) {
          digiSigProductClientSignForm2.value = '';
        }

        // form 3
        const digiSigNoticeClientSig = innerDoc.getElementById('digitalsign-Noticesurveyclientsign');
        if (digiSigNoticeClientSig != null) {
          digiSigNoticeClientSig.value = '';
        }
        const digiSigNoticeSpouseClientName = innerDoc.getElementById('digitalsign-Noticesurveyspousesigndate');
        if (digiSigNoticeSpouseClientName != null) {
          digiSigNoticeSpouseClientName.value = '';
        }
        const digiSigDeclarationIppName = innerDoc.getElementById('digitalsign-DeclarationIppname');
        if (digiSigDeclarationIppName != null) {
          digiSigDeclarationIppName.value = '';
        }
        const digiSigClientStateSig = innerDoc.getElementById('digitalsign-clntstatesign-1');
        if (digiSigClientStateSig != null) {
          digiSigClientStateSig.value = '';
        }
        const digiSigClientNameForm31 = innerDoc.getElementById('digitalsign-clientnameform3');
        if (digiSigClientNameForm31 != null) {
          digiSigClientNameForm31.value = '';
        }
        const digiSigClientSigForm31 = innerDoc.getElementById('digitalsign-clientsignatureform3');
        if (digiSigClientSigForm31 != null) {
          digiSigClientSigForm31.value = '';
        }
        const digiSigSpouseNameForm3 = innerDoc.getElementById('digitalsign-spousenameform3');
        if (digiSigSpouseNameForm3 != null) {
          digiSigSpouseNameForm3.value = '';
        }
        const digiSigSpouseSigForm3 = innerDoc.getElementById('digitalsign-spousesignatureform3');
        if (digiSigSpouseSigForm3 != null) {
          digiSigSpouseSigForm3.value = '';
        }
        const digiSigClientForm3 = innerDoc.getElementById('digitalsign-signatureofclientform3');
        if (digiSigClientForm3 != null) {
          digiSigClientForm3.value = '';
        }
      }

      // when approved by advisor
      if (!this.factFinderHistoryObj.approvedByAdvisor) {
        // form 1
        const digiSigFarTimestamp = innerDoc.getElementById('digitalsign-Fartimestamp');
        if (digiSigFarTimestamp != null) {
          digiSigFarTimestamp.value = '';
        }

        const digiSigFarName = innerDoc.getElementById('digitalsign-Farname');
        if (digiSigFarName != null) {
          digiSigFarName.value = '';
        }

        const digiSigFarSig = innerDoc.getElementById('digitalsign-farsignauture');
        if (digiSigFarSig != null) {
          digiSigFarSig.value = '';
        }

        // form 2
        const digiSigIppFarSig = innerDoc.getElementById('digitalsign-IPPFAFARName&Signature/Date');
        if (digiSigIppFarSig != null) {
          digiSigIppFarSig.value = '';
        }

        // form 3
        const digiSigFarNameForm3 = innerDoc.getElementById('digitalsign-Farnameform3');
        if (digiSigFarNameForm3 != null) {
          digiSigFarNameForm3.value = '';
        }
        const digiSigFarSigForm3 = innerDoc.getElementById('digitalsign-farsignautureform3');
        if (digiSigFarSigForm3 != null) {
          digiSigFarSigForm3.value = '';
        }
      }

      // when approved by manager
      if (!this.factFinderHistoryObj.approvedByAdvisor) {

        const digiSigManagerForm1 = innerDoc.getElementById('digitalsign-managername');
        if (digiSigManagerForm1 != null) {
          digiSigManagerForm1.value = '';
        }

        const digiSigManagerSigForm1 = innerDoc.getElementById('digitalsign-managersign');
        if (digiSigManagerSigForm1 != null) {
          digiSigManagerSigForm1.value = '';
        }

        // form 2
        const digiSigManagerForm2 = innerDoc.getElementById('digitalsign-Managernamefomr2');
        if (digiSigManagerForm2 != null) {
          digiSigManagerForm2.value = '';
        }

        const digiSigManagerNameSignature = innerDoc.getElementById('digitalsign-ManagerName&Signature/Date');
        if (digiSigManagerNameSignature != null) {
          digiSigManagerNameSignature.value = '';
        }

        const digiSigFollupManagerSign = innerDoc.getElementById('digitalsign-Followupmanagersign');
        if (digiSigFollupManagerSign != null) {
          digiSigFollupManagerSign.value = '';
        }

        const digiSigManagersignform3 = innerDoc.getElementById('digitalsign-managersignform3');
        if (digiSigManagersignform3 != null) {
          digiSigManagersignform3.value = '';
        }

        const digiSigManagernameform3 = innerDoc.getElementById('digitalsign-managernameform3');
        if (digiSigManagernameform3 != null) {
          digiSigManagernameform3.value = '';
        }
      }
    }
  }

  /** To get html text */
  getHtmlText() {
    // remove event listener
    this.removeEventListenerToAddMoreButton();
    this.removeEventListenerToRemoveButton();
    // remove buttons
    this.removeDomAddMoreButtons();
    this.removeDomRemoveButtons();

    const iframe = document.getElementById('iframeId');
    const innerDoc = (iframe['contentDocument']) ? iframe['contentDocument'] : iframe['contentWindow'].document;
    const outerHtml = innerDoc.documentElement.outerHTML;
    const htmlDocType = '<!DOCTYPE html>';
    const finalHtmlDoc = htmlDocType + '\n' + outerHtml;
    return finalHtmlDoc;
  }

  /**
   * To get fact finder html template doc
   */
  getFactFinderHtmlDoc() {
    this.closePdfPreviewModal();
    this.openFactFinderFormModal();
    setTimeout(() => {
      this.generateFactFinderLoader = true;
      const url = this.factFinderDocPath;
      this.loadHtmlTemplate(url);
    }, 300);
  }

  /**
   * Fact finder update functionality
   */

  /**
   * To open fact finder review form modal
   */
  openReviewFormModal() {
    // tslint:disable-next-line:max-line-length
    this.reviewFormModalRef = this.modalService.show(this.reviewFormModal, Object.assign({}, this.modalConfig.config, {class: 'modal-md'}));

  }

  /**
   * To close fact finder review form modal
   */
  closeReviewFormModal() {
    if (this.reviewFormModalRef) {
      this.reviewFormModalRef.hide();
      this.reviewFormModalRef = null;
    }
  }

  /**
   * To write review to advisor while approving fact finder
   */
  writeReviewToAdvisor() {
    if (!this.remarksModalText || this.remarksModalText === '') {
      this.openReviewFormModal();
    } else {
      this.updateHtmlFormData();
    }
  }

  /** To update fact finder form */
  prepareUpdateFactFinderFormRequest() {
    let requestData: any = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    requestData[CommonConstant.PLAIN_ID] = this.factFinderHistoryObj[CommonConstant.PLAIN_ID];
    requestData[CommonConstant.REQUEST_TYPE] = CommonConstant.CLIENT_TO_ADVISOR;

    const innerDoc = this.getFrameInnerDoc();
    const dynamicInputFields = innerDoc.querySelectorAll('input[id^="dynamicInputField"]');
    if (dynamicInputFields.length > 0) {
      requestData[CommonConstant.HTML_DOC] = this.getHtmlText();
    } else {
      requestData[CommonConstant.HTML_DOC] = null;
    }
    requestData[CommonConstant.FIELDS] = this.getDocData();

    if (this.remarksModalText) {
      requestData[CommonConstant.REMARKS] = this.remarksModalText;
    } else {
      requestData[CommonConstant.REMARKS] = '';
    }
    requestData = JSON.stringify(requestData);
    return requestData;
  }

  /** To update fact finder form data */
  updateHtmlFormData() {
    // console.log(requestData);
    const requestData = this.prepareUpdateFactFinderFormRequest();
    this.closeReviewFormModal();

    if (requestData) {
      this.updateFactFinderLoader = true;
      this.factFinderService.updateFactFinderFormData(requestData).subscribe(
        res => {
          this.updateFactFinderLoader = false;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.closeFactFinderFormModal();
            this.getFactFinderHistory();
          } else {
            this.openCommonNotificationModal(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          this.updateFactFinderLoader = false;
          this.openCommonNotificationModal();
        }
      )
    }
  }

  /**
   * Approve functionality
   */
  /** To open otp moda */
  openOtpModal() {
    this.otpModalRef = this.modalService.show(this.otpModal, Object.assign({}, this.modalConfig.config, {class: 'modal-sm'}));
  }

  /** To close otp modal */
  closeOtpModal() {
    if (this.otpModalRef) {
      this.otpModalRef.hide();
      this.otpModalRef = null;
    }
  }

  /**
   * send OTP to the client to approve fact finder statement
   * @param any statement
   */
  sendOtpToClient(statement: any) {
    if (statement) {
      this.otpObj[CommonConstant.PLAIN_ID] = statement[CommonConstant.PLAIN_ID];

      let requestData: any = {};
      requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
      requestData[CommonConstant.PLAIN_ID] = statement[CommonConstant.PLAIN_ID];
      requestData[ClientConstant.CLIENT_NAME] = statement[ClientConstant.CLIENT_NAME];

      requestData = JSON.stringify(requestData);
      // this.sendOtpLoader = true;
      this.loaderService.show();
      this.factFinderService.sendOtpForApproval(requestData).subscribe(
        res => {
          // this.sendOtpLoader = false;
          this.loaderService.hide();
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.otpObj.message = res[CommonConstant.MESSAGE];
            setTimeout(() => {
              this.openOtpModal();
            }, 200);
          } else {
            this.openCommonNotificationModal(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          // this.sendOtpLoader = false;
          this.loaderService.hide();
          this.openCommonNotificationModal();
        }
      )
    }
  }

  /**
   * Verify otp to approve fact finder statement
   * @param any otpObj
   */
  verifyOtp(otpObj: any) {
    document.getElementById('otpErrorPass').innerHTML = '';
    const otp = otpObj.verify_otp;
    let requestData: any = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    requestData[CommonConstant.OTP] = otp;
    requestData[CommonConstant.PLAIN_ID] = this.otpObj[CommonConstant.PLAIN_ID];
    requestData = JSON.stringify(requestData);

    if (otp) {
      // this.verifyOtpLoader = true;
      this.loaderService.show();
      this.factFinderService.verifAndApprove(requestData).subscribe(
        res => {
          // this.verifyOtpLoader = false;
          this.loaderService.hide();
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.closeOtpModal();
            this.getFactFinderHistory();
            this.openCommonNotificationModal(res[CommonConstant.MESSAGE]);
          } else {
            document.getElementById('otpErrorPass').innerHTML = res[CommonConstant.MESSAGE];
          }
        },
        error => {
          // this.verifyOtpLoader = false;
          this.loaderService.hide();
          document.getElementById('otpErrorPass').innerHTML = 'Something went wrong..Please try again';
          this.notificationComponent.openComonNotificationModal();
        }
      )
    }
  }

  /**
   * To get inner frame doc object
   */
  getFrameInnerDoc() {
    const iframe = document.getElementById('iframeId');
    const innerDoc = (iframe['contentDocument']) ? iframe['contentDocument'] : iframe['contentWindow'].document;
    return innerDoc;
  }

  /** To get random uuid */
  guid() {
    return this.s4() + this.s4();
  }

  /** To generate random uuid */
  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  /** Toggle text of the button */
  generateRemoveButton() {
    const element = document.createElement('button');
    element.setAttribute('type', 'button');
    element.setAttribute('id', 'removeButton' + this.guid());
    element.innerHTML = 'Remove';
    return element;
  }

  /**
   * To generate input element
   */
  generateInputElement() {
    const element = document.createElement('input');
    element.setAttribute('type', 'text');
    element.setAttribute('id', 'dynamicInputField' + this.guid());
    element.setAttribute('value', '');
    element.className = 'ifmainput';
    element.setAttribute('placeholder', '$');
    return element;
  }

  /** To generate button element */
  generateAddMoreButton() {
    const element = document.createElement('button');
    element.setAttribute('type', 'button');
    element.setAttribute('id', 'addMoreButton' + this.guid());
    element.innerHTML = 'Add More';
    return element;
  }

  /**
   * To remove table row
   * @param any event
   */
  removeTableRow(event: any) {
    const currentTarget = event.target;
    const id = currentTarget['id'];
    const innerDoc = this.getFrameInnerDoc();
    const table = (<HTMLTableElement>(<HTMLInputElement>currentTarget).closest('table'));
    if ((<HTMLTableRowElement>innerDoc.getElementById(id)) !== null) {
      const closestRow = (<HTMLTableRowElement>innerDoc.getElementById(id).closest('tr')).rowIndex;
      table.deleteRow(closestRow);
      table.deleteRow(closestRow - 1);
    }
  }

  /** Add event listener to the remove buttons */
  addEventListenerToRemoveButton() {
    this.removeEventListenerToRemoveButton();
    const innerDoc = this.getFrameInnerDoc();
    const removeButtons = innerDoc.querySelectorAll('button[id^="removeButton"]');
    for (let index = 0; index < removeButtons.length; index++) {
      const element = removeButtons[index];
      element.addEventListener('click', this.removeTableRow.bind(this), false);
    }
  }

  /** remove event listener to the remove buttons */
  removeEventListenerToRemoveButton() {
    const innerDoc = this.getFrameInnerDoc();
    const removeButtons = innerDoc.querySelectorAll('button[id^="removeButton"]');
    for (let index = 0; index < removeButtons.length; index++) {
      const element = removeButtons[index];

      if (element.removeEventListener) {                   // For all major browsers, except IE 8 and earlier
        element.removeEventListener('click', this.removeTableRow.bind(this), false);
      } else if (element['detachEvent']) {                    // For IE 8 and earlier versions
        element['detachEvent']('click', this.removeTableRow.bind(this), false);
      }
    }
  }

  /** Add event listener to the add more buttons */
  addEventListenerToAddMoreButtons() {
    const innerDoc = this.getFrameInnerDoc();
    const addMoreButtons = innerDoc.querySelectorAll('button[id^="addMoreButton"]');
    for (let index = 0; index < addMoreButtons.length; index++) {
      const element = addMoreButtons[index];
      element.addEventListener('click', this.addMoreRow.bind(this), false);
    }
  }

  /** Add remove listener to the add more buttons */
  removeEventListenerToAddMoreButton() {
    const innerDoc = this.getFrameInnerDoc();
    const addMoreButtons = innerDoc.querySelectorAll('button[id^="addMoreButton"]');
    for (let index = 0; index < addMoreButtons.length; index++) {
      const element = addMoreButtons[index];
      if (element.removeEventListener) {                   // For all major browsers, except IE 8 and earlier
        element.removeEventListener('click', this.addMoreRow.bind(this), false);
      } else if (element['detachEvent']) {                    // For IE 8 and earlier versions
        element['detachEvent']('click', this.addMoreRow.bind(this), false);
      }
    }
  }

  /**
   * To add a row
   * @param any event
   */
  addMoreRow(event) {
    const buttonElement = event.target;
    const closetRowElement = (<HTMLInputElement>buttonElement).closest('tr');
    const closetRowElementIndex = (<HTMLTableRowElement>(<HTMLInputElement>buttonElement).closest('tr')).rowIndex;
    const table = (<HTMLInputElement>buttonElement).closest('table');
    const firstRow = (<HTMLTableElement>table).insertRow(closetRowElementIndex);
    const cell1 = firstRow.insertCell(0);
    cell1.innerHTML = '';
    const cell2 = firstRow.insertCell(1).appendChild(this.generateInputElement());
    const cell3 = firstRow.insertCell(2).appendChild(this.generateInputElement());

    // second row
    const secondRow = (<HTMLTableElement>table).insertRow(closetRowElementIndex + 1);
    const cell4 = secondRow.insertCell(0);
    cell4.innerHTML = '';
    const cell5 = secondRow.insertCell(1);
    cell5.innerHTML = '';
    const cell6 = secondRow.insertCell(2);
    cell6.style.textAlign = 'right';
    cell6.appendChild(this.generateRemoveButton());

    // add listener to remove buttons
    this.addEventListenerToRemoveButton();
  }

  /**
   * To generate add more button element
   */
  generateAddMoreButtons() {
    const innerDoc = this.getFrameInnerDoc();
    const tr = innerDoc.querySelectorAll('tr[id^="addMoreWealth"]');
    for (let index = 0; index < tr.length; index++) {
      const rowElement = tr[index];
      const rowIndex = rowElement['rowIndex'];

      const table = rowElement.closest('table');
      const newRow = (<HTMLTableElement>table).insertRow(rowIndex + 1);
      const cell1 = newRow.insertCell(0);
      cell1.innerHTML = '';
      const cell2 = newRow.insertCell(1);
      cell2.innerHTML = '';
      const cell3 = newRow.insertCell(2);
      cell3.style.textAlign = 'right';
      cell3.appendChild(this.generateAddMoreButton());
    }
    // add click event listener to add more buttons
    this.addEventListenerToAddMoreButtons();
  }

  /** To remove add more buttons */
  removeDomAddMoreButtons() {
    const innerDoc = this.getFrameInnerDoc();
    const addMoreButtons = innerDoc.querySelectorAll('button[id^="removeButton"]');
    for (let index = 0; index < addMoreButtons.length; index++) {
      const element = addMoreButtons[index];
      const row = element.closest('tr');
      if (row) {
        row.remove();
      }
    }
  }

  /**
   * To remove buttons
   */
  removeDomRemoveButtons() {
    const innerDoc = this.getFrameInnerDoc();
    const addMoreButtons = innerDoc.querySelectorAll('button[id^="addMoreButton"]');
    for (let index = 0; index < addMoreButtons.length; index++) {
      const element = addMoreButtons[index];

      const row = element.closest('tr');
      if (row) {
        row.remove();
      }
    }
  }

}
