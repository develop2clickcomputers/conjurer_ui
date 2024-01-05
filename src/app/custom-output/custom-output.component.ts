import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../shared/common/modal.config';

import { CommonHttpAdapterService } from '../adapters/common-http-adapter.service';
import { CustomOutputService } from './custom-output.service';
import { CommonConstant } from '../constants/common/common.constant';
import { FormHelper } from '../helpers/form/form.helper';
import { CommonNotificationComponent } from '../shared/notification.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { fieldType } from './custom-outout';
import { DeleteComponent } from '../shared/delete/delete.component';

/**
 * Custom header component class
 */
@Component({
  selector: 'app-custom-output',
  templateUrl: './custom-output.component.html',
  styleUrls: ['./custom-output.component.css']
})
export class CustomOutputComponent implements OnInit, OnDestroy {

  /** Available header modal reference */
  @ViewChild('availableHeaderModal', {static: false}) availableHeaderModal: TemplateRef<any>;

  /** Output type modal reference */
  @ViewChild('outputTypeModal', {static: false}) outputTypeModal: TemplateRef<any>;

  /** New header modal reference */
  @ViewChild('newHeaderModal', {static: false}) newHeaderModal: TemplateRef<any>;

  /** Delete modal reference */
  @ViewChild('deleteModal', {static: false}) deleteModal: TemplateRef<any>;

  /** Import header modal reference */
  @ViewChild('importHeaderFieldModal', {static: false}) importHeaderFieldModal: TemplateRef<any>;

  /** View Custom Header output modal reference */
  @ViewChild('viewCustomHeaderOutputModal', {static: false}) viewCustomHeaderOutputModal: TemplateRef<any>;

  /** Delete component reference */
  @ViewChild('deleteComponent', {static: false}) private deleteComponent: DeleteComponent;

  /** Notification component reference */
  @ViewChild('notificationComponent', {static: false}) private notificationComponent: CommonNotificationComponent

  availableHeaderModalRef: BsModalRef;
  outputTypeModalRef: BsModalRef;
  newHeaderModalRef: BsModalRef;
  delModalRef: BsModalRef;
  importHeaderFieldModalRef: BsModalRef;

  headerGroupSelectionForm: FormGroup;
  outputTypeForm: FormGroup;
  newHeaderForm: FormGroup;
  importHeaderFieldForm: FormGroup;
  editCustomOutputHeaderFieldForm: FormGroup;

  customHeaderGroupList: any[] = [];
  tempHeaderGroupList: any[] = [];
  newHeaderGroupShow = false;
  customFieldsList: any[] = [];
  pimoneyFieldsList: any[] = [];
  headerObj: any = {};
  fieldTypeList: any[];

  addHeaderDataLoading = false;
  displayCustomFieldTable = false;
  delDataLoading = false;
  importHeaderFieldDataLoading = false;
  deleteCustomFieldDataLoading = false;
  addheaderFieldAction = false;
  addheaderFieldEditAction = false;
  outputHeaderAction = 'add';
  fieldType: string;

  // custom header delete declaration
  viewCustomHeaderOutputModalRef: BsModalRef;
  disableSubmitButton = false;
  disableSubmitButtonForEditField = false;

  /**
   * Class dependencies
   * @param CommonHttpAdapterService commonHttpAdapterService
   * @param BsModalService bsModalService
   * @param ModalConfig modalConfig
   * @param FormBuilder _fb
   * @param CustomOutputService customOutputService
   * @param RxJSHelper rxjsHelper
   * @param FormHelper formHelper
   * @param Ng4LoadingSpinnerService loaderService
   */
  constructor(
    private commonHttpAdapterService: CommonHttpAdapterService,
    private bsModalService: BsModalService,
    private modalConfig: ModalConfig,
    private _fb: FormBuilder,
    private customOutputService: CustomOutputService,
    private rxjsHelper: RxJSHelper,
    private formHelper: FormHelper,
    private loaderService: Ng4LoadingSpinnerService
  ) { }

  /** @ignore */
  ngOnInit() {
    this.getFieldTypes();
    this.createHeaderGroupSelectionForm();
    this.createOutputTypeForm();
    this.createNewHeaderForm();
    this.createCustomOutputHeaderGroupFieldForm();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();

    this.closeModals();
  }

  /** To close all the modals */
  closeModals() {
    this.closeAvailableHeaderModal();
    this.closeDeleteModal();
    this.closeImportHeaderFieldModal();
    this.closeNewHeaderModal();
    this.closeOutputTypeModal();
  }

  /** To get fields type */
  getFieldTypes() {
    this.fieldTypeList = fieldType;
  }

  /**
   * To open notification modal
   * @param string message
   */
  openCommonNotificationModal(message?: string) {
    if (!this.notificationComponent.modalRef) {
      if (message) {
        this.notificationComponent.notificationMessage = message;
      } else {
        this.notificationComponent.notificationMessage = 'Something went wrong..Please try again';
      }
      this.notificationComponent.openComonNotificationModal();
    }
  }

  /** To get custom headers */
  getCustomHeaders() {
    let requestData: any = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    requestData = JSON.stringify(requestData);
    this.loaderService.show();
    this.customOutputService.getCustomHeaderList(requestData).subscribe(
        res => {
          this.loaderService.hide();
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.tempHeaderGroupList = res[CommonConstant.DATA];
            if (this.outputHeaderAction === 'edit') {
              this.openAvailableHeaderModal();
            } else if (this.outputHeaderAction === 'import') {
              this.openImportHeaderFieldModal();
            } else if (this.outputHeaderAction === 'deleteCustomHeader') {
              this.openViewCustomHeaderOutputModal();
            }
          } else {
            this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          this.loaderService.hide();
          this.notificationComponent.openNotificationModal('Error getting custom headers..Please after some time');
        }
      )
  }

  /** Create header group selection form */
  createHeaderGroupSelectionForm() {
    return this.headerGroupSelectionForm = this._fb.group({
      fieldType: [''],
      headerGroup: ['']
    });
  }

  /** To open openAvailableHeaderModal */
  prepareCustomHeaderFunctionality() {
    this.addheaderFieldEditAction = true;
    this.outputHeaderAction = 'edit';
    this.getCustomHeaders();
  }

  /**
   * To open modal
   */
  openAvailableHeaderModal() {
    this.createCustomOutputHeaderGroupFieldForm();
    this.availableHeaderModalRef =
      this.bsModalService.show(this.availableHeaderModal, Object.assign({}, this.modalConfig.config, {class: 'modal-lg'}))
  }

  /**
   * To close modal
   */
  closeAvailableHeaderModal() {
    if (this.availableHeaderModalRef) {
      this.availableHeaderModalRef.hide();
      this.availableHeaderModalRef = null;
    }
    this.customFieldsList = [];
    this.displayCustomFieldTable = false;
    this.addheaderFieldEditAction = false;
    this.customHeaderGroupList = [];
  }

  /** On field type change */
  onFieldTypeSelect() {
    const fieldType = this.editCustomOutputHeaderFieldForm.get('fieldType').value;
    if (fieldType) {
      // filter customeHeader List
      this.customHeaderGroupList = [];
      this.editCustomOutputHeaderFieldForm.patchValue({
        headerGroup: ''
      });

      this.customHeaderGroupList = this.tempHeaderGroupList.filter((gr) => {
        return gr.fieldType === fieldType;
      });
    } else {
      this.customHeaderGroupList = [];
    }
  }

  /** On selection */
  onSelectionChange() {
    const fieldType = this.editCustomOutputHeaderFieldForm.get('fieldType').value;
    const headerGroup = this.editCustomOutputHeaderFieldForm.get('headerGroup').value;
    if (fieldType && headerGroup) {
      this.fieldType = fieldType;
      this.getPimoneyFields(fieldType, headerGroup, 'edit');
    } else {
      this.displayCustomFieldTable = false;
      this.customFieldsList = [];
      // clear form data
      this.fieldType = '';
      this.clearEditCustomerHeaderGroupFieldForm(); // clear form
    }
  }

  /** To clear form data */
  clearEditCustomerHeaderGroupFieldForm() {
    const editHeaderFieldFormControlArray = <FormArray>this.editCustomOutputHeaderFieldForm.controls['headerList'];
    this.formHelper.clearFormArray(this.editCustomOutputHeaderFieldForm, 'headerList');
    setTimeout(() => {
      editHeaderFieldFormControlArray.push(this.initHeaderFields());
    }, 200);
  }

  /**
   * Edit header
   * @param any customField
   */
  prepareEditAvailableHeader(customField) {
    this.addheaderFieldEditAction = true;
    const fieldType = customField['fieldType'];
    if (!fieldType) {
      this.notificationComponent.openNotificationModal('Type can not be null');
      return;
    }
    this.fieldType = fieldType;
    const headerGroup = customField['instName'];
    if (!headerGroup) {
      this.notificationComponent.openNotificationModal('Header group can not be null');
      return;
    }
    if (fieldType && headerGroup) {
      this.getPimoneyFields(fieldType, headerGroup, 'edit');
    }
  }

  /**
   * Delete available header
   * @param any customField
   * @param number index
   */
  prepareDeleteAvailableHeader(customField, index) {
    this.headerObj['index'] = index;
    this.headerObj['field'] = customField;
    this.openDeleteModal();
  }

  /**
   * To open delete modal
   */
  openDeleteModal() {
    this.delModalRef = this.bsModalService.show(this.deleteModal,
      Object.assign({}, this.modalConfig.config, { class: 'modal-sm deleteTransconfModal' }));
  }

  /** To close delete modal */
  closeDeleteModal() {
    if (this.delModalRef) {
      this.delModalRef.hide();
      this.delModalRef = null;
      this.addheaderFieldEditAction = false;
    }
  }

  /** Delete header field */
  deleteItem() {
    let requestData: any = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    const data: any = {};
    const fieldArray: any[] = [];
    data[CommonConstant.PLAIN_ID] = this.headerObj['field'][CommonConstant.PLAIN_ID];
    fieldArray.push(data);
    if (fieldArray.length > 0) {
      requestData[CommonConstant.FIELDS] = fieldArray;
    } else {
      requestData[CommonConstant.FIELDS] = [];
    }
    // set data to form
    this.headerGroupSelectionForm.patchValue({
      fieldType: this.headerObj['field']['fieldType'],
      headerGroup: this.headerObj['field']['instName']
    })

    requestData = JSON.stringify(requestData);
    if (Object.keys(requestData).length > 0) {
      this.deleteCustomFieldDataLoading = true;
      this.loaderService.show();
      this.customOutputService.deleteCustomeHeaders(requestData).subscribe(
          res => {
            this.loaderService.hide();
            this.deleteCustomFieldDataLoading = false;
            if (res[CommonConstant.ERROR_CODE] === 0) {
              const index = this.headerObj['index'];
              // remove deleted data form list
              this.customFieldsList.splice(index, 1);
              this.closeDeleteModal();
              this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
            } else {
              this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
            }
          },
          error => {
            this.loaderService.hide();
            this.deleteCustomFieldDataLoading = false;
            this.notificationComponent.openNotificationModal();
          }
        )
    }
  }


  /**
   * Add output type functionality
   */
  addNewHeader() {
    this.closeAvailableHeaderModal();
    this.customFieldsList = [];
    setTimeout(() => {
      this.openOutputTypeModal();
    }, 200);
  }

  /** To create output type form */
  createOutputTypeForm() {
    return this.outputTypeForm = this._fb.group({
      fieldType: [''],
      headerGroup: [''],
      newHeaderGroup: ['']
    });
  }

  /**
   * To open Output type modal
   */
  openOutputTypeModal() {
    this.createOutputTypeForm();
    this.outputTypeModalRef =
      this.bsModalService.show(this.outputTypeModal, Object.assign({}, this.modalConfig.config, {class: 'modal-md'}))
  }

  /**
   * To close Output type modal
   */
  closeOutputTypeModal() {
    if (this.outputTypeModalRef) {
      this.outputTypeModalRef.hide();
      this.outputTypeModalRef = null;
    }
    this.addHeaderDataLoading = false;
    this.newHeaderGroupShow = false;
  }

  /**
   * On header group change in outputTypeForm
   */
  onOutputFormHeaderGroupChange() {
    const fieldType = this.outputTypeForm.get('fieldType').value;
    const headerGroup = this.outputTypeForm.get('headerGroup').value;
    if (headerGroup === 'others') {
      this.newHeaderGroupShow = true;
    } else {
      this.newHeaderGroupShow = false;
    }
  }

  /**
   * To get pimoney header fields
   * @param fieldType
   * @param headerGroup
   * @param flag
   */
  getPimoneyFields(fieldType, headerGroup, flag?) {
    let requestData: any = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    requestData['fieldType'] = fieldType;
    requestData['headerGroup'] = headerGroup;
    requestData = JSON.stringify(requestData);

    this.importHeaderFieldDataLoading = true;
    this.addHeaderDataLoading = true;
    this.loaderService.show();
    this.customOutputService.getPimoneyFields(requestData).subscribe(
        res => {
          this.loaderService.hide();
          this.addHeaderDataLoading = false;
          this.importHeaderFieldDataLoading = false;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            const resData = res[CommonConstant.DATA];

            this.closeOutputTypeModal();
            this.closeImportHeaderFieldModal();
            // this.closeAvailableHeaderModal();
            setTimeout(() => {
              console.log(this.addheaderFieldEditAction);
              if (this.addheaderFieldEditAction) {
                // do nothing
              } else {
                if (!this.newHeaderModalRef) {
                  this.openNewHeaderModal();
                }
              }
              this.setHeaderFormData(fieldType, headerGroup, resData, flag);
            }, 200);
          } else {
            this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          this.loaderService.hide();
          this.addHeaderDataLoading = false;
          this.importHeaderFieldDataLoading = false;
          this.notificationComponent.openNotificationModal();
        }
      )
  }

  /**
   * To go to headerModal
   */
  proceedToHeaderModal() {
    // this.closeOutputTypeModal();
    document.getElementById('outputTypeErrorMsg').innerHTML = '';

    const fieldType = this.outputTypeForm.get('fieldType').value;
    if (!fieldType) {
      document.getElementById('outputTypeErrorMsg').innerHTML = 'Type can not be null';
      return;
    }
    this.fieldType = fieldType;
    /* const headerGroup = this.outputTypeForm.get('headerGroup').value;
    if (!headerGroup) {
      document.getElementById('outputTypeErrorMsg').innerHTML = 'Header group can not be null';
      return;
    } */
    const headerGroup = 'pimoney';
    if (fieldType && headerGroup) {
      const newHeaderGroup = this.outputTypeForm.get('newHeaderGroup').value;
      if (!newHeaderGroup) {
        document.getElementById('outputTypeErrorMsg').innerHTML = 'New Header group name can not be null';
        return;
      }
      this.getPimoneyFields(fieldType, headerGroup);
    }
  }

  /**
   * Add new Header functionality
   */
  /**
   * To header new header form
   */
  createNewHeaderForm() {
    return this.newHeaderForm = this._fb.group({
      id: [''],
      fieldType: [''],
      headerGroup: [''],
      headerList: this._fb.array([
        this.initHeaderFields()
      ])
    });
  }

  /**
   * To initialize header fields
   */
  private initHeaderFields(element?) {
    if (element) {
      if (typeof element === 'object') {
        return this._fb.group({
          id: element[CommonConstant.PLAIN_ID],
          existingHeader: element['fieldName'],
          description: element['description'],
          outputHeader: element['header'],
          columnIndex: element['columnIndex'],
          defaultValue: element['defaultValue'],
          colIndexCheck: false
        });
      }
    }
    return this._fb.group({
      existingHeader: [''],
      description: [''],
      outputHeader: [''],
      columnIndex: [''],
      defaultValue: [''],
      colIndexCheck: [false]
    });
  }

  /**
   * To open newHeaderModal
   */
  openNewHeaderModal() {
    this.newHeaderModalRef =
      this.bsModalService.show(this.newHeaderModal, Object.assign({}, this.modalConfig.config, {class: 'modal-lg'}))
  }

  /**
   * To close newHeaderModal
   */
  closeNewHeaderModal() {
    if (this.newHeaderModalRef) {
      this.newHeaderModalRef.hide();
      this.newHeaderModalRef = null;

      this.addheaderFieldEditAction = false;
    }
  }

  /**
   * To set header form data in newheaderForm
   * @param fieldType
   * @param headerGroup
   * @param resData
   * @param flag
   */
  setHeaderFormData(fieldType, headerGroup, resData, flag?) {
    const formControlArray = <FormArray>this.newHeaderForm.controls['headerList'];
    // set form data
    if (!flag) {
      this.addheaderFieldAction = true;
      const newHeaderGroup = this.outputTypeForm.get('newHeaderGroup').value;
      this.newHeaderForm.patchValue({
        fieldType: fieldType,
        headerGroup: newHeaderGroup
      })

      this.formHelper.clearFormArray(this.newHeaderForm, 'headerList');
      if (resData.length > 0) {
        resData.forEach((element) => {
          formControlArray.push(this.initHeaderFields(element));
        });
      } else {
        formControlArray.push(this.initHeaderFields());
      }
    }
    if (flag === 'edit') {
      //
      this.displayCustomFieldTable = true;
      const editHeaderFieldFormControlArray = <FormArray>this.editCustomOutputHeaderFieldForm.controls['headerList'];
      this.addheaderFieldAction = false;
      /* this.newHeaderForm.patchValue({
        fieldType: fieldType,
        headerGroup: headerGroup
      }); */

      this.formHelper.clearFormArray(this.editCustomOutputHeaderFieldForm, 'headerList');
      if (resData.length > 0) {
        resData.forEach((element) => {
          editHeaderFieldFormControlArray.push(this.initHeaderFields(element));
        });
      } else {
        editHeaderFieldFormControlArray.push(this.initHeaderFields());
      }
    }

    if (flag === 'import') {
      // do nothing

      // if fields are eligible to be edited
      if (this.addheaderFieldEditAction) {
        //
        this.addheaderFieldAction = false;
        const editHeaderFieldFormControlArray = <FormArray>this.editCustomOutputHeaderFieldForm.controls['headerList'];
        if (resData.length > 0) {
          resData.forEach((element, key) => {
            if (editHeaderFieldFormControlArray.controls[key]) {
              const existingHeader = editHeaderFieldFormControlArray.controls[key].value.existingHeader;
              if (element.fieldName === existingHeader) {
                editHeaderFieldFormControlArray.controls[key].patchValue({
                  outputHeader: element['header']
                });
              }
            }
          });
        } else {
          editHeaderFieldFormControlArray.push(this.initHeaderFields());
        }
      } else {
        this.addheaderFieldAction = true;
        if (resData.length > 0) {
          resData.forEach((element, key) => {
            const existingHeader = formControlArray.controls[key].value.existingHeader;
            if (element.fieldName === existingHeader) {
              formControlArray.controls[key].patchValue({
                outputHeader: element['header']
              });
            }
          });
        } else {
          formControlArray.push(this.initHeaderFields());
        }
      }

    }
  }

  /**
   * To remove backgroun color
   * @param form
   */
  removeBackgroundColor(form) {
    const control = <FormArray>form['controls'].headerList;
    const controlLength = form['controls'].headerList['controls'].length;

    for (let i = controlLength - 1; i >= 0; i--) {
      control.controls[i].patchValue({
        colIndexCheck: false
      });
    }
  }

  /**
   * Column index validation
   */

  /**
   * To validate new custom header fields
   */
  validateColumn(index: number) {
    this.disableSubmitButton = false;
    this.removeBackgroundColor(this.newHeaderForm['controls']);

    setTimeout(() => {
      const control = <FormArray>this.newHeaderForm['controls'].headerList;
      const controlLength = this.newHeaderForm['controls'].headerList['controls'].length;
      const col = control.controls[index].value;
      const colIndexName = col.columnIndex;
      const existingHeader = col.existingHeader;
      if (colIndexName) {
        for (let i = controlLength - 1; i >= 0; i--) {
          const tempColIndexName = control.controls[i].value.columnIndex;
          const tempExistingHeader = control.controls[i].value.existingHeader;
          if (tempColIndexName === colIndexName && tempExistingHeader !== existingHeader) {
            control.controls[index].patchValue({
              colIndexCheck: true
            });
            control.controls[i].patchValue({
              colIndexCheck: true
            });
            this.disableSubmitButton = true;
            /* const conflitHeaderName = control.controls[i].value.existingHeader;
            this.notificationComponent.openNotificationModal(`Column index conflits with ${conflitHeaderName}`); */
            break;
          }
        }
      }
    }, 200);
  }

  /**
   * To validate new custom header fields
   */
  validateEditHeaderFieldColumn(index: number) {
    this.disableSubmitButtonForEditField = false;
    this.removeBackgroundColor(this.editCustomOutputHeaderFieldForm);

    setTimeout(() => {
      const control = <FormArray>this.editCustomOutputHeaderFieldForm['controls'].headerList;
      const controlLength = this.editCustomOutputHeaderFieldForm['controls'].headerList['controls'].length;
      const col = control.controls[index].value;
      const colIndexName = col.columnIndex;
      const existingHeader = col.existingHeader;
      if (colIndexName) {
        for (let i = controlLength - 1; i >= 0; i--) {
          const tempColIndexName = control.controls[i].value.columnIndex;
          const tempExistingHeader = control.controls[i].value.existingHeader;
          if (tempColIndexName === colIndexName && tempExistingHeader !== existingHeader) {
            control.controls[index].patchValue({
              colIndexCheck: true
            });
            control.controls[i].patchValue({
              colIndexCheck: true
            });
            this.disableSubmitButtonForEditField = true;
            /* const conflitHeaderName = control.controls[i].value.existingHeader;
            this.notificationComponent.openNotificationModal(`Column index conflits with ${conflitHeaderName}`); */
            break;
          }
        }
      }
    }, 200);
  }

  /**
   * Request to add new header or edit existong header
   */
  prepareRequestToAddNewHeaderFields() {
    let newHeaderFormData;
    // to decide which form is going to be sumbmitted
    if (this.addheaderFieldEditAction) {
      newHeaderFormData = this.editCustomOutputHeaderFieldForm.getRawValue();
    } else {
      newHeaderFormData = this.newHeaderForm.getRawValue();
    }

    if (!newHeaderFormData['fieldType']) {
      this.notificationComponent.openNotificationModal('Field type can not be empty');
      return;
    }

    if (!newHeaderFormData['headerGroup']) {
      this.notificationComponent.openNotificationModal('Header group can not be empty');
      return;
    }

    let headerFieldData: any = {};
    const headerArray: any[] = [];
    headerFieldData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    headerFieldData['client'] = 'Pimoney';
    headerFieldData['fieldType'] = newHeaderFormData['fieldType'];
    headerFieldData['headerGroup'] = newHeaderFormData['headerGroup'];
    let headerObj: any = {};
    newHeaderFormData['headerList'].forEach(element => {
      headerObj = {};
      if (this.addheaderFieldAction) {
        headerObj['id'] = null;
      } else {
        headerObj['id'] = element['id'];
      }
      headerObj['fieldName'] = element['existingHeader'];
      headerObj['header'] = element['outputHeader'];
      headerObj['columnIndex'] = element['columnIndex'];
      headerObj['defaultValue'] = element['defaultValue'];

      headerArray.push(headerObj);
    });
    if (headerArray.length > 0) {
      headerFieldData[CommonConstant.FIELDS] = headerArray;
    } else {
      headerFieldData[CommonConstant.FIELDS] = [];
    }

    headerFieldData = JSON.stringify(headerFieldData);

    return headerFieldData;
  }

  /**
   * Calling rest service to add new header
   */
  submitNewHeader() {
    const requestData = this.prepareRequestToAddNewHeaderFields();
    if (requestData) {
      this.loaderService.show();
      this.customOutputService.addCustomHeaders(requestData).subscribe(
          res => {
            this.loaderService.hide();
            if (res[CommonConstant.ERROR_CODE] === 0) {
              this.closeNewHeaderModal();
              this.closeAvailableHeaderModal();
              this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
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
   * Edit custom ouput header group fields functionality
   */
  createCustomOutputHeaderGroupFieldForm() {
    return this.editCustomOutputHeaderFieldForm = this._fb.group({
      id: [''],
      fieldType: [''],
      headerGroup: [''],
      headerList: this._fb.array([
        this.initHeaderFields()
      ])
    });
  }

  /**
   * Import header fields functionality
   */
  prepareImportHeaderFields() {
    this.createImportHeaderFieldForm();
    this.outputHeaderAction = 'import';
    this.getCustomHeaders();
  }

  /**
   * To create import header form
   */
  createImportHeaderFieldForm() {
    return this.importHeaderFieldForm = this._fb.group({
      fieldType: [''],
      headerGroup: ['']
    });
  }

  /**
   * To open importHeaderFieldModal
   */
  openImportHeaderFieldModal() {
    const fieldType = this.fieldType;
    if (fieldType) {
      // filter customeHeader List
      this.customHeaderGroupList = [];
      this.importHeaderFieldForm.patchValue({
        fieldType: fieldType
      });

      this.customHeaderGroupList = this.tempHeaderGroupList.filter((gr) => {
        return gr.fieldType === fieldType;
      });
    } else {
      this.customHeaderGroupList = [];
    }

    this.importHeaderFieldModalRef =
      this.bsModalService.show(this.importHeaderFieldModal, Object.assign({}, this.modalConfig.config, {class: 'modal-md'}))
  }
  /**
   * To close importHeaderFieldModal
   */
  closeImportHeaderFieldModal() {
    if (this.importHeaderFieldModalRef) {
      this.importHeaderFieldModalRef.hide();
      this.importHeaderFieldModalRef = null;
    }
    this.addHeaderDataLoading = false;
  }

  /** @ignore */
  onImportHeaderFieldHeaderGrChange() {

  }

  /**
   * Import header field
   */
  importHeaderFields() {
    document.getElementById('importHeaderFieldErrorMsg').innerHTML = '';

    const fieldType = this.importHeaderFieldForm.get('fieldType').value;
    if (!fieldType) {
      document.getElementById('importHeaderFieldErrorMsg').innerHTML = 'Type can not be null';
      return;
    }
    const headerGroup = this.importHeaderFieldForm.get('headerGroup').value;
    if (!headerGroup) {
      document.getElementById('importHeaderFieldErrorMsg').innerHTML = 'Header group can not be null';
      return;
    }

    if (fieldType && headerGroup) {
      this.getPimoneyFields(fieldType, headerGroup, 'import');
    }
  }

  /**
   * Delete custom header group functionality
   */
  initiateCustomHeaderDelete() {
    this.outputHeaderAction = 'deleteCustomHeader';
    this.getCustomHeaders();
  }

  /**
   * To open ViewCustomHeaderOutput
   */
  openViewCustomHeaderOutputModal() {
    if (!this.viewCustomHeaderOutputModalRef) {
      this.viewCustomHeaderOutputModalRef = this.bsModalService.show(this.viewCustomHeaderOutputModal, Object.assign({},
          this.modalConfig.config, {class: 'modal-md'}));
    }
  }

  /** To close ViewCustomHeaderOutput */
  closeViewCustomHeaderOutputModal() {
    if (this.viewCustomHeaderOutputModalRef) {
      this.viewCustomHeaderOutputModalRef.hide();
      this.viewCustomHeaderOutputModalRef = null;
    }
  }

  /**
   * To delete header field
   * @param any header
   */
  deleteCustomHeader(header) {
    this.deleteComponent.requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    this.deleteComponent.requestData['headerGroupId'] = header[CommonConstant.PLAIN_ID];
    this.deleteComponent.requestData['apiName'] = 'deleteHeaderMap';

    this.deleteComponent.openDeleteModal();
  }

  /**
   * On delete success
   * @param any event
   */
  onDeleteEvent(event) {
    if (event) {
      setTimeout(() => {
        this.getCustomHeaders();
      }, 300);
    }
  }

}
