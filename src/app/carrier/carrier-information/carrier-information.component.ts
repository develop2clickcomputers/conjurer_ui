import { Component, OnInit, ViewChild, TemplateRef, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../../shared/common/modal.config';

import { CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';
import { CommonService } from '../../services/common/common.service';
import { DropdownComponent } from '../../shared/dropdown/dropdown.component';

import { contacts } from './carrier.interface';
import { CarrierInformationService } from './carrier-information.service';
import { CommonConstant } from '../../constants/common/common.constant';
import { CarrierConstant } from '../../constants/carrier/carrier.constant';
import { CarrierHelper } from '../../helpers/carrier/carrier.helper';
import { CommonHelperService } from '../../helpers/common/common.helper';
import { FormHelper } from '../../helpers/form/form.helper';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { CommonNotificationComponent } from '../../shared/notification.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

/** Jquery declaration */
declare var $: any;

/**
 * Carrier Information Component Class
 */
@Component({
  selector: 'app-carrier-information',
  templateUrl: './carrier-information.component.html',
  styleUrls: ['./carrier-information.component.css'],
  providers: [
    CarrierInformationService, CommonHttpAdapterService,
    CommonService, CommonHelperService, FormHelper,
    RxJSHelper
  ]
})
export class CarrierInformationComponent implements OnInit, OnDestroy {

  /** Address modal details component reference */
  @ViewChild('addressDetailsModal') addressDetailsModal: TemplateRef<any>;

  /** Carrier meta data delete modal reference */
  @ViewChild('carrierDataDeleteModal') carrierDataDeleteModal: TemplateRef<any>;

  /** Dropdown component reference */
  @ViewChild('dropdownComponent') dropdownComponent: DropdownComponent;

  /** Notification component reference */
  @ViewChild('notificationComponent') notificationComponent: CommonNotificationComponent;

  public carrierFlag = 'carrierFlag';
  private contactObj: any = {};
  public contactInfoForm: FormGroup;
  private contacts = contacts;
  public carriers: Array<any> = [];
  public carrierInformation: any = {};
  private carrierIndex: number;
  private imageFile: any = {};
  public phoneTypeList: Array<any> = [];
  public addressTypeList: Array<any> = [];
  public countryList: Array<any> = [];

  showCarrierName = true;
  showCarrierAbbr = true;
  contactEmailShow = true;

  contactInfoDataLoading = false;
  carrierFormButton = false;

  carrierInfoFetchErrorFlag = false;
  carrierInfoPageShow = false;
  carrierInfoCount = false;
  showFilterQuad = true;

  public addressModalRef: BsModalRef;
  public phoneNumberModalRef: BsModalRef;
  public emailModalRef: BsModalRef;
  public contactPersonModalRef: BsModalRef;
  public carrierMetaDataModalRef: BsModalRef;
  public carrierDataDeleteModalRef: BsModalRef;
  public modalRef: BsModalRef;

  private deleteIndex: number;
  private deleteChildIndex: number;
  private deleteFormArrayType;
  private deleteChildFormArrayType;

  private dropdownListType: any;
  showCarrierList = true;

  // scraped insurance data
  scrapedInsuranceData: any[] = [];
  insuranceData: any[] = [];
  // This flag is used to differentiate the carrier
  // Whether a carrier is of everest platform or other
  carrierDisplayFlag = false;
  scrapedInstutionList: any[] = [];
  scrapedInsuranceBranchData: any[] = [];
  branchObj: Object = {};
  displayAccountPage = false;
  overviewError = false;

  // Filters
  public carrierName = '';
  public carrierCountry = '';
  carrierNameFilterList: string[] = [];
  carrierAbbrFilterList: string[] = [];
  carrierCountryFilterList: string[] = [];
  carrierTypeFilterList: string[] = [];

  // multi filter array declarations
  Filter: any = {
    carrierName: [],
    carrierAbbr: [],
    countryName: []
  };

  /** @ignore */
  constructor(
    private titleService: Title,
    private _fb: FormBuilder,
    private carrierInfoService: CarrierInformationService,
    private carrierHelper: CarrierHelper,
    private router: Router,
    private modalService: BsModalService,
    private commonService: CommonService,
    private modalConfig: ModalConfig,
    private commonHelper: CommonHelperService,
    private formHelper: FormHelper,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private rxjsHelper: RxJSHelper,
    private domSanitizer: DomSanitizer,
    private loaderService: Ng4LoadingSpinnerService
  ) {
    /** To set title */
    this.titleService.setTitle('Conjurer | Carriers');
  }

  /** @ignore */
  ngOnInit() {
    this.carrierHelper.removePlanFlags();
    // To initialize filter object
    this.initFilterObject();

    /**To load contact form */
    this.createContactForm();
    // this.getCarrierInfo();

    // getting insurance data from aca module
    this.getInstituteDetails();
    // this.getInsuranceData();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();

    // close modals
    this.closeModals();
  }

  /**To get contact information */
  getCarrierInfo() {
    this.loaderService.show();
    this.carrierInfoService.getCarriers().subscribe(
      res => {
        this.loaderService.hide();
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.showCarrierList = true;
          this.carriers = res[CommonConstant.DATA];
          if (this.carriers.length > 0) {
            this.carrierInfoCount = false;
            this.carrierInformation = this.carriers[0];

            // To set carrier Id into session storage
            this.carrierHelper.setCarrierData(this.carriers[0]);
            // hide/show copy and create new
          } else {
            this.carrierInfoCount = true;
            // hide/show copy and create new
          }
        } else {
          console.log(res[CommonConstant.MESSAGE]);
        }
      },
      error => {
        this.loaderService.hide();
      }
    )
  }

  /**
   * To set carrier index
   * By clicking on carrier list
   * @param index
   */
  setCarrierIndex(index: number) {
    this.carrierIndex = index;
  }

  /** Go back to carrier list */
  backToCarrierList() {
    this.showCarrierList = true;
  }

  /** To get carriers */
  getCarrier(carrier, index: number) {
    if (Object.keys(carrier).length > 0) {
      this.carrierHelper.setCarrierData(carrier);
      const carrierSource = CarrierConstant.CARRIER_SOURCE_EVEREST;
      this.carrierHelper.setCarrierSourceFlag(carrierSource);

      this.setCarrierIndex(index);
      this.getCarrierDetails(carrier);
    }
  }

  /**
   * To get carrier object
   * It will be used to populate table data
   * @param carrier
   */
  getCarrierDetails(carrier) {
    if (Object.keys(carrier).length > 0) {
      const carrierId = carrier[CommonConstant.PLAIN_ID];
      this.carrierInfoService.getCarrierById(carrierId).subscribe(
        res => {
          this.showCarrierList = false;
          this.carrierDisplayFlag = true;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.carrierInfoFetchErrorFlag = false;
            this.carrierInfoPageShow = true;
            this.carrierInformation = {};
            this.carrierInformation = res[CommonConstant.DATA];
            // this.carrierHelper.setCarrierData(this.carrierInformation);
          } else {
            this.carrierInfoFetchErrorFlag = true;
          }
        },
        error => {
          this.carrierInfoFetchErrorFlag = false;
        }
        )
    }
  }

  /**To create the contact information form */
  createContactForm() {
    this.contactInfoForm = this._fb.group({
      // name: ['', [Validators.required, Validators.minLength(5)]],
      carrierName: [''],
      carrierAbbr: [''],
      carrierIcon: [''],
      iconName: [''],
      newField: [true],
      phoneNumberList: this._fb.array([
        this.formHelper.initPhoneNumber()
      ]),
      emailList: this._fb.array([
        this.formHelper.initEmailAddress()
      ]),
      addressList: this._fb.array([
        this.formHelper.initAddress(),
      ]),
      contactPersonList: this._fb.array([
        this.formHelper.initContactPerson()
      ])
    });
  }

  /**
   * To prepare request for submit and update carrier information
   */
  prepareCarrierInformationRequest() {
    const carrierFormData = this.contactInfoForm.getRawValue();

    let carrierData: any = {};
    const phoneNumberArray: Array<any> = [];
    const addressArray: Array<any> = [];
    const carrier_id = this.carrierHelper.getCarrierId();
    if (carrier_id) {
      carrierData[CarrierConstant.CARRIER_ID] = carrier_id;
    } else {
      carrierData[CarrierConstant.CARRIER_ID] = '';
    }
    carrierData[CarrierConstant.CARRIER_NAME] = carrierFormData['carrier_name'];
    carrierData[CarrierConstant.CARRIER_ABBREVATION] = carrierFormData['carrier_abbr'];
    // To attach image file
    if (Object.keys(this.imageFile).length > 0) {
      carrierData[CarrierConstant.CARRIER_ICON] = this.imageFile['file'];
    } else {
      carrierData[CarrierConstant.CARRIER_ICON] = carrierFormData['carrier_icon'];
    }
    carrierData[CommonConstant.EMAIL] = carrierFormData['email'];

    let phoneNumberObj: any = {};
    carrierFormData['phone_numbers'].forEach(element => {
      phoneNumberObj = {};
      phoneNumberObj[CommonConstant.PLAIN_ID] = element['id'];
      if (carrier_id) {
        phoneNumberObj[CarrierConstant.CARRIER_ID] = carrier_id;
      } else {
        phoneNumberObj[CarrierConstant.CARRIER_ID] = '';
      }
      phoneNumberObj[CarrierConstant.COUNTRY_CODE] = element['country_code'];
      phoneNumberObj[CarrierConstant.AREA_CODE] = element['area_code'];
      phoneNumberObj[CarrierConstant.PHONE_NUMBER] = element['number'];

      phoneNumberArray.push(phoneNumberObj);
    });
    if (phoneNumberArray.length > 0) {
      carrierData[CommonConstant.PHONE_NUMBER_LIST] = phoneNumberArray;
    } else {
      carrierData[CommonConstant.PHONE_NUMBER_LIST] = [];
    }

    let addressObj: any = {};
    carrierFormData['addresses'].forEach(element => {
      addressObj = {};
      addressObj[CommonConstant.PLAIN_ID] = element['id'];
      if (carrier_id) {
        addressObj[CarrierConstant.CARRIER_ID] = carrier_id;
      } else {
        addressObj[CarrierConstant.CARRIER_ID] = '';
      }
      addressObj[CarrierConstant.UNIT_NUMBER] = element['unit_no'];
      addressObj[CarrierConstant.ADDRESS1] = element['address1'];
      addressObj[CarrierConstant.ADDRESS2] = element['address2'];
      addressObj[CarrierConstant.CITY] = element['city'];
      addressObj[CarrierConstant.STATE] = element['state'];
      addressObj[CarrierConstant.COUNTRY] = element['country'];
      addressObj[CarrierConstant.PIN_CODE] = element['pin_code'];

      addressArray.push(addressObj);
    });
    if (addressArray.length > 0) {
      carrierData[CommonConstant.ADDRESS_LIST] = addressArray;
    } else {
      carrierData[CommonConstant.ADDRESS_LIST] = [];
    }

    carrierData = JSON.stringify(carrierData);

    return carrierData;
  }

  /**
   * Call this function to hide individual fields after any
   * operation(e.g - update, add etc)
   */
  hideIndvFieldsAfterOperation() {
    this.showCarrierName = true;
    this.showCarrierAbbr = true;
    this.contactEmailShow = true;
  }


  /**This function is used to submit the contact information */
  submitContactInfo() {
    const newCarrierData = this.prepareCarrierInformationRequest();
    if (newCarrierData) {
      this.carrierInfoService.submitContactInformation(newCarrierData).subscribe(
        res => {
          // to update carriers
          if (res[CommonConstant.STATUS] === CommonConstant.SUCCESS) {
            const res_data: any = res[CommonConstant.DATA];
            this.carriers.push(res_data);
            this.getCarrierDetails(res_data);
            this.carrierHelper.setCarrierData(res_data);
            // this.carrierHelper.setPolicyData(res_data);
          } else {
            // console.log('errrrooorrr');
          }
        },
        error => {
          console.log('Something went wrong');
        }
      )
    }
  }

  /**
   * Sidebar child change event listener
   */
  onCarrierChanged(event) {
    if (Object.keys(event).length > 0) {
      this.carrierInfoCount = false;
      this.carriers.push(event);
      this.getCarrierDetails(event);
      this.carrierHelper.setCarrierData(event);
    }
  }

  /**
   * Edit functionality
   */

  /** To read image icon */
  validateIcon(event) {
    this.readImageFile(event.target);
  }

  /** To validate files */
  readImageFile(inputValue: any): void {
    const file: File = inputValue.files[0];
    if (file) {
      const reader: FileReader = new FileReader();

      reader.onloadend = (e) => {

        const maxFileSize = 100;
        const fileSize: number = file.size / 1024;
        const fileName: string = file.name;
        const fileExtension: string = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        // tslint:disable-next-line:max-line-length
        if (fileExtension === 'gif' || fileExtension === 'png' || fileExtension === 'bmp' || fileExtension === 'jpeg' || fileExtension === 'jpg') {
          document.getElementById('carrierIconError').innerHTML = '';
          if (fileSize < maxFileSize) {
            document.getElementById('carrierIconError').innerHTML = '';
            this.imageFile = {};
            this.imageFile['name'] = fileName;
            (<HTMLImageElement>document.getElementById('profileImage')).src = String(reader['result']);
            this.imageFile['file'] = reader['result'];
            this.carrierFormButton = false;
          } else {
            this.carrierFormButton = true;
            document.getElementById('carrierIconError').innerHTML = 'File size exceeds the maximum allowable size of 100KB';
          }
        } else {
          this.carrierFormButton = true;
          document.getElementById('carrierIconError').innerHTML = 'Only GIF, PNG, JPG, JPEG and BMP allowed';
        }
      }

      reader.readAsDataURL(file);
    }
  }

  /**
   * To clear employee photo
   * @param event
   */
  clearImage(event) {
    this.imageFile = {};
    this.contactInfoForm.patchValue({
      carrierIcon: ''
    });
    document.getElementById('addCarrierInformationErrorMsg').innerHTML = '';
    document.getElementById('carrierIconError').innerHTML = '';
    (<HTMLImageElement>document.getElementById('profileImage')).src = '/assets/img/icon/insurance_logo.png';
    this.carrierFormButton = false;
  }

  /**To add phone numbers */
  addContactPerson() {
    const control = <FormArray>this.contactInfoForm.controls['contactPersonList'];
    control.push(this.formHelper.initContactPerson());
  }

  /**To remove phone numbers */
  removeContactPerson(j: number) {
    const control = <FormArray>this.contactInfoForm.controls['contactPersonList'];
    control.removeAt(j);
  }

  /**
   * To edit address fields
   * @param TemplateRef template
   * @param any address
   */
  openAddressModal(template: TemplateRef<any>, address: any) {
    // address
    const addressListControl = <FormArray>this.contactInfoForm.controls['addressList'];
    this.formHelper.clearFormArray(this.contactInfoForm, 'addressList');
    addressListControl.push(this.formHelper.initAddress(address));
    // tslint:disable-next-line:max-line-length
    this.addressModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, {class: 'modal-lg'}));
  }

  /** To close address modal */
  closeAddressModal() {
    if (this.addressModalRef) {
      this.addressModalRef.hide();
      this.addressModalRef = null;
    }
  }

  /**
   * To edit phone number fields
   * @param TemplateRef template
   * @param any phoneNumber
   */
  openPhoneNumberModal(template: TemplateRef<any>, phoneNumber: any) {
    // phone numbers
    this.formHelper.clearFormArray(this.contactInfoForm, 'phoneNumberList');
    const contactControl = <FormArray>this.contactInfoForm.controls['phoneNumberList'];
    contactControl.push(this.formHelper.initPhoneNumber(phoneNumber));
    // tslint:disable-next-line:max-line-length
    this.phoneNumberModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, {class: 'modal-lg'}));
  }

  /** To close phone number modal */
  closePhoneNumberModal() {
    if (this.phoneNumberModalRef) {
      this.phoneNumberModalRef.hide();
      this.phoneNumberModalRef = null;
    }
  }

  /**
   * To edit email fields
   * @param TemplateRef template
   * @param any email
   */
  openEmailModal(template: TemplateRef<any>, email: any) {
    // email
    this.formHelper.clearFormArray(this.contactInfoForm, 'emailList');
    const emailListControl = <FormArray>this.contactInfoForm.controls['emailList'];
    emailListControl.push(this.formHelper.initEmailAddress(email));
    // tslint:disable-next-line:max-line-length
    this.emailModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, {class: 'modal-lg'}));
  }

  /** To close email modal */
  closeEmailModal() {
    if (this.emailModalRef) {
      this.emailModalRef.hide();
      this.emailModalRef = null;
    }
  }

  /**
   * To edit email fields
   * @param TemplateRef template
   * @param any contactPerson
   */
  openContactPersonModal(template: TemplateRef<any>, contactPerson: any) {
    this.formHelper.clearFormArray(this.contactInfoForm, 'contactPersonList');
    const contactPersonControl = <FormArray>this.contactInfoForm.controls['contactPersonList'];
    if (contactPerson) {
      // contact person
      contactPersonControl.push(this.formHelper.initContactPerson(contactPerson));
      // phone number
      if (contactPerson['contactPersonContacts'].length > 0) {
        // tslint:disable-next-line:max-line-length
        const contactPhoneNumberControl = <FormArray>this.contactInfoForm.controls['contactPersonList']['controls'][0].controls['contactPhoneNumberList'];
        contactPhoneNumberControl.removeAt(0);
        contactPerson['contactPersonContacts'].forEach(element => {
          contactPhoneNumberControl.push(this.formHelper.initPhoneNumber(element));
        });
      }
      // emails
      if (contactPerson['personEmails'].length > 0) {
        // tslint:disable-next-line:max-line-length
        const contactEmailControl = <FormArray>this.contactInfoForm.controls['contactPersonList']['controls'][0].controls['contactEmailList'];
        contactEmailControl.removeAt(0);
        contactPerson['personEmails'].forEach(element => {
          contactEmailControl.push(this.formHelper.initEmailAddress(element));
        });
      }
      // addresss
      if (contactPerson['contactPersonAddresses'].length > 0) {
        // tslint:disable-next-line:max-line-length
        const contactAddressControl = <FormArray>this.contactInfoForm.controls['contactPersonList']['controls'][0].controls['contactAddressList'];
        contactAddressControl.removeAt(0);
        contactPerson['contactPersonAddresses'].forEach(element => {
          contactAddressControl.push(this.formHelper.initAddress(element));
        });
      }
    } else {
      contactPersonControl.push(this.formHelper.initContactPerson());
    }

    // tslint:disable-next-line:max-line-length
    this.contactPersonModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, {class: 'modal-lg'}));
  }

  /** To close contact person modal */
  closeContactPersonModal() {
    if (this.contactPersonModalRef) {
      this.contactPersonModalRef.hide();
      this.contactPersonModalRef = null;
    }
  }

  /**
   * To edit email fields
   * @param TemplateRef template
   * @param any carrierInformation
   */
  openCarrierMetaDataModal(template: TemplateRef<any>, carrierInformation: any) {
    this.contactInfoForm.patchValue({
      carrierName: carrierInformation[CommonConstant.NAME],
      carrierAbbr: carrierInformation[CommonConstant.ABBREVIATION],
      carrierIcon: carrierInformation[CommonConstant.IMAGE_ICON]
    })
    // tslint:disable-next-line:max-line-length
    this.carrierMetaDataModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, {class: 'modal-lg'}));
  }

  /** To close carrier meta data modal */
  closeCarrierMetaDataModal() {
    if (this.carrierMetaDataModalRef) {
      this.carrierMetaDataModalRef.hide();
      this.carrierMetaDataModalRef = null;
    }
  }

  /** To close all the modals */
  closeModals() {
    if (this.addressModalRef) {
      this.closeAddressModal();
    }
    if (this.phoneNumberModalRef) {
      this.closePhoneNumberModal();
    }
    if (this.emailModalRef) {
      this.closeEmailModal();
    }
    if (this.contactPersonModalRef) {
      this.closeContactPersonModal();
    }
    if (this.carrierMetaDataModalRef) {
      this.closeCarrierMetaDataModal();
    }

    if (document.getElementById('addCarrierInformationErrorMsg')) {
      document.getElementById('addCarrierInformationErrorMsg').innerHTML = '';
    }
  }

  /** To clear modals */
  clearModels() {
    // tslint:disable-next-line:no-unused-expression
    this.deleteIndex;
    this.deleteFormArrayType = '';
    // tslint:disable-next-line:no-unused-expression
    this.deleteChildIndex;
    this.deleteChildFormArrayType = '';
  }

  /**
   * Scraped insurance data
   */

  /** getting insurance data from aca module */
  getInsuranceData() {
    this.carrierInfoService.getInsuranceData().subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          const resData: any[] = res[CommonConstant.DATA][CommonConstant.DATA];
          this.formatScrapedCarrierData(resData);
        } else {
          console.log(res[CommonConstant.MESSAGE]);
        }
      },
      error => {
        console.log('Something went wrong');
      }
    )
  }

  /**
   * To set filter data
   * @param any element
   */
  setFilerData(element) {
    if ($.inArray(element.institutionName, this.carrierNameFilterList) < 0) {
      this.carrierNameFilterList.push(element.institutionName);
    }

    if ($.inArray(element.countryName, this.carrierCountryFilterList) < 0) {
      this.carrierCountryFilterList.push(element.countryName);
    }

    if ($.inArray(element.categoryName, this.carrierTypeFilterList) < 0) {
      this.carrierTypeFilterList.push(element.categoryName);
    }
  }

  /** Filter definition */
  initFilterObject() {
    this.Filter['carrierName'] = [];
    this.Filter['carrierAbbr'] = [];
    this.Filter['carrierCountry'] = [];
  }

  /** function to clear all the filter */
  clearAllFilter = () => {
    this.Filter['carrierName'] = [];
    this.Filter['carrierAbbr'] = [];
    this.Filter['carrierCountry'] = [];

    this.carrierName = '';
    this.carrierCountry = '';
  }

  /** To remove CarrierName name form Filter.CarrierName list */
  spliceCarrierName = (index) => {
    if (this.Filter['carrierName'].length === 1) {
      // delete this.CarrierName;
      this.carrierName = '';
    }
    this.Filter['carrierName'].splice(index, 1);
  }

  /** To remove CarrierCountry name form Filter.CarrierCountry list */
  spliceCarrierCountry = (index) => {
    if (this.Filter['carrierCountry'].length === 1) {
      // delete this.carrierCountry;
      this.carrierCountry = '';
    }
    this.Filter['carrierCountry'].splice(index, 1);
  }

  /** To apply filter */
  applyFilter() {
    /** apply carrier name */
    if (this.carrierName === '' || this.carrierName === undefined) {
      this.Filter.carrierName = [];
    } else {
      if ($.inArray(this.carrierName, this.Filter.carrierName) < 0) {
        this.Filter.carrierName.push(this.carrierName);
      }
    }

    // apply carrier country
    if (this.carrierCountry === '' || this.carrierCountry === undefined) {
      this.Filter.carrierCountry = [];
    } else {
      if ($.inArray(this.carrierCountry, this.Filter.carrierCountry) < 0) {
        this.Filter.carrierCountry.push(this.carrierCountry);
      }
    }
  }

  /** To format scrapped carrier data */
  formatScrapedCarrierData(resData) {
    const carrierMetaData = {};
    const result: any[] = [];
    resData.forEach((element) => {

      this.setFilerData(element);

      const key = element.institutionName;
      if (carrierMetaData[key]) {
        carrierMetaData[key]['plans'].push(element);
      } else {
        const obj = {};
        obj['plans'] = [];
        obj['plans'].push(element);

        carrierMetaData[key] = obj;
      }
    });
    for (const key in carrierMetaData) {
      if (carrierMetaData.hasOwnProperty(key)) {
        const element = carrierMetaData[key];
        const temp3 = {};
        temp3['carrierData'] = element['plans'][0];
        temp3['plans'] = element['plans'];
        result.push(temp3);
      }
    }
    // return result;
    this.scrapedInsuranceData = result;
  }

  /** To set branch object */
  setBranchObject(branch) {
    this.branchObj = branch;
  }

  /** To get scrapped carries data */
  getScrappedCarrier(carrier, index: number) {
    this.setCarrierIndex(index);
    const carrierSource = CarrierConstant.CARRIER_SOURCE_SCRAPED;

    this.carrierHelper.setCarrierSourceFlag(carrierSource);
    this.carrierHelper.setCarrierScrapedData(carrier);

    setTimeout(() => {
      this.router.navigateByUrl('/carriers/plan/policy-information');
    }, 200);
  }

  /** To get institutions */
  getInstituteDetails() {
    this.carrierInfoService.getInstituteDetails().subscribe(
      res => {
        // this.loaderService.hide();
        if (res[CommonConstant.ERROR_CODE] === 0) {
          const resData: any[] = res[CommonConstant.DATA];
          this.displayAccountPage = true;
          this.overviewError = false;
          if (resData.length > 0) {
            this.scrapedInstutionList = resData;

            const country = res[CommonConstant.COUNTRY];
            if (country) {
              this.carrierCountry = country;
              this.applyFilter();
            }
          } else {
            this.scrapedInstutionList = [];
          }
          this.formatScrapedCarrierData(resData);
        } else {
          this.overviewError = true;
          this.displayAccountPage = false;
        }
      },
      error => {
        // this.loaderService.hide();
        this.overviewError = true;
        this.displayAccountPage = false;
      }
    )
  }

  /**
   * To get carrier icon
   * @param any carrier
   */
  getCarrierIcon(carrier) {
    const list = this.scrapedInstutionList.filter((element) => {
      return element.institutionName === carrier.institutionName;
    })
    if (list.length > 0) {
      const listObj = list[0];
      let productUrl = listObj['icon'];
      productUrl = this.domSanitizer.bypassSecurityTrustUrl(productUrl);
      return productUrl;
    } else {
      return '/assets/img/icon/insurance_logo.png';
    }
  }

  /**
   * To get scrapped carrier details
   */
  getScrapedCarrierDetails() {
    const carrierName = this.carrierInformation['institutionName'];
    if (!carrierName) {
      return;
    }
    this.carrierInfoService.getInstituteDetails(carrierName).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          const resData: any[] = res[CommonConstant.DATA];
          if (resData.length > 0) {
            this.scrapedInsuranceBranchData = resData[0];
          } else {
            this.scrapedInsuranceBranchData = [];
          }
        } else {
          console.log(res[CommonConstant.MESSAGE]);
        }
      },
      error => {
        console.log('Something went wrong');
      }
    )
  }

  /** To vidit respective page */
  visitRespectivePage(obj) {
    const urlToRedirect = obj.carrierData.productUrl;
    window.open(urlToRedirect, '_blank');
  }

}
