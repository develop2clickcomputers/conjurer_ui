import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../../shared/common/modal.config';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';

import { PolicyInformationService } from './policy-information.service';
import { CarrierService } from '../carrier.service';
import { CommonService } from '../../services/common/common.service';
import { CarrierMenuComponent } from '../shared/carrier-menu.component';

import { CommonConstant } from '../../constants/common/common.constant';
import { CarrierConstant } from '../../constants/carrier/carrier.constant';
import { CarrierHelper } from '../../helpers/carrier/carrier.helper';
import { FormHelper } from '../../helpers/form/form.helper';
import { CommonHelperService } from '../../helpers/common/common.helper';
import { Title } from '@angular/platform-browser';
import { CarrierInformationService } from '../carrier-information/carrier-information.service';
import { CommonNotificationComponent } from '../../shared/notification.component';
import { ClientConstant } from '../../constants/client/client.constant';
import { ClientHelper } from '../../helpers/client/client.helper';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

/** Jquery integration */
declare var $: any;

/**
 * Plan Information component class
 */
@Component({
  selector: 'app-policy-information',
  templateUrl: './policy-information.component.html',
  styleUrls: ['./policy-information.component.css'],
  providers: [
    PolicyInformationService, CommonHttpAdapterService, CarrierService,
    CommonService, CommonHelperService, FormHelper, RxJSHelper
  ]
})
export class PolicyInformationComponent implements OnInit, OnDestroy {

  /** Carrier sidebar menu component reference */
  @ViewChild('carrierSidebarMenu') carrierSidebarMenu: CarrierMenuComponent;

  /** Plan data delete modal reference */
  @ViewChild('planDataDeleteModal') planDataDeleteModal: TemplateRef<any>;

  /** Notification component reference */
  @ViewChild('notificationComponent') notificationComponent: CommonNotificationComponent;

  /** Client policy detail reference */
  @ViewChild('clientPolicyDetailModal') clientPolicyDetailModal: TemplateRef<any>;

  public policyInformationFlag = 'policyInformationFlag';
  public policyInfoForm: FormGroup;
  public policyInformationData: any[] = [];
  public policyInformation: Object = {};
  public policyTypes: any[] = [];
  public policyPlanTypes: any[] = [];
  private planInfoIndex: number;
  public carrierInfo: Object = {};

  public dayList: any[] = [];
  public monthList: any[] = [];
  public yearList: any[] = [];

  policyFetchErrorFlag = false;
  policyInfoPageShow = false;
  policyInfoCount = false;

  showCarrierPlans = true;
  showFilterQuad = false;
  buyPlanLoader = false;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
  };

  public planMetaDataModalRef: BsModalRef;
  public planTermModalRef: BsModalRef;
  public carrierRiderModalRef: BsModalRef;
  public issueAgeModalRef: BsModalRef;
  public deletePlanModalRef: BsModalRef;

  private deleteIndex: number;
  private deleteFormArrayType;

  // scraped carrier plan data
  scrapedPolicyInformationData: any[] = [];
  policyInfoDisplayFlag = false;
  public planMetaData: Object = {};

  // buy plans declarations
  clientPolicyDetailForm: FormGroup;
  clientPolicyDetailModalRef: BsModalRef;
  public currencyList: Array<any> = [];
  public popularCurrencyList: Array<any> = [];
  selcectedCurrencySymbol = '';
  public policyPremiumFrequency = '';
  private policyInputFieldChanged = false;
  public riderAttached = false;

  displayAccountPage = false;
  overviewError = false;

  // Filters
  public productName = '';
  public carrierCountry = '';
  public categoryName = '';
  productNameFilterList: string[] = [];
  carrierTypeFilterList: string[] = [];

  // multi filter array declarations
  Filter: any = {
    productName: [],
    categoryName: []
  };

  /** @ignore */
  constructor(
    private titleService: Title,
    private _fb: FormBuilder,
    private modalService: BsModalService,
    private modalConfig: ModalConfig,
    private policyInformationService: PolicyInformationService,
    private carrierService: CarrierService,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private carrierHelper: CarrierHelper,
    private commonService: CommonService,
    private router: Router,
    private commonHelper: CommonHelperService,
    private formHelper: FormHelper,
    private rxjsHelper: RxJSHelper,
    private carrierInformationService: CarrierInformationService,
    private location: Location,
    private clientHelper: ClientHelper,
    private loaderService: Ng4LoadingSpinnerService
  ) {
    /** To set the page title */
    this.titleService.setTitle('Conjurer | Plans');
  }

  /** @ignore */
  ngOnInit() {
    // To initialize filter object
    this.initFilterObject();
    this.dayMonthYearList();
    this.showPlanPage();
    // this.setPolicyFormValue();
    const carrierSourceFlag = this.carrierHelper.getCarrierSourceFlag();
    if (carrierSourceFlag === CarrierConstant.CARRIER_SOURCE_EVEREST) {
      // this.getPolicyInformation();
      this.getCarrierInformation();
      this.getPolicyInformation();
    } else if (carrierSourceFlag === CarrierConstant.CARRIER_SOURCE_SCRAPED) {
      this.createClientPolicyDetailForm();
      this.getScrapedCarrierInformation();
      this.getCurrencyList();
    }
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();
    // this.carrierHelper.removeCarrierSourceFlag();
  }

  /** To get list if days, month, and years */
  dayMonthYearList() {
    this.dayList = this.commonHelper.getDayList();
    this.monthList = this.commonHelper.getMonthList();
    this.yearList = this.commonHelper.getYearList();
  }

  /** To plan page section */
  showPlanPage() {
    const planPageFlag = this.carrierHelper.getPlanFlag();
    console.log(planPageFlag);
    if (planPageFlag) {
      this.showCarrierPlans = false;
      if (planPageFlag === 'insurance') {
        const planData = this.carrierHelper.getCarrierPlanScrapedData();
        this.getScrapedPolicyInfo(planData);
      }
    }
  }

  /** To get carrier information */
  getCarrierInformation() {
    const carrierData = this.carrierHelper.getCarrierData();
    if (Object.keys(carrierData).length > 0) {
      this.carrierInfo = carrierData;
    }
  }

  /**To get policy information */
  getPolicyInformation() {
    this.policyInformationService.getPolicyInformation().subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.policyInformationData = res[CommonConstant.DATA].policyPlans;

            this.policyFetchErrorFlag = false;
            this.policyInfoPageShow = true;
            if (this.policyInformationData.length > 0) {
              this.policyInfoCount = false;
              // hide/show copy and create new
            } else {
              this.policyInfoCount = true;
              // hide/show copy and create new
            }
          }

        },
        error => {
          this.policyFetchErrorFlag = true;
        }
      )
  }

  /** To get curreny list */
  getCurrencyList() {
    this.commonService.getCurrenyList().subscribe(
      res => {
        this.currencyList = res.currencyList;
        this.makePopularCurrencyList();
      },
      error => {
        console.log(error);
      }
    )
  }

  /** To filter popular currency from currencies */
  makePopularCurrencyList = () => {
    this.popularCurrencyList = [];
    this.currencyList.forEach((element) => {
      if (element.popular) {
        this.popularCurrencyList.push(element);
      }
    })
  }

  /**
   * On currency change display target currency in each and every amount field
   */
  onCurrencyChange(currCode?) {
    if (currCode) {
      const currencySymbol = this.commonHelper.getCurrencySymbol(currCode);
      this.selcectedCurrencySymbol = currencySymbol;
    } else {
      let currencyCode = this.clientPolicyDetailForm.get('currency').value;
      if (currencyCode) {
        const currencySymbol = this.commonHelper.getCurrencySymbol(currencyCode);
        this.selcectedCurrencySymbol = currencySymbol;
      } else {
        currencyCode = 'SGD';
        const currencySymbol = this.commonHelper.getCurrencySymbol(currencyCode);
        this.selcectedCurrencySymbol = currencySymbol;
        this.clientPolicyDetailForm.patchValue({
          currency: currencyCode
        });
      }
    }
  }

  /**
   * To set plan info index
   * By clicking on plan info list
   * @param index
   */
  setPlanInfoIndex(index: number) {
    this.planInfoIndex = index;
  }

  /**
   * To format terms
   * @param termObj
   */
  formatTerms(termObj) {
    const formattedTerm = this.carrierHelper.getFormattedPlanTerms(termObj);

    return formattedTerm;
  }

  /** Back to plan list */
  backToPlanList() {
    this.showCarrierPlans = true;
  }

  /** To go back to carrier list */
  backToCarrierList() {
    // this.location.back();
    this.router.navigateByUrl('/carriers/carrier-information');
  }

  /**
   * To get plan info object and redirect to plan meta data information page
   * @param policyInfo
   */
  getPolicyInfo(policyInfo, index: number) {
    this.policyInfoDisplayFlag = true;
    if (Object.keys(policyInfo).length > 0) {
      this.carrierHelper.setPolicyData(policyInfo);
      this.setPlanInfoIndex(index);
      this.getPolicyInfoDetails(policyInfo);
    }
  }

  /**
   * To get policy info object
   * This is used to format the existing object data
   * @param policyInfo
   */
  getPolicyInfoDetails(policyInfo) {
    const planId = policyInfo[CommonConstant.PLAIN_ID];
    this.policyInformationService.getPolicyInformationById(planId).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.policyFetchErrorFlag = false;
            this.policyInfoPageShow = true;
            this.showCarrierPlans = false;
            this.policyInfoDisplayFlag = true;
            this.policyInformation = res['PolicyPlan'];
            this.carrierHelper.setPolicyData(this.policyInformation);
          } else {
            this.policyFetchErrorFlag = true;
          }
        },
        error => {
          this.policyFetchErrorFlag = true;
        }
      )
  }

  /**
   * Sidebar child component event listener
   * @param event
   */
  onPolicyInfoChanged(event) {
    if (Object.keys(event).length > 0) {
      this.policyInfoCount = false;
      this.carrierSidebarMenu.disableThisUrl = false; // disable/enable routes
      this.carrierHelper.setPolicyData(event);
      this.policyInformationData.push(event);
      this.getPolicyInfoDetails(event);
    }
  }

  /**
   * To get insurance plans
   * @param carrierData
   */
  getInsurancePlans(carrierData) {
    const institutionName = carrierData['institutionName'];
    let requestData: any = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    requestData[CommonConstant.NAME] = institutionName;
    requestData = JSON.stringify(requestData);
    this.loaderService.show();
    this.carrierInformationService.getInsurancePlans(requestData).subscribe(
        res => {
          this.loaderService.hide();
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.overviewError = false;
            const resData = res[CommonConstant.DATA];
            this.formatScrapedPlanData(resData);
            this.scrapedPolicyInformationData = resData;
          } else {
            this.overviewError = true;
            this.policyFetchErrorFlag = true;
          }
        },
        error => {
          this.loaderService.hide();
          this.overviewError = true;
          this.policyFetchErrorFlag = true;
        }
      )
  }

  /** To format scraped carrier data */
  formatScrapedPlanData(resData) {
    resData.forEach((element) => {
      this.setFilerData(element);
    });
  }

  /** To set filter data */
  setFilerData(element) {
    if ($.inArray(element.productName, this.productNameFilterList) < 0) {
      this.productNameFilterList.push(element.productName);
    }

    if ($.inArray(element.categoryName, this.carrierTypeFilterList) < 0) {
      this.carrierTypeFilterList.push(element.categoryName);
    }
  }

  /** Filter definition */
  initFilterObject() {
    this.Filter['productName'] = [];
    this.Filter['categoryName'] = [];
  }

  /** To remove ProductName name form Filter.ProductName list */
  spliceProductName = (index) => {
    if (this.Filter['productName'].length === 1) {
      this.productName = '';
    }
    this.Filter['productName'].splice(index, 1);
  }

  /** To remove CategoryName name form Filter.CategoryName list */
  spliceCategoryName = (index) => {
    if (this.Filter['categoryName'].length === 1) {
      this.categoryName = '';
    }
    this.Filter['categoryName'].splice(index, 1);
  }

  /** function to clear all the filter */
  clearAllFilter = () => {
    this.Filter['productName'] = [];
    this.Filter['categoryName'] = [];

    this.productName = '';
    this.categoryName = '';
  }

  /** To apply filter */
  applyFilter() {
    // apply carrier name
    if (this.productName === '' || this.productName === undefined) {
      this.Filter.productName = [];
    } else {
      if ($.inArray(this.productName, this.Filter.productName) < 0) {
        this.Filter.productName.push(this.productName);
      }
    }

    // apply carrier abbr
    if (this.categoryName === '' || this.categoryName === undefined) {
      this.Filter.categoryName = [];
    } else {
      if ($.inArray(this.categoryName, this.Filter.categoryName) < 0) {
        this.Filter.categoryName.push(this.categoryName);
      }
    }
  }


  /**
   * Integration of scraped carrier plan information
   */
  getScrapedCarrierInformation() {
    const carrierData = this.carrierHelper.getCarrierScrapedData();
    this.carrierInfo = {};
    this.carrierInfo = carrierData;
    // this.policyInformation = carrierData;
    this.policyFetchErrorFlag = false;
    this.policyInfoPageShow = true;

    this.getInsurancePlans(carrierData);
  }

  /** To get scraped plan information */
  getScrapedPolicyInfo(policyInfo, index?: number) {
    // this.policyInformation = policyInfo;
    this.carrierHelper.setCarrierPlanScrapedData(policyInfo);
    if (index === 0 || index > 0) {
      this.setPlanInfoIndex(index);
    }

    // to display meta data page
    this.carrierHelper.setPlanFlag('insurance');

    // console.log(this.policyInformation);
    this.showCarrierPlans = false;
    this.policyInfoDisplayFlag = false;
    setTimeout(() => {
      this.getPlanInfo(policyInfo);
    }, 200);
  }

  /** To visit to respective page */
  visitRespectivePage(obj?) {
    /* console.log(this.policyInformation);
    const urlToRedirect = obj.productUrl;
    window.open(urlToRedirect, '_blank'); */
    let urlToRedirect;
    console.log(this.policyInformation);
    if (obj) {
      urlToRedirect = obj.productUrl;
    } else {
      urlToRedirect = this.policyInformation['productUrl'];
    }
    window.open(urlToRedirect, '_blank');
  }

  /** To get plan information */
  getPlanInfo(policyInfo) {
    let requestData: Object = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    requestData[CommonConstant.PLAIN_ID] = policyInfo[CommonConstant.PLAIN_ID];
    requestData = JSON.stringify(requestData);
    this.loaderService.show();
    this.carrierInformationService.getInstitutionDetailsById(requestData).subscribe(
        res => {
          this.loaderService.hide();
          if (res[CommonConstant.ERROR_CODE] === 0) {
            const resData: any = res[CommonConstant.DATA];
            // this.planMetaData = resData;
            this.policyInformation = resData;
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

  /**
   * Buy plan functionality
   */
  createClientPolicyDetailForm() {
    return this.clientPolicyDetailForm = this._fb.group({
      carrierName: [''],
      planName: [''],
      planType: [{ value: '', disabled: true }],
      maturityDate: [{ value: '', disabled: true }],
      policyTermMonth: [''],
      policyTermYear: [''],
      premiumFrequency: [''],
      premiumMode: [''],
      advisors: this._fb.array([
        this.initAdvisor()
      ]),
      contactName: [''],
      contactId: [''],
      clientSameAsPrimaryInsured: [false],
      currency: [''],
      basicFaceValue: [''],
      death: [''],
      permanentDisability: [''],
      criticalIllness: [''],
      accidentalDeath: [''],
      policyPremium: this.clientHelper.initPolicyPremium(),
      /* policyPremium: this._fb.array([
        this.clientHelper.initPolicyPremium()
      ]), */
      riderPremium: this._fb.array([
        this.clientHelper.initRiderPremium()
      ])
    });
  }

  /**
  * To initialize advisor
  */
  initAdvisor(element?) {
    let primarySelected: boolean;
    if (element) {
      if (typeof element === 'object') {
        let commPercent = 100, advisoryGrId = '', primary = true;
        if (element[ClientConstant.COMMISSION_PERCENT]) {
          commPercent = element[ClientConstant.COMMISSION_PERCENT];
        }
        if (element[ClientConstant.ADVISORY_GROUP_ID]) {
          advisoryGrId = element[ClientConstant.ADVISORY_GROUP_ID];
        }
        if (element[CommonConstant.PRIMARY]) {
          primary = element[CommonConstant.PRIMARY];
        }
        return this._fb.group({
          advisor: element[CommonConstant.PLAIN_ID],
          name: element[CommonConstant.NAME],
          commissionPercent: commPercent,
          ippAdvisoryGroup: advisoryGrId,
          primary: primary,
          status: [false]
        })
      } else if (typeof element === 'string') {
        primarySelected = false;
      }
    } else {
      primarySelected = true;
    }
    return this._fb.group({
      advisor: [''],
      name: [''],
      commissionPercent: [100],
      ippAdvisoryGroup: [''],
      primary: [primarySelected],
      status: [false]
    })
    /* if (element === 'addnew') {
      primarySelected = false
    } else {
      primarySelected = true
    } */
  }

  /** Prepare to buy selected plan */
  prepareBuyPlan() {
    this.openClientPolicyDetailModal();
    this.onCurrencyChange();
    this.setPolicyFormData();
  }

  /**
   * To set plan info form data
   */
  setPolicyFormData() {

    // policy information
    let effectiveDate: any = '', maturityDate: any = '', planTerm = '';
    if (this.policyInformation[ClientConstant.EFFECTIVE_DATE]) {
      effectiveDate = this.commonHelper.displayDateFormatMyDatePicker(this.policyInformation[ClientConstant.EFFECTIVE_DATE]);
    }
    if (this.policyInformation[ClientConstant.POLICY_MATURITY_DATE]) {
      // tslint:disable-next-line:max-line-length
      maturityDate = this.commonHelper.displayDateFormatMyDatePicker(this.policyInformation[ClientConstant.POLICY_MATURITY_DATE]);
    }

    let policyTermMonth = '', policyTermYear = '';
    if (this.policyInformation[CarrierConstant.POLICY_TERM]) {
      policyTermMonth = String(this.carrierHelper.getCommissionTermMonth(this.policyInformation[CarrierConstant.POLICY_TERM]));
      policyTermYear = String(this.carrierHelper.getCommissionTermYear(this.policyInformation[CarrierConstant.POLICY_TERM]));
    }

    if (this.policyInformation['policyPlanTerm']) {
      planTerm = this.policyInformation['policyPlanTerm'].id;
    }

    this.clientPolicyDetailForm.patchValue({
      carrierName: this.policyInformation['institutionName'],
      planName: this.policyInformation['productName'],
      planId: this.policyInformation['id'],
      planType: this.policyInformation['categoryName'],
      policyTermMonth: policyTermMonth,
      policyTermYear: policyTermYear,
      effectiveDate: effectiveDate,
      planTerm: planTerm,
      maturityDate: maturityDate
    });

    // policy premiums
    let basicFaceValue = '', death = '', permanentDisability = '', criticalIllness = '', accidentalDeath = '';
    if (this.policyInformation[ClientConstant.BASIC_FACE_VALUE]) {
      basicFaceValue = this.policyInformation[ClientConstant.BASIC_FACE_VALUE].amount;
    }
    if (this.policyInformation[ClientConstant.DEATH]) {
      death = this.policyInformation[ClientConstant.DEATH].amount;
    }
    if (this.policyInformation[ClientConstant.PERMANENT_DISABLITY]) {
      permanentDisability = this.policyInformation[ClientConstant.PERMANENT_DISABLITY].amount;
    }
    if (this.policyInformation[ClientConstant.CRITICAL_ILLNESS]) {
      criticalIllness = this.policyInformation[ClientConstant.CRITICAL_ILLNESS].amount;
    }
    if (this.policyInformation[ClientConstant.ACCIDENTAL_DEATH]) {
      accidentalDeath = this.policyInformation[ClientConstant.ACCIDENTAL_DEATH].amount;
    }

    this.clientPolicyDetailForm.patchValue({
      // currency: this.policyInformation[CommonConstant.CURRENCY],
      basicFaceValue: basicFaceValue,
      death: death,
      permanentDisability: permanentDisability,
      criticalIllness: criticalIllness,
      accidentalDeath: accidentalDeath,
    });

    this.formHelper.clearFormArray(this.clientPolicyDetailForm, 'policyPremium');
    const policyPremiumControl = <FormGroup>this.clientPolicyDetailForm.controls['policyPremium'];
    if (this.policyInformation['premium']) {
      if (this.policyInformation['premium'].amount > 0) {
        let premium = '', loadingPremium = '', targetPrem = '';
        if (this.policyInformation[ClientConstant.PREMIUM]) {
          premium = this.policyInformation[ClientConstant.PREMIUM].amount;
        }
        if (this.policyInformation[ClientConstant.LOADING_PREMIUM]) {
          loadingPremium = this.policyInformation[ClientConstant.LOADING_PREMIUM].amount;
        }
        const premiumFreq = this.policyInformation[ClientConstant.PREMIUM_FREQUENCY];
        this.policyPremiumFrequency = premiumFreq;
        const targetPremApplicable = this.policyInformation[ClientConstant.TARGET_PREMIUM_APPLICABLE];
        if (this.policyInformation[ClientConstant.TARGET_PREMIUM]) {
          targetPrem = this.policyInformation[ClientConstant.TARGET_PREMIUM].amount;
        }

        const targetPremFreq = this.policyInformation[ClientConstant.TARGET_PREMIUM_FREQUENCY];
        // tslint:disable-next-line:max-line-length
        const formGroupStructure = this.clientHelper.initPolicyPremium(premium, loadingPremium, premiumFreq, targetPremApplicable, targetPrem, targetPremFreq);
        const formGroupStructureValue = formGroupStructure.value;
        policyPremiumControl.patchValue(formGroupStructureValue);
      } else {
        policyPremiumControl.patchValue(this.clientHelper.initPolicyPremium());
      }
    } else {
      policyPremiumControl.patchValue(this.clientHelper.initPolicyPremium());
    }

    // rider premiums
    const riderPrem = this.policyInformation['riders'];
    this.formHelper.clearFormArray(this.clientPolicyDetailForm, 'riderPremium');
    const riderPremiumControl = <FormArray>this.clientPolicyDetailForm.controls['riderPremium'];
    if (this.policyInformation['riders'].length > 0) {
      this.riderAttached = true;
      const premiumFreq = this.policyPremiumFrequency;
      this.policyInformation['riders'].forEach(element => {
        riderPremiumControl.push(this.clientHelper.initRiderPremium(element, premiumFreq));
      });
    } else {
      this.riderAttached = false;
      riderPremiumControl.push(this.clientHelper.initRiderPremium());
    }
  }

  /** To set rider sum assured */
  setSumAssuredToRiders(index: number, policyRiderId?) {
    // this.policyPremiumForm.controls['riderPremium']['controls'][index]['controls']['rider'].value;
    // populate death, permanent disability, critical illnes, accidental death
    const death = this.clientPolicyDetailForm.get('death').value;
    const permanentDisability = this.clientPolicyDetailForm.get('permanentDisability').value;
    const criticalIllness = this.clientPolicyDetailForm.get('criticalIllness').value;
    const accidentalDeath = this.clientPolicyDetailForm.get('accidentalDeath').value;
    const riderPremiumControl = <FormArray>this.clientPolicyDetailForm.controls['riderPremium'];
    const riderPremiumValues = riderPremiumControl.controls[index].value;
    // tslint:disable-next-line:max-line-length
    if (riderPremiumValues['death'] === '' && riderPremiumValues['permanentDisability'] === '' && riderPremiumValues['criticalIllness'] === '' && riderPremiumValues['accidentalDeath'] === '') {
      riderPremiumControl.controls[index].patchValue({
        death: death,
        permanentDisability: permanentDisability,
        criticalIllness: criticalIllness,
        accidentalDeath: accidentalDeath
      })
    }
  }

  /** To open plan detail modal */
  openClientPolicyDetailModal() {
    this.clientPolicyDetailModalRef = this.modalService.show(
        this.clientPolicyDetailModal, Object.assign({}, this.modalConfig.config, {class: 'modal-lg'}));
  }

  /** To close plan detail modal */
  closeClientPolicyDetailModal() {
    if (this.clientPolicyDetailModalRef) {
      this.clientPolicyDetailModalRef.hide();
      this.clientPolicyDetailModalRef = null;
    }
  }

  /** on plan input change */
  onChangePopulatedPolicyInputField() {
    this.policyInputFieldChanged = true;
  }

  /** Setting basic face value */
  setBasicValueToOtherFields() {
    const basicFaceValue = this.clientPolicyDetailForm.get('basicFaceValue').value;
    if (basicFaceValue) {
      if (!this.policyInputFieldChanged) {
        this.clientPolicyDetailForm.patchValue({
          death: basicFaceValue,
          permanentDisability: basicFaceValue,
          criticalIllness: basicFaceValue,
          accidentalDeath: basicFaceValue
        })
      }
    }
  }

  /** on plan term change */
  onPlanTermChange() {
    const planTermMonth = Number(this.clientPolicyDetailForm.get('policyTermMonth').value);
    const planTermYear = Number(this.clientPolicyDetailForm.get('policyTermYear').value);
    const planTerm = this.commonHelper.getConvertedMonth(planTermMonth, planTermYear);
    const maturityDate = this.commonHelper.getMaturityDate(planTerm);
    const formattedMaturityDate = this.commonHelper.displayDateFormatMyDatePicker(maturityDate);
    this.clientPolicyDetailForm.patchValue({
      maturityDate: formattedMaturityDate
    })
  }

  /** Prepare request to add policy */
  prepareRequestToAddPolicy() {
    const policyRequestData: Object = {};
    // policyRequestData[CommonConstant.PLAIN_ID] = this.policyInformation[CommonConstant.PLAIN_ID];
    // customer details
    const clientPolicyDetailFormData = this.clientPolicyDetailForm.getRawValue();
    policyRequestData[ClientConstant.BUYER_ID] = clientPolicyDetailFormData['contactId'];
    // policyRequestData[ClientConstant.BUYER_TYPE] = String(policyCustomerFormData['contactName'].clientType).toLowerCase();

    // policy info
    const carrierId = this.clientPolicyDetailForm.get('carrierName').value;
    if (!carrierId) {
      this.notificationComponent.openNotificationModal('Please select carrier');
      return;
    }
    policyRequestData[CarrierConstant.CARRIER_NAME] = clientPolicyDetailFormData['carrierName'];
    policyRequestData[ClientConstant.POLICY_PLAN_TYPE] = clientPolicyDetailFormData['planType'];
    policyRequestData[ClientConstant.POLICY_NUMBER] = Number(clientPolicyDetailFormData['policyNumber']);
    policyRequestData[CarrierConstant.PLAN_NAME] = clientPolicyDetailFormData['planName'];
    policyRequestData[ClientConstant.POLICY_PLAN_ID] = clientPolicyDetailFormData['planId'];
    policyRequestData[CarrierConstant.POLICY_TERM] = this.commonHelper.getConvertedMonth(
      clientPolicyDetailFormData['policyTermMonth'], clientPolicyDetailFormData['policyTermYear']);
    policyRequestData[ClientConstant.POLICY_PREMIUM_MODE] = clientPolicyDetailFormData['premiumMode'];

    if (typeof clientPolicyDetailFormData['maturityDate'] === 'object' && clientPolicyDetailFormData['maturityDate'].formatted) {
      clientPolicyDetailFormData['maturityDate'] =
        this.commonHelper.serviceDateFormat(clientPolicyDetailFormData['maturityDate'].formatted);
    } else {
      clientPolicyDetailFormData['maturityDate'] = this.commonHelper.prepareServiceDate(clientPolicyDetailFormData['maturityDate']);
    }
    policyRequestData[ClientConstant.POLICY_MATURITY_DATE] = clientPolicyDetailFormData['maturityDate'];

    // policy premium details
    const currency = clientPolicyDetailFormData['currency'];

    policyRequestData[CommonConstant.CURRENCY] = clientPolicyDetailFormData['currency'];
    policyRequestData[ClientConstant.BASIC_FACE_VALUE] = this.commonHelper.getMudraStructure(this.formHelper.removeCommaFromNumber
      (clientPolicyDetailFormData['basicFaceValue']), currency);

    policyRequestData[ClientConstant.DEATH] = this.commonHelper.getMudraStructure(this.formHelper.removeCommaFromNumber
      (clientPolicyDetailFormData['death']), currency);

    policyRequestData[ClientConstant.PERMANENT_DISABLITY] = this.commonHelper.getMudraStructure(this.formHelper.removeCommaFromNumber
      (clientPolicyDetailFormData['permanentDisability']), currency);

    policyRequestData[ClientConstant.CRITICAL_ILLNESS] = this.commonHelper.getMudraStructure(this.formHelper.removeCommaFromNumber
      (clientPolicyDetailFormData['criticalIllness']), currency);

    policyRequestData[ClientConstant.ACCIDENTAL_DEATH] = this.commonHelper.getMudraStructure(this.formHelper.removeCommaFromNumber
      (clientPolicyDetailFormData['accidentalDeath']), currency);

    // policy premium
    policyRequestData[ClientConstant.PREMIUM] = this.commonHelper.getMudraStructure(
      this.formHelper.removeCommaFromNumber(clientPolicyDetailFormData['policyPremium']['premium'].amount), currency);
    policyRequestData[ClientConstant.LOADING_PREMIUM] = this.commonHelper.getMudraStructure(
      this.formHelper.removeCommaFromNumber(clientPolicyDetailFormData['policyPremium']['loadingPremium'].amount), currency);

    // premium frequency
    policyRequestData[ClientConstant.PREMIUM_FREQUENCY] =
      this.clientHelper.getFrequency(clientPolicyDetailFormData['policyPremium']['premium'].premiumFrequency);

    // target premium
    policyRequestData[ClientConstant.TARGET_PREMIUM_APPLICABLE] =
      clientPolicyDetailFormData['policyPremium'][ClientConstant.TARGET_PREMIUM_APPLICABLE];
    policyRequestData[ClientConstant.TARGET_PREMIUM] = this.commonHelper.getMudraStructure(
      this.formHelper.removeCommaFromNumber(clientPolicyDetailFormData['policyPremium']['targetPremium'].targetPremium), currency);
    policyRequestData[ClientConstant.TARGET_PREMIUM_FREQUENCY] =
      this.formHelper.removeCommaFromNumber(clientPolicyDetailFormData['policyPremium']['targetPremium'].targetPremiumFrequency);

    // rider premium
    let riderPremObj: Object = {};
    const riderPremArray: Array<any> = [];
    clientPolicyDetailFormData['riderPremium'].forEach(element => {
      riderPremObj = {};
      riderPremObj[CommonConstant.PLAIN_ID] = element['id'];
      riderPremObj[CommonConstant.NAME] = element['name'];
      // riderPremObj[ClientConstant.POLICY_PLAN_RIDER_TERM_ID] = element['riderTermId'];

      riderPremObj[CarrierConstant.POLICY_RIDER_TERM] = this.commonHelper.getConvertedMonth(
        element['policyRiderTermMonth'], element['policyRiderTermYear']);

      riderPremObj[ClientConstant.PREMIUM] = this.commonHelper.getMudraStructure(this.formHelper.removeCommaFromNumber(
        element['premium'].amount), currency);

      // premium frequency
      riderPremObj[ClientConstant.PREMIUM_FREQUENCY] =
        this.clientHelper.getFrequency(element['premium']['premiumFrequency']);

      riderPremObj[ClientConstant.LOADING_PREMIUM] = this.commonHelper.getMudraStructure(this.formHelper.removeCommaFromNumber(
        element['loadingPremium'].amount), currency);

      riderPremObj[ClientConstant.DEATH] = this.commonHelper.getMudraStructure(this.formHelper.removeCommaFromNumber
        (element['death']), currency);

      riderPremObj[ClientConstant.PERMANENT_DISABLITY] = this.commonHelper.getMudraStructure(this.formHelper.removeCommaFromNumber
        (element['permanentDisability']), currency);

      riderPremObj[ClientConstant.CRITICAL_ILLNESS] = this.commonHelper.getMudraStructure(this.formHelper.removeCommaFromNumber
        (element['criticalIllness']), currency);

      riderPremObj[ClientConstant.ACCIDENTAL_DEATH] = this.commonHelper.getMudraStructure(this.formHelper.removeCommaFromNumber
        (element['accidentalDeath']), currency);

      if (riderPremObj[CommonConstant.PLAIN_ID]) {
        riderPremArray.push(riderPremObj);
      }
    });
    if (riderPremArray.length > 0) {
      policyRequestData[ClientConstant.RIDER_PREMIUM_LIST] = riderPremArray;
    } else {
      policyRequestData[ClientConstant.RIDER_PREMIUM_LIST] = [];
    }

    return policyRequestData;
  }

  /** To buy plan */
  buyPlan() {
    let requestData: Object = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    requestData['planId'] = this.policyInformation[CommonConstant.PLAIN_ID];
    const formData = this.prepareRequestToAddPolicy();
    if (!formData) {
      return;
    }
    requestData['formData'] = formData;
    requestData = JSON.stringify(requestData);
    this.loaderService.show();
    this.carrierInformationService.purchasePlan(requestData).subscribe(
        res => {
          this.loaderService.hide();
          if (res[CommonConstant.ERROR_CODE] === 0) {
            const resData: any = res[CommonConstant.DATA];
            // this.planMetaData = resData;
            // this.policyInformation = resData;
            this.closeClientPolicyDetailModal();
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
