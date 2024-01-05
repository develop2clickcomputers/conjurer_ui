import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../../shared/common/modal.config';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

import { typeValue, planTypeValue } from './rider-commission.interface';
import { RiderCommissionService } from './rider-commission.service';
import { riderCommissions } from './rider-commission.interface';
import { PolicyInformationService } from '../policy-information/policy-information.service';

import { CommonNotificationComponent } from '../../shared/notification.component';
import { CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';

import { CommonConstant } from '../../constants/common/common.constant';
import { CarrierConstant} from '../../constants/carrier/carrier.constant';
import { CarrierHelper } from '../../helpers/carrier/carrier.helper';
import { FormHelper } from '../../helpers/form/form.helper';
import { CommonHelperService } from '../../helpers/common/common.helper';
import { Title } from '@angular/platform-browser';
import { CarrierInformationService } from '../carrier-information/carrier-information.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

/** Jquery integration */
declare var $: any;

/**
 * Rider commission component class
 */
@Component({
  selector: 'app-rider-commission',
  templateUrl: './rider-commission.component.html',
  styleUrls: ['./rider-commission.component.css'],
  providers: [
    RiderCommissionService, CommonHttpAdapterService,
    PolicyInformationService, FormHelper, CommonHelperService,
    RxJSHelper
  ]
})
export class RiderCommissionComponent implements OnInit, OnDestroy {

  /** rider comm rate delete modal reference */
  @ViewChild('riderCommRateDeleteModal', {static: false}) riderCommRateDeleteModal: TemplateRef<any>;

  /** Notification component reference */
  @ViewChild('notificationComponent', {static: false}) notificationComponent: CommonNotificationComponent;

  public riderCommissionFlag = 'riderCommissionFlag';
  public riderCommForm: FormGroup;
  public riderCommissionData: Array<any> = [];
  public riderCommission: any = {};
  public types = typeValue;
  public planTypes = planTypeValue;
  public policyPlanTypes: Array<any> = [];
  private riderIndex: number;
  public planRiders: any[] = [];
  public planRiderData: any = {};

  public policyInformation: any = [];
  public policyInforObj: any = {};
  public carrierInfo: any = {};
  public planObject: any = {};

  policyFetchErrorFlag = false;
  policyInfoPageShow = false;
  policyInfoCount = false;
  showFilterQuad = false;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
  };

  public riderCommRateModalRef: BsModalRef;
  public deleteRiderCommRateModalRef: BsModalRef;
  public dayList: any[] = [];
  public monthList: any[] = [];
  public yearList: any[] = [];
  public riderTermList: any[] = [];

  public deleteIndex: number;
  public deleteFormArrayType;
  public deleteChildIndex: number;
  public deleteChildFormArrayType;
  public updateRiderCommLoader = false;
  public showPlanRiderList = true;

  // scraped carrier plan data
  scrapedPlanInfoData: Array<any> = [];
  planInfoRiderDisplayFlag = false;
  planRiderCommissionRates: any[] = [];

  displayAccountPage = false;
  overviewError = false;

  // Filters
  public planRiderName = '';
  productNameFilterList: string[] = [];

  // multi filter array declarations
  Filter: any = {
    planRiderName: []
  };

  /** @ignore */
  constructor(
    private titleService: Title,
    private _fb: FormBuilder,
    private riderCommissionService: RiderCommissionService,
    private policyInformationService: PolicyInformationService,
    private carrierHelper: CarrierHelper,
    private router: Router,
    private formHelper: FormHelper,
    private modalService: BsModalService,
    private modalConfig: ModalConfig,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private commonHelper: CommonHelperService,
    private rxjsHelper: RxJSHelper,
    private carrierInformationService: CarrierInformationService,
    private loaderService: Ng4LoadingSpinnerService
  ) {
    /** To set title of the page */
    this.titleService.setTitle('Conjurer | Riders');
  }

  /** @ignore */
  ngOnInit() {
    // To initialize filter object
    this.initFilterObject();

    this.createRiderCommissionForm();
    // this.setRiderCommissionFormValue();
    this.getCarrierInformation();
    this.getPolicyInformation();
    const carrierSourceFlag = this.carrierHelper.getCarrierSourceFlag();
    if (carrierSourceFlag === CarrierConstant.CARRIER_SOURCE_EVEREST) {
      this.getPlanRiders();
    } else if (carrierSourceFlag === CarrierConstant.CARRIER_SOURCE_SCRAPED) {
      this.getScrapedCarrierPlanInformation();
    }
    // this.getRiderCommissionPlanType();
    this.dayMonthYearList();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();
  }

  /** To get the days, months, and years */
  dayMonthYearList() {
    this.dayList = this.commonHelper.getDayList();
    this.monthList = this.commonHelper.getMonthList();
    this.yearList = this.commonHelper.getYearList();
  }

  /** To get carrier information */
  getCarrierInformation() {
    const carrierData = this.carrierHelper.getCarrierData();
    if (Object.keys(carrierData).length > 0) {
      this.carrierInfo = carrierData;
    }
  }

  /**To get plan riders */
  getPlanRiders() {
    this.riderCommissionService.getPlanRiders().subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          const resData = res[CommonConstant.DATA].policyPlanRiders;
          this.planRiders = resData;
          this.policyFetchErrorFlag = false;
          this.policyInfoPageShow = true;
          if (this.planRiders.length > 0) {
            this.policyInfoCount = false;
            this.riderCommission = this.planRiders[0];
          } else {
            this.policyInfoCount = true;
          }
        } else {
          this.policyFetchErrorFlag = true;
        }
      },
      error => {
        console.log('Something went wrong');
      }
    )
  }

  /** Go back to rider list */
  backToRiderList() {
    this.showPlanRiderList = true;
  }

  /**
   * Get rider information
   * @param any rider
   */
  getRiderInfo(rider) {
    this.planInfoRiderDisplayFlag = true;
    this.getPlanRiderDetails(rider);
  }

  /**
   * To get plan rider details
   * @param any planRider
   */
  getPlanRiderDetails = (planRider: any) => {
    const planRiderId = planRider[CommonConstant.PLAIN_ID];
    this.riderCommissionService.getPolicyPlanRiderDetails(planRiderId).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          const resData = res[CommonConstant.DATA].policyPlanRider;
          this.planRiderData = resData;
          this.riderCommission = resData;
          this.policyFetchErrorFlag = false;
          this.policyInfoPageShow = true;
          this.showPlanRiderList = false;
        } else {
          this.policyFetchErrorFlag = true;
        }
      },
      error => {
        this.policyFetchErrorFlag = true;
      }
    )
  }

  /**To get policy information */
  getPolicyInformation() {
    const planId = this.carrierHelper.getPolicyInfoId();
    this.policyInformationService.getPolicyInformationById(planId).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.policyInformation = res['PolicyPlan'];
          this.getPolicyInformationDetails(this.policyInformation);
        }

      },
      error => {
        console.log('Something went wrong');
      }
    )
  }

  /**
   * get policy information details
   * @param any policyInfo
   */
  getPolicyInformationDetails(policyInfo: any) {
    this.policyInforObj = policyInfo;
  }

  /**
   * To format terms
   * @param any termObj
   */
  formatTerms(termObj: any) {
    const formattedTerm = this.carrierHelper.getFormattedPlanTerms(termObj);

    return formattedTerm;
  }

  /**
   * To get rider commission object
   * @param any policyInfo
   */
  getRiderCommissionDetails(policyInfo: any) {
    const policyPlanId: string = policyInfo['id'];
    this.getPolicyInformationDetails(policyInfo);

    this.riderCommissionService.getRiderCommission(policyPlanId).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          const resData = res[CommonConstant.DATA];
          this.riderCommissionData = resData;
          this.policyFetchErrorFlag = false;
          this.policyInfoPageShow = true;
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
   * To get rider commission plan type
   */
  getRiderCommissionPlanType() {
    this.riderCommissionService.getRiderCommPlanType().subscribe(
      res => {
        this.policyPlanTypes = res;
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * To set rider commission index
   * By clicking on rider commission list
   * @param number index
   */
  setRiderIndex(index: number) {
    this.riderIndex = index;
  }

  /**
   * Sidebar child component event listener
   * @param any event
   */
  onRiderCommChanged(event: any) {
    if (event) {
      if (this.planInfoRiderDisplayFlag) {
        this.getPlanRiderDetails(this.planRiderData);
      } else {
        // refresh rider meta data after updating
        this.getScrapedPlanRiderCommissionRates();
      }
    }
  }

  /**
   * Sidebar child component event listener
   * @param any event
   */
  onPlanRiderCommChanged(event: any) {
    if (event) {
      this.policyInfoCount = false;
      this.planRiders.push(event);
      this.getPlanRiderDetails(event);
    }
  }

  /**
   * Edit Integration
   */

  /**To create rider commission form */
  createRiderCommissionForm() {
    return this.riderCommForm = this._fb.group({
      riderName: [''],
      riderId: [''],
      carrierRiderId: [''],
      commissionList: this._fb.array([
        this.carrierHelper.initRiderComm()
      ])
    })
  }

  /**To add new rateList */
  addRiderCommission(): void {
    const control = <FormArray>this.riderCommForm.controls['commissionList'];
    control.push(this.carrierHelper.initPolicyComm());
  }

  /**To remove existing rateList */
  removeRiderCommission(j: number) {
    const control = <FormArray>this.riderCommForm.controls['commissionList'];
    control.removeAt(j);
  }

  /**To add new product options */
  addRiderRates(j: number, k: number) {
    // tslint:disable-next-line:max-line-length
    const formValue = <FormArray>this.riderCommForm.controls['commissionList']['controls'][j].controls['rateList'].controls[k].getRawValue();
    const control = <FormArray>this.riderCommForm.controls['commissionList']['controls'][j].controls['rateList'];
    // control.push(this.carrierHelper.initializeRiderRates());
    control.push(this.carrierHelper.patchCommissionRateValue(formValue));
  }

  /**To remove existing product options */
  removeRiderRates(j: number, k: number) {
    // tslint:disable-next-line:max-line-length
    const control = <FormArray>this.riderCommForm.controls['commissionList']['controls'][j].controls['rateList'];
    control.removeAt(k);
  }

  /** To remove commission list control */
  removeRiderCommFormCommissionListControl() {
    const control = <FormArray>this.riderCommForm['controls'].commissionList;
    const controlLength = this.riderCommForm['controls'].commissionList['controls'].length;
    for (let i = controlLength - 1; i >= 0; i--) {
      control.removeAt(i);
    }
  }

  /**
   * To open commission rate modal
   * @param TemplateRef template
   * @param any riderComm
   */
  openRiderCommRateModal(template: TemplateRef<any>, riderComm: any) {
    // this.getformatRiderTermList(this.planRiderData);
    this.removeRiderCommFormCommissionListControl();
    const riderCommControl = <FormArray>this.riderCommForm.controls['commissionList'];
    // riderCommControl.removeAt(0);
    riderCommControl.push(this.carrierHelper.initRiderComm(riderComm, 0));
    const riderCommRateControl = <FormArray>this.riderCommForm.controls['commissionList']['controls'][0].controls['rateList'];
    riderCommRateControl.removeAt(0);
    riderComm['commissionRates'].forEach(element => {
      riderCommRateControl.push(this.carrierHelper.initializeRates(element, riderComm));
    });
    this.riderCommRateModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, {class: 'modal-xl'}));
  }

  /** To close commission rate modal */
  closeRiderCommRateModal() {
    if (this.riderCommRateModalRef) {
      this.riderCommRateModalRef.hide();
      this.riderCommRateModalRef = null;
    }
  }

  /** To format commission term */
  formatCommissionTerm(commTerm) {
    const formattedCommTerm = this.carrierHelper.getFormattedCommissionTerm(commTerm);
    return formattedCommTerm;
  }

  /**
   * 
   * @param any planRiderData
   */
  getformatRiderTermList(planRiderData) {
    if (planRiderData && Object.keys(planRiderData).length > 0) {
      this.riderTermList = this.carrierHelper.getFormattedPlanTermList(planRiderData['policyPlanRiderTerms']);
    }
  }

  /**
   * To show notification(emitting from app percentage directive)
   * @param event - message
   */
  showNotification(event) {
    if (event) {
      if (!this.notificationComponent.modalRef) {
        this.notificationComponent.notificationMessage = event;
        this.notificationComponent.openComonNotificationModal();
      }
    }
  }

  /**
   * Integration of scraped carrier plan information
   */
  getScrapedCarrierPlanInformation() {
    const carrierData = this.carrierHelper.getCarrierPlanScrapedData();
    this.policyFetchErrorFlag = false;
    this.policyInfoPageShow = true;

    this.getPlanInfo(carrierData);
  }

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
            this.planObject = resData;
            this.overviewError = false;
            // this.planMetaData = resData;
            this.scrapedPlanInfoData = resData['riders'];
            this.formatScrapedPlanData();
          } else {
            this.loaderService.hide();
            this.overviewError = true;
            this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          this.overviewError = true;
          this.notificationComponent.openNotificationModal();
        }
      )
  }

  formatScrapedPlanData() {
    this.scrapedPlanInfoData.forEach((element) => {
      this.setFilerData(element);
    });
  }

  setFilerData(element) {
    if ($.inArray(element.name, this.productNameFilterList) < 0) {
      this.productNameFilterList.push(element.name);
    }
  }

  /** Filter definition */
  initFilterObject() {
    this.Filter['planRiderName'] = [];
  }

  // To remove splicePlanRiderName name form Filter.splicePlanRiderName list
  splicePlanRiderName = (index) => {
    if (this.Filter['planRiderName'].length === 1) {
      this.planRiderName = '';
    }
    this.Filter['planRiderName'].splice(index, 1);
  }

  // function to clear all the filter
  clearAllFilter = () => {
    this.Filter['planRiderName'] = [];

    this.planRiderName = '';
  }

  applyFilter() {
    if (this.planRiderName === '' || this.planRiderName === undefined) {
      this.Filter.planRiderName = [];
    } else {
      if ($.inArray(this.planRiderName, this.Filter.planRiderName) < 0) {
        this.Filter.planRiderName.push(this.planRiderName);
      }
    }
  }


  getScrapedRiderInfo(riderInfo, index: number) {
    this.planRiderData = riderInfo;
    this.riderCommission = riderInfo;
    this.setRiderIndex(index);
    this.showPlanRiderList = false;
    this.planInfoRiderDisplayFlag = false;

    /* setTimeout(() => {
      this.getScrapedPlanRiderCommissionRates();
    }, 200); */
  }

  getScrapedPlanRiderCommissionRates() {
    let requestData: Object = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    requestData[CarrierConstant.POLICY_PLAN_ID] = this.planObject[CommonConstant.PLAIN_ID];
    requestData[CommonConstant.PLAIN_ID] = this.planRiderData[CommonConstant.PLAIN_ID];

    requestData = JSON.stringify(requestData);
    this.riderCommissionService.getPlanRiderCommissionRates(requestData).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            const resData: any = res[CommonConstant.DATA]['riderSubterms'];
            if (resData['riderSubterms']) {
              this.planRiderCommissionRates = resData;
            } else {
              this.planRiderCommissionRates = [];
            }
          } else {
            this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          this.notificationComponent.openNotificationModal();
        }
      )
  }

  visitRespectivePage(obj) {
    const urlToRedirect = obj.carrierData.url;
    window.open(urlToRedirect, '_blank');
  }

}
