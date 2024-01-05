import {
  Component, OnInit, OnChanges, ViewChild, TemplateRef, Input, Output, EventEmitter, OnDestroy,
  ViewContainerRef
} from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../../shared/common/modal.config';

import { IMyDpOptions, IMyDateModel, MyDatePicker } from 'mydatepicker';
import { CommonHttpAdapterService } from '../../adapters/common-http-adapter.service';
import { CommonService } from '../../services/common/common.service';
import { CommonHelperService } from '../../helpers/common/common.helper';
import { CarrierHelper } from '../../helpers/carrier/carrier.helper';
import { ClientHelper } from '../../helpers/client/client.helper';
import { FormHelper } from '../../helpers/form/form.helper';
import { DropdownComponent } from '../../shared/dropdown/dropdown.component';

import { CommonConstant } from '../../constants/common/common.constant';
import { ClientConstant } from '../../constants/client/client.constant';
import { CarrierConstant } from '../../constants/carrier/carrier.constant';

import { AccountService } from '../../account/account.service';

/** Jquery Integration */
declare var $: any;

/**
 * Add new policy component class
 */
@Component({
  selector: 'app-new-policy',
  templateUrl: './new-policy.component.html',
  styleUrls: ['../shared.component.css'],
  providers: [
    ClientHelper, CommonService, CommonHelperService, CommonHttpAdapterService,
    FormHelper, RxJSHelper, AccountService
  ]
})
export class NewPolicyComponent implements OnInit, OnDestroy {

  /** Policy modal reference */
  @ViewChild('policyModal') policyModal: TemplateRef<any>;

  /** Commission projection modal reference */
  @ViewChild('commissionProjectionModal') commissionProjectionModal: TemplateRef<any>;

  /** Dropdown component reference */
  @ViewChild('dropdownComponent') dropdownComponent: DropdownComponent;

  /** Combine import new rider modal reference */
  @ViewChild('combineImportAddNewRiderModal') combineImportAddNewRiderModal: TemplateRef<any>;

  /** Date picker reference */
  @ViewChild('myDatePicker', { read: ViewContainerRef }) myDatePicker: MyDatePicker;

  /** Carrier modal  */
  @ViewChild('carrierInfoModal') carrierInfoModal: TemplateRef<any>;

  /** Plan info modal reference */
  @ViewChild('planInfoModal') planInfoModal: TemplateRef<any>;

  /** rider modal reference */
  @ViewChild('riderModal') riderModal: TemplateRef<any>;

  public carriers: any[] = [];
  public clientData: any[] = [];
  public advisorList: any[] = [];
  public advisoryGroupList: any[] = [];
  public statusList: any[] = [];
  public BSCAppliedList: any[] = [];
  public mainPolicyObject: any = {};
  public currencyList: any[] = [];
  public popularCurrencyList: any[] = [];

  @Output() onNewPolicyChanged: EventEmitter<any> = new EventEmitter();

  public modalRef: BsModalRef;
  public commProjectionModalRef: BsModalRef;

  public dayList: any = [];
  public monthList: any = [];
  public yearList: any = [];

  public mainPolicyForm: FormGroup;
  public mainPolicies: Array<any> = [];

  public totalPremiumAmount = 0;
  public totalPolicyPremiumAmount = 0;
  public totalRiderPremiumAmount = 0;
  public totalCommissionModel = 0;
  public totalAnnualizedCommissionPremium = 0;
  public selcectedCurrencySymbol;

  public policyInformationData: any[] = [];
  public policyPlanTerms: any[] = [];
  public policyPlanRiders: any[] = [];
  public policyRiders: any[] = [];
  public carrier: any = '';
  public planInfo = '';
  public primaryInsuredType = '';
  public clients: any[] = [];
  public policyPremiumFrequency = '';
  public policyPayableDate: any = '';
  public client: any = '';
  public primaryInsured: any = '';
  public advisorId: any = '';
  public policyProcessId = '';
  public policyResponseData: any = {};
  public policyPlanRiderTerms: any[] = [];
  public policyPlanRiderTermObj: any = {};

  addPolicyLoader = false;
  disablePlanDetailTab = false;
  disablePremiumDetailTab = false;

  riderAttached = false;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
  };

  private policyInputFieldChanged = false;

  public showCopyAndCreateNew = false;

  // new rider declaration
  combineImportAddNewRiderModalRef: BsModalRef;
  public selectedCarrierId: string;
  public selectedPolicyPlanId: string;

  /**add new carrier */
  public carrierInfoForm: FormGroup;
  private carrierInfoModalRef: BsModalRef;
  public phoneTypeList: any[] = [];
  public addressTypeList: any[] = [];
  private imageFile: any = {};
  public carrierFormButton = false;
  public carrierInfoDataLoading = false;

  /**add new plan */
  public policyInfoForm: FormGroup;
  private planInfoModalRef: BsModalRef;
  public policyTypes: any[] = [];
  public policyPlanTypes: any[] = [];
  public copyAndCreateNewDataLoading = false;

  /**add new plan rider declaration */
  public riderInfoForm: FormGroup;
  private riderInfoModalRef: BsModalRef;
  public carrierPlanData: any[] = [];
  public addRiderLoader = false;

  /** @ignore */
  constructor(
    private _fb: FormBuilder,
    private modalService: BsModalService,
    private clientHelper: ClientHelper,
    private carrierHelper: CarrierHelper,
    private modalConfig: ModalConfig,
    private commonService: CommonService,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private commonHelperService: CommonHelperService,
    private domSanitizer: DomSanitizer,
    private formHelper: FormHelper,
    private rxjsHelper: RxJSHelper,
    private accountService: AccountService
  ) { }

  /** @ignore */
  ngOnInit() {
    this.createMainPolicyForm();

    this.dayMonthYearList();
    this.getCurrencies();
    // this.getClients();
    // this.getAdvisors();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeModalServices.next();
    this.rxjsHelper.unSubscribeModalServices.complete();

    // unsubscribe event emitters
    this.onNewPolicyChanged.unsubscribe();
    // close modals
    this.closeCombineImportAddNewRiderModal();
    this.closePolicyModal();
    // this.mainPolicyForm.valueChanges.takeUntil(this.rxjsHelper.unSubscribeModalServices);
  }

  /** To get month, day, and years list */
  dayMonthYearList() {
    this.dayList = this.commonHelperService.getDayList();
    this.monthList = this.commonHelperService.getMonthList();
    this.yearList = this.commonHelperService.getYearList();
  }

  /**To get contact information */
  getCarrierInfo() {
    this.accountService.getCarriers().subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // console.log(res);
            this.carriers = res[CommonConstant.DATA];
          } else {
            // console.log(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          console.log('Something went wrong');
        }
      )
  }

  /**
   * To get all client details
   */
  getClients() {
    this.accountService.getClients().subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            const resData = res[CommonConstant.DATA];
            this.clientData = resData;
            this.combineIndividualAndBusinessClient(resData);
          }
        },
        error => {
          console.log(error);
        }
      )
  }

  /**
   * To get all registered advisors
   */
  getAdvisors() {
    this.accountService.getAdvisors().subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.advisorList = res[CommonConstant.DATA]['advisors'];
          } else {
            console.log(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          console.log(error);
        }
      )
  }

  /**
   * To combine all list into one
   * @param resData
   */
  combineIndividualAndBusinessClient(resData) {
    const list1: any[] = [];

    if (resData.hasOwnProperty('individualClients')) {
      Array.prototype.push.apply(list1, resData['individualClients']);
    }
    if (resData.hasOwnProperty('businessClients')) {
      Array.prototype.push.apply(list1, resData['businessClients']);
    }
    this.clientData = list1;
  }

  /**
   * To get policy status
   */
  getPolicyStatus() {
    const type = CommonConstant.DROPDOWN_STATUS_TYPE;
    this.accountService.getDropdownList(type).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.statusList = res[CommonConstant.DROPDOWN_LIST];
          } else {
            // console.log(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          console.log(error);
        }
      )
  }

  /**
   * To get policy status
   */
  getCurrencies() {
    this.accountService.getCurrenyList().subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // this.currencyList = res[CommonConstant.DATA].currencyList;
            this.currencyList = res['currencyList'];
            this.makePopularCurrencyList();
          } else {
            // console.log(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          console.log(error);
        }
      )
  }

  /** To filter out popular currencies from list of currencies */
  makePopularCurrencyList = () => {
    this.popularCurrencyList = [];
    this.currencyList.forEach((element) => {
      if (element.popular) {
        this.popularCurrencyList.push(element);
      }
    })
  }

  /**
   * To move to second tab
   */
  goToStepTwo() {
    $('.nav-tabs a[href="#stepTwo"]').tab('show'); // move to premium details
  }

  /**
   * To open main policy modal
   */
  openMainPolicyModal(selectionFlag) {
    this.getCarrierInfo();
    this.getPolicyStatus();

    this.createMainPolicyForm();
    this.detectPolicyPremiumChange();
    this.detectRiderPremiumChange();

    setTimeout(() => {
      if (selectionFlag === 'addnew') {
        setTimeout(() => {
          this.onCurrencyChange();
        }, 300);
      } else {
        if (this.mainPolicyObject && Object.keys(this.mainPolicyObject).length > 0) {
          this.onCurrencyChange(this.mainPolicyObject[CommonConstant.CURRENCY]);
          this.formatMainPolicyData(this.mainPolicyObject);
        }
      }
      this.disablePremiumDetailTab = true;
      // to open modal
      this.modalRef = this.modalService.show(this.policyModal, Object.assign({}, this.modalConfig.config, { class: 'modal-lg' }));
    }, 300);

  }

  /**
   * To close policy modal
   */
  closePolicyModal() {
    // this.mainPolicyForm.valueChanges.takeUntil(this.rxjsHelper.unSubscribeModalServices);

    if (this.modalRef) {

      // close mydatepicker instance
      /* this.myDatePicker.globalListener();
      this.myDatePicker.ngOnDestroy(); */
      setTimeout(() => {
        this.modalRef.hide();
        this.modalRef = null;
      });
    }
    this.disablePlanDetailTab = false; // enable first tab
    this.disablePremiumDetailTab = false; // enable 2nd tab
    this.riderAttached = false;

    this.rxjsHelper.unSubscribeModalServices.next();
    this.rxjsHelper.unSubscribeModalServices.complete();
  }

  /**
   * To get premium mode value
   * @param mode
   */
  getPremiumModeValue(mode) {
    let modeValue;
    switch (mode) {
      case 'annually':
        modeValue = 1;
        break;
      case 'semi-annually':
        modeValue = 2;
        break;
      case 'quarterly':
        modeValue = 4;
        break;
      case 'monthly':
        modeValue = 12;
        break;
      case 'na':
        modeValue = 1;
        break;
      default:
        modeValue = 1;
        break;
    }

    return modeValue;
  }

  /**To detect Policy Premium changes */
  detectPolicyPremiumChange() {
    const nameControl = <FormArray>this.mainPolicyForm.controls['policyPremium'];
    nameControl.valueChanges.forEach(
      (value: any) => {
        this.totalPolicyPremium(value);
      }
    );
    // nameControl.valueChanges.takeUntil(this.rxjsHelper.unSubscribeModalServices);
  }

  /**
   * To calculate total policy premium
   * @param value
   */
  totalPolicyPremium(value) {
    let total = 0;
    let totalPolicyPrem = 0;
    let totalComm = 0;
    let totalCommModel = 0;
    let totalCommAnnualized = 0;
    let totalCommAnnualizedPremium = 0;
    value.forEach(element => {
      // tslint:disable-next-line:max-line-length
      /* totalPolicyPrem = this.getPremiumModeValue(this.policyPremiumFrequency) * this.formHelper.removeCommaFromNumber(element['premium'].amount) +
      this.getPremiumModeValue(this.policyPremiumFrequency) * this.formHelper.removeCommaFromNumber(element['loadingPremium'].amount); */
      // tslint:disable-next-line:max-line-length
      totalPolicyPrem = this.getPremiumModeValue(this.policyPremiumFrequency) * this.formHelper.removeCommaFromNumber(element['premium'].amount);
      total += totalPolicyPrem;
      // commission model
      // tslint:disable-next-line:max-line-length
      totalCommModel = this.formHelper.removeCommaFromNumber(element['premium'].amount) - this.formHelper.removeCommaFromNumber(element['loadingPremium'].amount);
      totalComm += totalCommModel;

      if (element['targetPremiumApplicable']) {
        // commission annualized premium
        // tslint:disable-next-line:max-line-length
        totalCommAnnualized = this.formHelper.removeCommaFromNumber(element['targetPremium'].targetPremium) * this.getPremiumModeValue(element['targetPremium']['targetPremiumFrequency']);
        totalCommAnnualizedPremium += totalCommAnnualized;
      } else {
        // commission annualized premium
        totalCommAnnualized = totalCommModel * this.getPremiumModeValue(this.policyPremiumFrequency);
        totalCommAnnualizedPremium += totalCommAnnualized;
      }
    });
    this.totalPolicyPremiumAmount = total;
    this.totalCommissionModel = totalComm;
    this.totalAnnualizedCommissionPremium = totalCommAnnualizedPremium;
    this.calculateTotalPremiumAmount();
  }

  /**To detect rider Premium changes */
  detectRiderPremiumChange() {
    const nameControl = <FormArray>this.mainPolicyForm.controls['riderPremium'];
    nameControl.valueChanges.forEach(
      (value: any) => {
        this.totalRiderPremium(value);
      }
    );
    // nameControl.valueChanges.takeUntil(this.rxjsHelper.unSubscribeModalServices);
  }

  /**
   * To calculate total rider premium
   * @param value
   */
  totalRiderPremium(value) {
    let total = 0;
    let totalRiderPrem = 0;
    value.forEach(element => {
      // tslint:disable-next-line:max-line-length
      /* totalRiderPrem = this.getPremiumModeValue(this.policyPremiumFrequency) * this.formHelper.removeCommaFromNumber(element['premium'].amount) +
      this.getPremiumModeValue(this.policyPremiumFrequency) * this.formHelper.removeCommaFromNumber(element['loadingPremium'].amount); */
      // tslint:disable-next-line:max-line-length
      totalRiderPrem = this.getPremiumModeValue(this.policyPremiumFrequency) * this.formHelper.removeCommaFromNumber(element['premium'].amount);
      total += totalRiderPrem;
    });
    this.totalRiderPremiumAmount = total;
    this.calculateTotalPremiumAmount();
  }

  calculateTotalPremiumAmount() {
    this.totalPremiumAmount = 0;
    this.totalPremiumAmount = this.totalPolicyPremiumAmount + this.totalRiderPremiumAmount;
  }

  /**
   * To create main policy
   */
  createMainPolicyForm() {
    this.mainPolicyForm = this._fb.group({
      planTerm: [''],
      holdingId: [''],
      policyCover: [''],
      carrierName: [''],
      carrierAbbr: [{ value: '', disabled: true }],
      policyName: [''],
      policyType: [{ value: '', disabled: true }],
      planType: [''],
      policyNumber: [''],
      policyTermMonth: [''],
      policyTermYear: [''],
      currency: [''],
      premiumFrequency: [''],
      premiumPayableTermMonth: [''],
      premiumPayableTermYear: [''],
      basicFaceValue: [''],
      bscApplied: [''],
      indeminity: [''],
      death: [''],
      permanentDisability: [''],
      criticalIllness: [''],
      accidentalDeath: [''],
      productName: [''],
      options: [''],
      effectiveDate: [''],
      maturityDate: [''],
      status: [''],
      statusDate: [{ value: '', disabled: true }],
      contactName: [''],
      contactId: [''],
      clientSameAsPrimaryInsured: [true],
      primaryInsuredList: this._fb.array([
        this.initPrimaryInsured()
      ]),
      ippAdvisoryGroup: [''],
      premiumMode: [''],
      /* premium: [''],
      loadingPremium: [''], */
      basicFace: [''],
      remarks: [''],
      amount: [''],
      allRiders: this._fb.array([
        this.initRider()
      ]),
      advisors: this._fb.array([
        this.initAdvisor()
      ]),
      policyPremium: this._fb.array([
        this.clientHelper.initPolicyPremium()
      ]),
      riderPremium: this._fb.array([
        this.clientHelper.initRiderPremium()
      ])
    })
  }

  /**
   * To get main policy object
   * @param mainPolicy
   */
  formatMainPolicyData(mainPolicy) {
    if (Object.keys(mainPolicy).length > 0) {
      let mainPolicyObject = {};
      mainPolicyObject = mainPolicy;
      this.setMainPolicyFormData(mainPolicyObject);
      setTimeout(() => {
        if (mainPolicyObject[CarrierConstant.CARRIER_ID]) {
          const carrierId = mainPolicyObject[CarrierConstant.CARRIER_ID];
          this.onCarrierSelect(carrierId);
          setTimeout(() => {
            const planId = this.mainPolicyObject['planId'];
            this.onPlanSelect(planId);
          }, 200);
        }
      }, 300);
    } else {
      this.createMainPolicyForm();
    }
  }

  /**
   * To set main policy object data into form
   */
  setMainPolicyFormData(mainPolicyObject) {
    if (Object.keys(this.mainPolicyObject).length > 0) {
      let effectiveDate = '', statusDate = '', maturityDate = '', planTerm = '', premiumPayableTermMonth = '', premiumPayableTermYear = '';
      if (mainPolicyObject['policyPlanTerm']) {
        planTerm = mainPolicyObject['policyPlanTerm'].id;
      }
      if (mainPolicyObject[ClientConstant.EFFECTIVE_DATE]) {
        effectiveDate = this.commonHelperService.displayDateFormatMyDatePicker(mainPolicyObject[ClientConstant.EFFECTIVE_DATE]);
      }
      if (mainPolicyObject[ClientConstant.POLICY_MATURITY_DATE]) {
        maturityDate = this.commonHelperService.displayDateFormatMyDatePicker(mainPolicyObject[ClientConstant.POLICY_MATURITY_DATE]);
      }
      if (mainPolicyObject[ClientConstant.POLICY_STATUS_DATE]) {
        statusDate = this.commonHelperService.displayDateFormatMyDatePicker(mainPolicyObject[ClientConstant.POLICY_STATUS_DATE]);
      }
      if (mainPolicyObject[ClientConstant.POLICY_STATUS]) {
        status = mainPolicyObject[ClientConstant.POLICY_STATUS].value;
      }
      if (mainPolicyObject[CarrierConstant.PREMIUM_PAYABLE_TERM]) {
        premiumPayableTermMonth = String(this.carrierHelper.getCommissionTermMonth(mainPolicyObject[CarrierConstant.PREMIUM_PAYABLE_TERM]));
        premiumPayableTermYear = String(this.carrierHelper.getCommissionTermYear(mainPolicyObject[CarrierConstant.PREMIUM_PAYABLE_TERM]));
      }
      let policyTermMonth: number, policyTermYear: number;
      if (mainPolicyObject[CarrierConstant.POLICY_TERM]) {
        policyTermMonth = this.carrierHelper.getCommissionTermMonth(mainPolicyObject[CarrierConstant.POLICY_TERM]);
        policyTermYear = this.carrierHelper.getCommissionTermYear(mainPolicyObject[CarrierConstant.POLICY_TERM]);
      }
      this.mainPolicyForm.patchValue({
        carrierName: mainPolicyObject[CarrierConstant.CARRIER_ID],
        policyName: mainPolicyObject['planId'],
        planTerm: planTerm,
        policyTermMonth: policyTermMonth,
        policyTermYear: policyTermYear,
        policyNumber: mainPolicyObject[ClientConstant.POLICY_NUMBER],
        effectiveDate: effectiveDate,
        status: status,
        statusDate: statusDate,
        maturityDate: maturityDate,
        premiumMode: mainPolicyObject[ClientConstant.POLICY_PREMIUM_MODE],
        premiumPayableTermMonth: premiumPayableTermMonth,
        premiumPayableTermYear: premiumPayableTermYear,
        currency: mainPolicyObject[CommonConstant.CURRENCY],
        basicFaceValue: mainPolicyObject[ClientConstant.BASIC_FACE_VALUE],
        bscApplied: mainPolicyObject[ClientConstant.BSC_APPLIED],
        indeminity: mainPolicyObject[ClientConstant.INDEMINITY_APPLICABLE],
        death: mainPolicyObject[ClientConstant.DEATH],
        permanentDisability: mainPolicyObject[ClientConstant.PERMANENT_DISABLITY],
        criticalIllness: mainPolicyObject[ClientConstant.CRITICAL_ILLNESS],
        accidentalDeath: mainPolicyObject[ClientConstant.ACCIDENTAL_DEATH],
      })

      // policy premiums
      this.formHelper.clearFormArray(this.mainPolicyForm, 'policyPremium');
      const policyPremiumControl = <FormArray>this.mainPolicyForm.controls['policyPremium'];
      if (mainPolicyObject['loadingPremium'] > 0) {
        const premium = mainPolicyObject[ClientConstant.PREMIUM];
        const loadingPremium = mainPolicyObject[ClientConstant.LOADING_PREMIUM];
        const targetPremiumApplicable = mainPolicyObject[ClientConstant.TARGET_PREMIUM_APPLICABLE];
        const targetPremium = mainPolicyObject[ClientConstant.TARGET_PREMIUM];
        const targetPremiumFrequency = mainPolicyObject[ClientConstant.TARGET_PREMIUM_FREQUENCY];
        const premiumFreq = mainPolicyObject[ClientConstant.PREMIUM_FREQUENCY];
        this.policyPremiumFrequency = premiumFreq;

        policyPremiumControl.push(this.clientHelper.initPolicyPremium(premium, loadingPremium, premiumFreq,
          targetPremiumApplicable, targetPremium, targetPremiumFrequency));
      } else {
        policyPremiumControl.push(this.clientHelper.initPolicyPremium());
      }
      // rider premiums
      this.formHelper.clearFormArray(this.mainPolicyForm, 'riderPremium');
      const riderPremiumControl = <FormArray>this.mainPolicyForm.controls['riderPremium'];
      if (mainPolicyObject['riderPremium'].length > 0) {
        const premiumFreq = mainPolicyObject[ClientConstant.PREMIUM_FREQUENCY];
        mainPolicyObject['riderPremium'].forEach(element => {
          riderPremiumControl.push(this.clientHelper.initRiderPremium(element, premiumFreq));
        });
      } else {
        riderPremiumControl.push(this.clientHelper.initRiderPremium());
      }
      // advisors
      this.formHelper.clearFormArray(this.mainPolicyForm, 'advisors');
      const advisorControl = <FormArray>this.mainPolicyForm.controls['advisors'];
      if (mainPolicyObject['allAdvisors'].length > 0) {
        mainPolicyObject['allAdvisors'].forEach(element => {
          advisorControl.push(this.initAdvisor(element));
        });
      } else {
        advisorControl.push(this.initAdvisor());
      }
      // primary Insured List
      const primaryInsuredControl = <FormArray>this.mainPolicyForm.controls['primaryInsuredList'];
      if (mainPolicyObject[ClientConstant.INSURED_LIST].length > 0) {
        mainPolicyObject[ClientConstant.INSURED_LIST].forEach(element => {
          if (mainPolicyObject['clientSameAsPrimaryInsured']) {
            this.mainPolicyForm.patchValue({
              contactName: element[CommonConstant.NAME]
            })
          } else {
            this.formHelper.clearFormArray(this.mainPolicyForm, 'primaryInsuredList');
            primaryInsuredControl.push(this.initPrimaryInsured(element));
          }
        });
      } else {
        primaryInsuredControl.push(this.initPrimaryInsured());
      }
    }
  }

  /**
   * To initialize advisor
   */
  initRider() {
    return this._fb.group({
      rider: ['']
    })
  }

  /**
  * To initialize advisor
  */
  initAdvisor(element?) {
    let primarySelected: boolean;
    if (element) {
      if (typeof element === 'object') {
        return this._fb.group({
          advisor: element[CommonConstant.PLAIN_ID],
          commissionPercent: element[ClientConstant.COMMISSION_PERCENT],
          ippAdvisoryGroup: element[ClientConstant.ADVISORY_GROUP_ID],
          primary: element[CommonConstant.PRIMARY],
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

  /** To check array value */
  toCheckArrayValue(arr: any[]) {
    const len = arr.every(v => v['commissionPercent'] === arr[0].commissionPercent);
  }

  /** To calculate commission percent */
  calcuateCommissionPercent() {
    setTimeout(() => {
      const control = <FormArray>this.mainPolicyForm.controls['advisors'];
      const controlLength = control.length;
      let commissionPercent: number = 100 / controlLength;
      commissionPercent = Number(this.commonHelperService.formatNumberWithComma(commissionPercent));
      let reqData;
      const arrayFlag: any = this.toCheckArrayValue(control.value);
      if (!arrayFlag) {
        for (let j = controlLength - 1; j >= 0; j--) {
          reqData = {
            commissionPercent: commissionPercent
          }
          control.controls[j].patchValue(reqData);
        }
      }
    }, 200);
  }

  /**To add phone numbers */
  addPrimaryAdvisor() {
    const control = <FormArray>this.mainPolicyForm.controls['advisors'];
    control.push(this.initAdvisor('addnew'));
    this.calcuateCommissionPercent();
  }

  /**To remove phone numbers */
  removePrimaryAdvisor(i: number) {
    const control = <FormArray>this.mainPolicyForm.controls['advisors'];
    control.removeAt(i);
    this.calcuateCommissionPercent();
  }

  /**
   * To make primary advisor
   * @param number i
   * @param any e
   */
  onAdvisorPrimaryChange(i: number, e: any) {
    const control = <FormArray>this.mainPolicyForm.controls['advisors'];
    const advisorListLength = this.mainPolicyForm.controls['advisors']['controls'].length;
    for (let index = 0; index < advisorListLength; index++) {
      control.controls[index].patchValue({
        primary: false
      });
    }
    setTimeout(() => {
      control.controls[i].patchValue({
        primary: true
      });
    }, 300);
  }

  /**
   * To add policy premium
   */
  addPolicyPremium() {
    const control = <FormArray>this.mainPolicyForm.controls['policyPremium'];
    control.push(this.clientHelper.initPolicyPremium());
  }

  /**
   * To remove policy premium
   * @param number i
   */
  removePolicyPremium(i: number) {
    const control = <FormArray>this.mainPolicyForm.controls['policyPremium'];
    control.removeAt(i);
  }

  /**To add rider premium */
  addRiderPremium() {
    const control = <FormArray>this.mainPolicyForm.controls['riderPremium'];
    control.push(this.clientHelper.initRiderPremium());
    setTimeout(() => {
      this.changePolicyPremiumFrequency();
    }, 300);
  }

  /**
   * To remove rider premium
   * @param number i
   */
  removeRiderPremium(i: number) {
    const control = <FormArray>this.mainPolicyForm.controls['riderPremium'];
    control.removeAt(i);
  }

  /**
   * To initial primary insured
   * @param any element
   */
  initPrimaryInsured(element?) {
    if (element) {
      return this._fb.group({
        id: element[CommonConstant.PLAIN_ID],
        primaryInsured: element[CommonConstant.NAME],
        primaryInsuredType: element[ClientConstant.INSURED_TYPE],
      })
    } else {
      return this._fb.group({
        id: [''],
        primaryInsured: [''],
        primaryInsuredType: [''],
      })
    }
  }

  /** To add primary assured */
  addPrimaryInsured() {
    const control = <FormArray>this.mainPolicyForm.controls['primaryInsuredList'];
    control.push(this.initPrimaryInsured());
  }

  /**
   * To delete primary assured
   * @param number i
   */
  removePrimaryInsured(i: number) {
    const control = <FormArray>this.mainPolicyForm.controls['primaryInsuredList'];
    control.removeAt(i);
  }

  /**
   * To format terms
   * @param any termObj
   */
  formatTerms(termObj) {
    const formattedTerm = this.carrierHelper.getFormattedPlanTerms(termObj);

    return formattedTerm;
  }

  /**
   * Called on carrier change
   * @param any carrierInfoId
   */
  onCarrierSelect(carrierInfoId?) {
    let carrierId;
    if (carrierInfoId) {
      carrierId = carrierInfoId;
    } else {
      carrierId = this.mainPolicyForm.get('carrierName').value;
    }
    if (carrierId) {
      this.selectedCarrierId = carrierId;
      this.policyInformationData = [];
      this.carriers.forEach(element => {
        if (element[CommonConstant.PLAIN_ID] === carrierId) {
          this.mainPolicyForm.patchValue({ 'carrierAbbr': element['abbreviation'] });
          this.getPolicyInformation(carrierId);
        }
      });
    }
  }

  /**
   * To get policy information
   * @param any carrierId
   */
  getPolicyInformation(carrierId) {
    this.accountService.getPolicyInformation(carrierId).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.policyInformationData = res[CommonConstant.DATA];
          }
        },
        error => {
          console.log('Something went wrong');
        }
      )
  }

  /**
   * Called on plan change
   * @param string planInfoId
   */
  onPlanSelect(planInfoId?: string) {
    let planId;
    if (planInfoId) {
      planId = planInfoId;
    } else {
      planId = this.mainPolicyForm.get('policyName').value;
    }
    if (planId) {
      this.selectedPolicyPlanId = planId;
      this.policyPlanRiders = [];
      this.policyInformationData.forEach((element, key) => {
        // tslint:disable-next-line:triple-equals
        if (element['id'] == planId) {
          this.mainPolicyForm.patchValue({ 'policyType': element['planType'] });

          const carrierId = this.mainPolicyForm.get('carrierName').value;
          this.accountService.getRider(carrierId, planId).subscribe(
              res => {
                if (res[CommonConstant.ERROR_CODE] === 0) {
                  const resData = res[CommonConstant.DATA];
                  this.policyPlanRiders = resData;
                  if (this.policyPlanRiders.length > 0) {
                    this.riderAttached = true;
                    // tslint:disable-next-line:no-shadowed-variable
                    this.policyPlanRiders.forEach((riderVal, riderKey) => {
                      this.onPolicyPlanRiderChange(riderKey, riderVal[CommonConstant.PLAIN_ID]);
                    })
                  } else {
                    this.riderAttached = false;
                  }
                } else {
                  // console.log(res[CommonConstant.MESSAGE]);
                }
              },
              error => {
                console.log(error);
              }
            )
        }
      })
    }
  }

  /**
   * To remove form control
   */
  removeControl() {
    const control = <FormArray>this.mainPolicyForm['controls'].riderPremium;
    const controlLength = this.mainPolicyForm['controls'].riderPremium['controls'].length;
    for (let i = controlLength - 1; i >= 0; i--) {
      control.removeAt(i);
    }
  }

  /**
   * To set rider control
   * @param number riderIndex
   */
  setRiderControl(riderIndex?: number) {
    const control = <FormArray>this.mainPolicyForm['controls'].riderPremium;
    this.removeControl();
    setTimeout(() => {
      this.policyRiders.forEach((element) => {
        control.push(this.patchRiderValue(element));
      });
    }, 500);
  }

  /**
   * To set rider obect values
   * @param any element
   */
  patchRiderValue(element: any) {
    return this._fb.group({
      id: element['id'],
      rider: element['name'],
      premium: this.clientHelper.initRidersPremium(),
      loadingPremium: this.clientHelper.initRidersLoadingPremium(),
    })
  }

  /**
   * To change premium Frequency
   */
  changePolicyPremiumFrequency() {
    const control = <FormArray>this.mainPolicyForm['controls'].riderPremium;
    const controlLength = this.mainPolicyForm['controls'].riderPremium['controls'].length;
    let reqData;
    let reqData1;
    for (let i = controlLength - 1; i >= 0; i--) {
      reqData = {
        premium: {
          premiumFrequency: this.policyPremiumFrequency
        }
      }
      reqData1 = {
        loadingPremium: {
          premiumFrequency: this.policyPremiumFrequency
        }
      }
      control.controls[i].patchValue(reqData);
      control.controls[i].patchValue(reqData1);
    }

    // For rider premium
    /* const riderPremcontrol = <FormArray>this.mainPolicyForm['controls'].riderPremium;
    const riderPremiumControlLength = this.mainPolicyForm['controls'].riderPremium['controls'].length;
    let reqData2;
    let reqData3;
    for (let i = riderPremiumControlLength - 1; i >= 0; i--) {
      reqData2 = {
        premium: {
          premiumMode: this.policyPremiumFrequency
        }
      }
      reqData3 = {
        loadingPremium: {
          premiumMode: this.policyPremiumFrequency
        }
      }
      riderPremcontrol.controls[i].patchValue(reqData2);
      riderPremcontrol.controls[i].patchValue(reqData3);
    } */
  }

  /**
   * To set formatted data to form control payableUpto date
   * @param IMyDateModel event
   */
  onPolicyPremiumDateChanged(event: IMyDateModel) {
    // tslint:disable-next-line:max-line-length
    if (event.date) {
      const control = <FormArray>this.mainPolicyForm['controls'].riderPremium;
      const controlLength = this.mainPolicyForm['controls'].riderPremium['controls'].length;
      this.policyPayableDate = this.commonHelperService.displayDateFormat(event.date);
      let reqData;
      let reqData1;
      for (let i = controlLength - 1; i >= 0; i--) {
        reqData = {
          premium: {
            payableUpto: this.commonHelperService.displayDateFormat(event.date)
          }
        }
        reqData1 = {
          loadingPremium: {
            payableUpto: this.commonHelperService.displayDateFormat(event.date)
          }
        }
        control.controls[i].patchValue(reqData);
        control.controls[i].patchValue(reqData1);
      }
    }
  }

  /**
   * To set formatted data to form control payableUpto date
   * @param IMyDateModel event
   */
  onPolicyMaturityDateChanged(event: IMyDateModel) {
    // tslint:disable-next-line:max-line-length
    if (event.date) {

      const policyPremControl = <FormArray>this.mainPolicyForm['controls'].policyPremium;
      const policyPremControlLength = this.mainPolicyForm['controls'].policyPremium['controls'].length;
      let reqData2;
      let reqData3;
      for (let i = policyPremControlLength - 1; i >= 0; i--) {
        reqData2 = {
          premium: {
            payableUpto: this.commonHelperService.displayDateFormat(event.date)
          }
        }
        reqData3 = {
          loadingPremium: {
            payableUpto: this.commonHelperService.displayDateFormat(event.date)
          }
        }
        policyPremControl.controls[i].patchValue(reqData2);
        policyPremControl.controls[i].patchValue(reqData3);
      }

      const control = <FormArray>this.mainPolicyForm['controls'].riderPremium;
      const controlLength = this.mainPolicyForm['controls'].riderPremium['controls'].length;
      this.policyPayableDate = this.commonHelperService.displayDateFormat(event.date);
      let reqData;
      let reqData1;
      for (let i = controlLength - 1; i >= 0; i--) {
        reqData = {
          premium: {
            payableUpto: this.commonHelperService.displayDateFormat(event.date)
          }
        }
        reqData1 = {
          loadingPremium: {
            payableUpto: this.commonHelperService.displayDateFormat(event.date)
          }
        }
        control.controls[i].patchValue(reqData);
        control.controls[i].patchValue(reqData1);
      }
    }
  }

  /** On primary assured change */
  onChangePrimaryInsured() {
    if (this.primaryInsuredType) {
      const clientType = this.primaryInsuredType;
      if (clientType === ClientConstant.CLIENT_TYPE_INDIVIDUAL) {
        if (this.clientData.hasOwnProperty('individualClients')) {
          this.clients = this.clientData['individualClients'];
        }
      } else if (clientType === ClientConstant.CLIENT_TYPE_BUSINESS) {
        if (this.clientData.hasOwnProperty('businessClients')) {
          this.clients = this.clientData['businessClients'];
        }
      }
    }
  }

  /**
   * To format client dropdown data
   * @param any data
   */
  autocompleClientListFormatter = (data: any) => {
    let html;
    if (data['imageIcon']) {
      html = `<div class="prof-img-section">
        <img style="width: 15%; margin-right: 10px" src="${data.imageIcon}">
        <div>
          <span style='color:black'>${data.name} - ${data.company}</span><br /><span>Client Type: ${data.clientType}</span>
        </div>
      </div>`;
    } else {
      html = `<div class="prof-img-section">
          <img style="width: 15%; margin-right: 10px" src="/assets/img/profile_image/prof_placeholder.jpg">
        <div>
          <span style='color:black'>${data.name} - ${data.company}</span><br /><span>Client Type: ${data.clientType}</span>
        </div>
      </div>`;
    }
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * Whenever status will change this function will populate
   * the current date into status date field
   */
  onStatusChange() {
    const status = this.mainPolicyForm.get('status').value;
    if (status) {
      const currentDate = this.commonHelperService.getCurrentDateToDisplay();
      // set current date to status date
      this.mainPolicyForm.patchValue({
        statusDate: currentDate
      })
    } else {
      // reset status field when no status is selected
      this.mainPolicyForm.get('statusDate').reset();
    }
  }

  /**CLient Dropdown select */
  onClientSelect(event) {
    if (typeof event === 'object') {
      this.client = event;
      const clientId = event['id'];
    }
  }

  /**Primary Insured Dropdown select */
  onPrimaryInsuredSelect(event) {
    if (typeof event === 'object') {
      this.primaryInsured = event;
      const clientId = event['id'];
    }
  }

  /**
   * On advisor dropdown change
   * @param number index
   * @param string advisorId
   */
  onAdvisorChange(index: number, advisorId: string) {
    this.advisorId = advisorId;
    let advsorGroupId = '';
    this.advisorList.forEach(element => {
      if (element['id'] === advisorId) {
        advsorGroupId = element['advisorGroupId'];
        if (!advisorId) {
          advisorId = '';
        }
      }
    });
    setTimeout(() => {
      this.mainPolicyForm.controls['advisors']['controls'][index].patchValue({
        ippAdvisoryGroup: advsorGroupId
      })
    }, 300);
  }

  /** To detect advisor list change in the form */
  detectAdvisorChange() {
    const advisorControl = <FormArray>this.mainPolicyForm.controls['advisors'];
    setTimeout(() => {
      advisorControl.valueChanges.forEach((value) => {
        this.patchAdvisorValues(value);
      })
    }, 300);
  }

  /**
   * To populate advisor data
   * @param any value
   */
  patchAdvisorValues(value) {
    if (this.advisorId) {
      const advisoryGrId = value[this.advisorId].advisorGroupId;

      this.mainPolicyForm.controls['advisors']['controls'][this.advisorId].patchValue({
        advisorGroupId: advisoryGrId
      })
    }
  }

  /**
   * Called on plan rider change
   * @param number index
   * @param string policyRiderId
   */
  onPolicyPlanRiderChange(index: number, policyRiderId?: string) {
    let riderId;
    if (policyRiderId) {
      riderId = riderId;
    } else {
      riderId = this.mainPolicyForm.controls['riderPremium']['controls'][index]['controls']['rider'].value;
    }
    if (riderId) {

      // populate death, permanent disability, critical illnes, accidental death
      const death = this.mainPolicyForm.get('death').value;
      const permanentDisability = this.mainPolicyForm.get('permanentDisability').value;
      const criticalIllness = this.mainPolicyForm.get('criticalIllness').value;
      const accidentalDeath = this.mainPolicyForm.get('accidentalDeath').value;
      const riderPremiumControl = <FormArray>this.mainPolicyForm.controls['riderPremium'];
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
    } else {
      this.policyPlanRiderTerms = [];
    }
  }

  /**
   * On currency change display target currency in each and every amount field
   * @param string currCode
   */
  onCurrencyChange(currCode?: string) {
    if (currCode) {
      const currencySymbol = this.commonHelperService.getCurrencySymbol(currCode);
      this.selcectedCurrencySymbol = currencySymbol;
    } else {
      let currencyCode = this.mainPolicyForm.get('currency').value;
      if (currencyCode) {
        const currencySymbol = this.commonHelperService.getCurrencySymbol(currencyCode);
        this.selcectedCurrencySymbol = currencySymbol;
      } else {
        currencyCode = 'SGD';
        const currencySymbol = this.commonHelperService.getCurrencySymbol(currencyCode);
        this.selcectedCurrencySymbol = currencySymbol;
        this.mainPolicyForm.patchValue({
          currency: currencyCode
        });
      }
    }
  }

  /**
   * To set basic face value
   */
  setBasicValueToOtherFields() {
    const basicFaceValue = this.mainPolicyForm.get('basicFaceValue').value;
    if (basicFaceValue) {
      if (!this.policyInputFieldChanged) {
        this.mainPolicyForm.patchValue({
          death: basicFaceValue,
          permanentDisability: basicFaceValue,
          criticalIllness: basicFaceValue,
          accidentalDeath: basicFaceValue,
        })
      }
    }
  }

  /** Called on change plan input field change */
  onChangePopulatedPolicyInputField() {
    this.policyInputFieldChanged = true;
  }

  /**
   * To make request for main policy services(submit and update)
   */
  prepareRequestForInsurance() {
    const mainPolicyFormData = this.mainPolicyForm.getRawValue();
    let mainPolicyData: any = {};
    const carrierId = this.mainPolicyForm.get('carrierName').value;
    if (!carrierId) {
      document.getElementById('addPolicyError').innerHTML = 'Please Select Carrier';
      return;
    }

    mainPolicyData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    // individual values
    if (!mainPolicyFormData['policyName']) {
      document.getElementById('addPolicyError').innerHTML = 'Please Select Plan Name';
      return;
    }
    mainPolicyData[ClientConstant.POLICY_PLAN_ID] = mainPolicyFormData['policyName'];

    if (!mainPolicyFormData['policyNumber']) {
      document.getElementById('addPolicyError').innerHTML = 'Policy number can not be empty';
      return;
    }
    mainPolicyData[ClientConstant.POLICY_NUMBER] = Number(mainPolicyFormData['policyNumber']);

    if (!mainPolicyFormData[CommonConstant.CURRENCY]) {
      document.getElementById('addPolicyError').innerHTML = 'Please Select Currency';
      return;
    }
    const currency = mainPolicyFormData[CommonConstant.CURRENCY];
    /* mainPolicyData[ClientConstant.BASIC_FACE_VALUE] = this.commonHelperService.getMudraStructure(this.formHelper.removeCommaFromNumber
      (mainPolicyFormData['basicFaceValue']), currency); */
    mainPolicyData[ClientConstant.BASIC_FACE_VALUE] = this.formHelper.removeCommaFromNumber(mainPolicyFormData['basicFaceValue']);

    /* mainPolicyData[ClientConstant.DEATH] = this.commonHelperService.getMudraStructure(this.formHelper.removeCommaFromNumber
      (mainPolicyFormData['death']), currency); */

    mainPolicyData[ClientConstant.DEATH] = this.formHelper.removeCommaFromNumber(mainPolicyFormData['death']);
    mainPolicyData[ClientConstant.DEATH_CURRENCY] = currency;

    /* mainPolicyData[ClientConstant.PERMANENT_DISABLITY] = this.commonHelperService.getMudraStructure(this.formHelper.removeCommaFromNumber
      (mainPolicyFormData['permanentDisability']), currency) */;
    mainPolicyData[ClientConstant.PERMANENT_DISABLITY] = this.formHelper.removeCommaFromNumber(mainPolicyFormData['permanentDisability']);
    mainPolicyData[ClientConstant.PERMANENT_DISABLITY_CURRENCY] = currency;

    /* mainPolicyData[ClientConstant.CRITICAL_ILLNESS] = this.commonHelperService.getMudraStructure(this.formHelper.removeCommaFromNumber
      (mainPolicyFormData['criticalIllness']), currency); */
    mainPolicyData[ClientConstant.CRITICAL_ILLNESS] = this.formHelper.removeCommaFromNumber(mainPolicyFormData['criticalIllness']);
    mainPolicyData[ClientConstant.CRITICAL_ILLNESS_CURRENCY] = currency;

    /* mainPolicyData[ClientConstant.ACCIDENTAL_DEATH] = this.commonHelperService.getMudraStructure(this.formHelper.removeCommaFromNumber
      (mainPolicyFormData['accidentalDeath']), currency); */
    mainPolicyData[ClientConstant.ACCIDENTAL_DEATH] = this.formHelper.removeCommaFromNumber(mainPolicyFormData['accidentalDeath']);
    mainPolicyData[ClientConstant.ACCIDENTAL_DEATH_CURRENCY] = currency;

    /* mainPolicyData[ClientConstant.BASIC_FACE_VALUE] = this.formHelper.removeCommaFromNumber(mainPolicyFormData['basicFaceValue']);
    mainPolicyData[ClientConstant.DEATH] = this.formHelper.removeCommaFromNumber(mainPolicyFormData['death']);
    mainPolicyData[ClientConstant.PERMANENT_DISABLITY] = this.formHelper.removeCommaFromNumber(mainPolicyFormData['permanentDisability']);
    mainPolicyData[ClientConstant.CRITICAL_ILLNESS] = this.formHelper.removeCommaFromNumber(mainPolicyFormData['criticalIllness']);
    mainPolicyData[ClientConstant.ACCIDENTAL_DEATH] = this.formHelper.removeCommaFromNumber(mainPolicyFormData['accidentalDeath']); */
    mainPolicyData[CommonConstant.CURRENCY] = mainPolicyFormData['currency'];

    if (typeof mainPolicyFormData['maturityDate'] === 'object' && mainPolicyFormData['maturityDate'].formatted) {
      mainPolicyFormData['maturityDate'] =
        this.commonHelperService.serviceDateFormat(mainPolicyFormData['maturityDate'].formatted);
    } else {
      mainPolicyFormData['maturityDate'] = this.commonHelperService.prepareServiceDate(mainPolicyFormData['maturityDate']);
    }
    mainPolicyData[ClientConstant.POLICY_MATURITY_DATE] = mainPolicyFormData['maturityDate'];

    let policyPremObj: any = {};
    const policyPremArray: any[] = [];
    mainPolicyFormData['policyPremium'].forEach(element => {
      policyPremObj = {};
      policyPremObj[ClientConstant.PREMIUM] = this.formHelper.removeCommaFromNumber(element['premium'].amount);
      policyPremObj[ClientConstant.LOADING_PREMIUM] = this.formHelper.removeCommaFromNumber(element['loadingPremium'].amount);
      policyPremObj[ClientConstant.PREMIUM_FREQUENCY] = this.formHelper.removeCommaFromNumber(element['premium'].premiumFrequency);

      policyPremArray.push(policyPremObj);
    });
    if (!policyPremObj[ClientConstant.PREMIUM_FREQUENCY]) {
      document.getElementById('addPolicyError').innerHTML = 'Policy Select Premium Frequency';
      return;
    }
    if (!policyPremObj[ClientConstant.PREMIUM]) {
      document.getElementById('addPolicyError').innerHTML = 'Premium can not be empty';
      return;
    }

    if (policyPremArray.length > 0) {
      /* mainPolicyData[ClientConstant.PREMIUM] = policyPremObj[ClientConstant.PREMIUM];
      mainPolicyData[ClientConstant.LOADING_PREMIUM] = policyPremObj[ClientConstant.LOADING_PREMIUM]; */
      // policy premium
      /* mainPolicyData[ClientConstant.PREMIUM] = this.commonHelperService.getMudraStructure(
        this.formHelper.removeCommaFromNumber(policyPremObj[ClientConstant.PREMIUM]), currency);
      mainPolicyData[ClientConstant.LOADING_PREMIUM] = this.commonHelperService.getMudraStructure(
        this.formHelper.removeCommaFromNumber(policyPremObj[ClientConstant.LOADING_PREMIUM]), currency); */

      mainPolicyData[ClientConstant.PREMIUM] = this.formHelper.removeCommaFromNumber(policyPremObj[ClientConstant.PREMIUM]);
      mainPolicyData[ClientConstant.PREMIUM_CURRENCY] = currency;
      mainPolicyData[ClientConstant.LOADING_PREMIUM] = this.formHelper.removeCommaFromNumber(policyPremObj[ClientConstant.LOADING_PREMIUM]);
      mainPolicyData[ClientConstant.LOADING_PREMIUM_CURRENCY] = currency;

      mainPolicyData[ClientConstant.PREMIUM_FREQUENCY] = policyPremObj[ClientConstant.PREMIUM_FREQUENCY];
    } else {
      mainPolicyData[ClientConstant.PREMIUM] = '';
      mainPolicyData[ClientConstant.LOADING_PREMIUM] = '';
      mainPolicyData[ClientConstant.PREMIUM_FREQUENCY] = '';
    }

    let riderPremObj: any = {};
    const riderPremArray: any[] = [];
    mainPolicyFormData['riderPremium'].forEach(element => {
      riderPremObj = {};
      riderPremObj[CommonConstant.PLAIN_ID] = element['rider'];

      /* riderPremObj[ClientConstant.PREMIUM] = this.formHelper.removeCommaFromNumber(element['premium'].amount);
      riderPremObj[ClientConstant.LOADING_PREMIUM] = this.formHelper.removeCommaFromNumber(element['loadingPremium'].amount);
      riderPremObj[ClientConstant.DEATH] = this.formHelper.removeCommaFromNumber(element['death']);
      riderPremObj[ClientConstant.PERMANENT_DISABLITY] = this.formHelper.removeCommaFromNumber(element['permanentDisability']);
      riderPremObj[ClientConstant.CRITICAL_ILLNESS] = this.formHelper.removeCommaFromNumber(element['criticalIllness']);
      riderPremObj[ClientConstant.ACCIDENTAL_DEATH] = this.formHelper.removeCommaFromNumber(element['accidentalDeath']); */

      riderPremObj[ClientConstant.PREMIUM] = this.commonHelperService.getMudraStructure(this.formHelper.removeCommaFromNumber(
        element['premium'].amount), currency);
      riderPremObj[ClientConstant.LOADING_PREMIUM] = this.commonHelperService.getMudraStructure(this.formHelper.removeCommaFromNumber(
        element['loadingPremium'].amount), currency);

      riderPremObj[ClientConstant.DEATH] = this.commonHelperService.getMudraStructure(this.formHelper.removeCommaFromNumber
        (element['death']), currency);

      riderPremObj[ClientConstant.PERMANENT_DISABLITY] = this.commonHelperService.getMudraStructure(this.formHelper.removeCommaFromNumber
        (element['permanentDisability']), currency);

      riderPremObj[ClientConstant.CRITICAL_ILLNESS] = this.commonHelperService.getMudraStructure(this.formHelper.removeCommaFromNumber
        (element['criticalIllness']), currency);

      riderPremObj[ClientConstant.ACCIDENTAL_DEATH] = this.commonHelperService.getMudraStructure(this.formHelper.removeCommaFromNumber
        (element['accidentalDeath']), currency);

      if (riderPremObj[CommonConstant.PLAIN_ID]) {
        riderPremArray.push(riderPremObj);
      }
    });
    if (riderPremArray.length > 0) {
      mainPolicyData[ClientConstant.RIDER_PREMIUM_LIST] = riderPremArray;
    } else {
      mainPolicyData[ClientConstant.RIDER_PREMIUM_LIST] = [];
    }

    mainPolicyData = JSON.stringify(mainPolicyData);

    return mainPolicyData;
  }

  /**
   * To submit main policy form
   */
  submitInsurance() {
    document.getElementById('addPolicyError').innerHTML = '';
    const requestPolicyData = this.prepareRequestForInsurance();
    if (requestPolicyData) {
      this.addPolicyLoader = true;
      this.accountService.submitInsurance(requestPolicyData).subscribe(
          res => {
            this.addPolicyLoader = false;
            if (res[CommonConstant.ERROR_CODE] === 0) {
              const resData = res[CommonConstant.DATA];
              this.policyResponseData = resData;
              this.closePolicyModal();
              this.onNewPolicyChanged.emit(resData);
            } else {
              document.getElementById('addPolicyError').innerHTML = res[CommonConstant.MESSAGE];
            }
          },
          error => {
            this.addPolicyLoader = false;
            document.getElementById('addPolicyError').innerHTML = 'Something went wrong..Please try again later';
          }
        )
    }
  }

  /**
   * Dropdown action
   * @param req
   */
  dropdownAction(list, type) {
    this.dropdownComponent.dropdownList = list;
    this.dropdownComponent.openDropdownModal();
  }

  /**
   * on dropdown change
   * @param event
   */
  onDropdownChanged(event) {
  }

  /**
   * New rider Integration
   */
  openCombineImportAddNewRiderModal() {
    // tslint:disable-next-line:max-line-length
    this.combineImportAddNewRiderModalRef = this.modalService.show(this.combineImportAddNewRiderModal, Object.assign({}, this.modalConfig.config, { class: 'modal-md' }));
  }

  /**
   * To cancel new rider integration
   */
  closeCombineImportAddNewRiderModal() {
    if (this.combineImportAddNewRiderModalRef) {
      this.combineImportAddNewRiderModalRef.hide();
      this.combineImportAddNewRiderModalRef = null;
    }
  }

  /**
   * To add new rider
   * @param any selectionFlag
   */
  addNewRider(selectionFlag: any) {
    this.closeCombineImportAddNewRiderModal();
    // this.appNewPolicyRiderComponent.openRiderModal(selectionFlag);
  }

  /**
   * To get plan rider
   * @param string carrierId
   * @param string planInfoId
   */
  getPolicyPlanRiders(carrierId, planInfoId) {
    this.policyPlanRiders = [];
    this.accountService.getRider(carrierId, planInfoId).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            const resData = res[CommonConstant.DATA];
            this.policyPlanRiders = resData;
          } else {
            // console.log(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          console.log(error);
        }
      )
  }

  /**
   * add carrier Integration
   */

  /**
   * To get phone type
   */
  getphoneType() {
    const policyType = CommonConstant.DROPDOWN_PHONE;
    this.accountService.getDropdownList(policyType).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.phoneTypeList = res[CommonConstant.LIST];
          } else {
            console.log(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          console.log(error);
        }
      )
  }

  /**
   * To get address type
   */
  getAddressType() {
    const policyType = CommonConstant.DROPDOWN_ADDRESS;
    this.accountService.getDropdownList(policyType).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.addressTypeList = res[CommonConstant.LIST];
          } else {
            console.log(res[CommonConstant.MESSAGE]);
          }
        },
        error => {
          console.log(error);
        }
      )
  }

  /**To create the contact information form */
  createCarrierInfoForm() {
    this.carrierInfoForm = this._fb.group({
      carrierName: [''],
      carrierAbbr: [''],
      carrierIcon: [''],
      iconName: [''],
      phoneNumberList: this._fb.array([
        this.formHelper.initPhoneNumber()
      ]),
      addressList: this._fb.array([
        this.formHelper.initAddress(),
      ])
    });
  }

  /**To add phone numbers */
  addPhoneNumbers() {
    const control = <FormArray>this.carrierInfoForm.controls['phoneNumberList'];
    control.push(this.formHelper.initPhoneNumber('addnew'));
  }

  /**To remove phone numbers */
  removePhoneNumbers(i: number) {
    const control = <FormArray>this.carrierInfoForm.controls['phoneNumberList'];
    control.removeAt(i);
  }

  /**To add address */
  addAddress() {
    const control = <FormArray>this.carrierInfoForm.controls['addressList'];
    control.push(this.formHelper.initAddress('addnew'));
  }

  /**To remove address */
  removeAddress(i: number) {
    const control = <FormArray>this.carrierInfoForm.controls['addressList'];
    control.removeAt(i);
  }

  /**
   * To open carrier modal
   */
  openCarrierModal(selectionFlag) {
    this.getphoneType();
    this.getAddressType();
    this.createCarrierInfoForm();
    // to open modal
    this.carrierInfoModalRef =
      this.modalService.show(this.carrierInfoModal, Object.assign({}, this.modalConfig.config, { class: 'modal-md' }));
  }

  /**
   * To cancel/close carrier modal
   */
  closeCarrierInfoModal() {
    if (this.carrierInfoModalRef) {
      this.carrierInfoModalRef.hide();
      this.carrierInfoModalRef = null;
    }

    // unsubscribe services
    /* this.rxjsHelper.unSubscribeModalServices.next();
    this.rxjsHelper.unSubscribeModalServices.complete(); */
  }

  /**
   * On primary radio button change
   * @param number i
   * @param any e
   */
  onPhoneNumberPrimaryChange(i: number, e) {
    const control = <FormArray>this.carrierInfoForm.controls['phoneNumberList'];
    const contactPhoneNumberListLength = this.carrierInfoForm.controls.phoneNumberList['controls'].length;
    for (let index = 0; index < contactPhoneNumberListLength; index++) {
      control.controls[index].patchValue({
        primary: false
      });
    }
    setTimeout(() => {
      control.controls[i].patchValue({
        primary: true
      });
    }, 200);
  }

  /**
   * On primary radion button change
   * @param number i
   * @para any e
   */
  onAddressPrimaryChange(i: number, e) {
    const control = <FormArray>this.carrierInfoForm.controls['addressList'];
    const addressListLength = this.carrierInfoForm.controls['addressList']['controls'].length;
    for (let index = 0; index < addressListLength; index++) {
      control.controls[index].patchValue({
        primary: false
      });
    }
    setTimeout(() => {
      control.controls[i].patchValue({
        primary: true
      });
    }, 400);
  }

  /**
   * On primary radio button change for email section
   * @param number i
   * @param any e
   */
  onEmailPrimaryChange(i: number, e) {
    const control = <FormArray>this.carrierInfoForm.controls['emailList'];
    const emailListLength = this.carrierInfoForm.controls['emailList']['controls'].length;
    for (let index = 0; index < emailListLength; index++) {
      control.controls[index].patchValue({
        primary: false
      });
    }
    setTimeout(() => {
      control.controls[i].patchValue({
        primary: true
      });
    }, 400);
  }

  /**
   * On primary radio button change for contact person address
   * @param number i
   * @param number j
   * @param any e
   */
  onContactAddressPrimaryChange(i: number, j: number, e) {
    const control = <FormArray>this.carrierInfoForm['controls'].contactPersonList['controls'][i].controls['contactAddressList'];
    const contactAddressListLength =
      this.carrierInfoForm['controls'].contactPersonList['controls'][i].controls['contactAddressList'].length;
    for (let index = 0; index < contactAddressListLength; index++) {
      control.controls[index].patchValue({
        primary: false
      });
    }
    setTimeout(() => {
      control.controls[j].patchValue({
        primary: true
      });
    }, 400);
  }

  /**
   * On primary radio button change for contact person phone number
   * @param number i
   * @param number j
   * @param any e
   */
  onContactPhoneNumberPrimaryChange(i: number, j: number, e) {
    const control = <FormArray>this.carrierInfoForm['controls'].contactPersonList['controls'][i].controls['contactPhoneNumberList'];
    const contactPhoneNumberListLength =
      this.carrierInfoForm['controls'].contactPersonList['controls'][i].controls['contactPhoneNumberList'].length;
    for (let index = 0; index < contactPhoneNumberListLength; index++) {
      control.controls[index].patchValue({
        primary: false
      });
    }
    setTimeout(() => {
      control.controls[j].patchValue({
        primary: true
      });
    }, 400);
  }

  /**
   * On primary email radio button change
   * @param number i
   * @param number j
   * @param any e
   */
  onContactEmailPrimaryChange(i: number, j: number, e) {
    const control = <FormArray>this.carrierInfoForm['controls'].contactPersonList['controls'][i].controls['contactEmailList'];
    const contactEmailListLength =
      this.carrierInfoForm['controls'].contactPersonList['controls'][i].controls['contactEmailList'].length;
    for (let index = 0; index < contactEmailListLength; index++) {
      control.controls[index].patchValue({
        primary: false
      });
    }
    setTimeout(() => {
      control.controls[j].patchValue({
        primary: true
      });
    }, 400);
  }

  /**
   * To prepare request for submit and update carrier information
   */
  prepareCarrierInformationRequest() {
    const carrierFormData = this.carrierInfoForm.getRawValue();
    let carrierData: any = {};
    const phoneNumberArray: Array<any> = [];
    const addressArray: Array<any> = [];
    carrierData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    const carrierId = this.carrierHelper.getCarrierId();
    if (carrierId) {
      carrierData[CarrierConstant.CARRIER_ID] = carrierId;
    } else {
      carrierData[CarrierConstant.CARRIER_ID] = '';
    }
    carrierData[CommonConstant.NAME] = carrierFormData['carrierName'];
    if (!carrierFormData['carrierName']) {
      document.getElementById('addCarrierInformationErrorMsg').innerHTML = 'Carrier name can not be empty';
      return;
    }
    carrierData[CommonConstant.ABBREVIATION] = carrierFormData['carrierAbbr'];
    if (!carrierFormData['carrierAbbr']) {
      document.getElementById('addCarrierInformationErrorMsg').innerHTML = 'Carrier abbreviation can not be empty';
      return;
    }
    // To attach image file
    /* if (Object.keys(this.imageFile).length > 0) {
      carrierData[CommonConstant.IMAGE_ICON] = this.imageFile['file'];
    } else {
      carrierData[CommonConstant.IMAGE_ICON] = carrierFormData['carrierIcon'];
    } */

    /* let phoneNumberObj: any = {};
    carrierFormData['phoneNumberList'].forEach(element => {
      phoneNumberObj = {};
      phoneNumberObj[CommonConstant.PLAIN_ID] = element['id'];
      phoneNumberObj[CommonConstant.TYPE] = this.commonHelperService.getDropdownRequestStructure(
        CommonConstant.DROPDOWN_PHONE, element['type']);
      phoneNumberObj[CommonConstant.PRIMARY] = element['primary'];
      phoneNumberObj[CommonConstant.ACTIVE] = element['active'];
      phoneNumberObj[CommonConstant.COUNTRY_CODE] = element['countryCode'];
      phoneNumberObj[CommonConstant.AREA_CODE] = element['areaCode'];
      phoneNumberObj[CommonConstant.NUMBER] = element['number'];

      phoneNumberArray.push(phoneNumberObj);
    }); */
    /* if (phoneNumberArray.length > 0) {
      carrierData[CarrierConstant.CARRIER_CONTACTS] = phoneNumberArray;
    } else {
      carrierData[CarrierConstant.CARRIER_CONTACTS] = [];
    } */

    /* let addressObj: any = {};
    carrierFormData['addressList'].forEach(element => {
      addressObj = {};
      addressObj[CommonConstant.PLAIN_ID] = element['id'];
      addressObj[CommonConstant.TYPE] = this.commonHelperService.getDropdownRequestStructure(
        CommonConstant.DROPDOWN_ADDRESS, element['type']);
      addressObj[CommonConstant.PRIMARY] = element['primary'];
      addressObj[CommonConstant.ACTIVE] = element['active'];
      addressObj[CommonConstant.UNIT_NO] = element['unitNo'];
      addressObj[CommonConstant.ADDRESS1] = element['address1'];
      addressObj[CommonConstant.ADDRESS2] = element['address2'];
      addressObj[CommonConstant.CITY] = element['city'];
      addressObj[CommonConstant.STATE] = element['state'];
      addressObj[CommonConstant.COUNTRY] = element['country'];
      addressObj[CommonConstant.PIN_CODE] = element['pinCode'];

      addressArray.push(addressObj);
    }); */
    /* if (addressArray.length > 0) {
      carrierData[CarrierConstant.CARRIER_ADDRESSES] = addressArray;
    } else {
      carrierData[CarrierConstant.CARRIER_ADDRESSES] = [];
    } */

    carrierData = JSON.stringify(carrierData);

    return carrierData;
  }


  /**This function is used to submit the contact information */
  submitCarrierInfo() {
    document.getElementById('addCarrierInformationErrorMsg').innerHTML = '';
    const newCarrierData = this.prepareCarrierInformationRequest();
    if (newCarrierData) {
      this.carrierInfoDataLoading = true;
      this.accountService.submitContactInformation(newCarrierData).subscribe(
          res => {
            // to update carrier
            this.carrierInfoDataLoading = false;
            if (res[CommonConstant.ERROR_CODE] === 0) {
              const res_data: any = res[CommonConstant.DATA];
              // Emiting updated value to update parent value
              // this.onCarrierChanged.emit(res_data);
              // this.carriers.push(res_data);
              this.getCarrierInfo();
              // To close carrier modal
              this.closeCarrierInfoModal();
            } else {
              document.getElementById('addCarrierInformationErrorMsg').innerHTML = res[CommonConstant.MESSAGE];
            }
          },
          error => {
            this.carrierInfoDataLoading = false;
            document.getElementById('addCarrierInformationErrorMsg').innerHTML = 'Something went wrong..Please try again later';
          }
        )
    }
  }

  /**
   * To read image file
   * @param any event
   */
  validateIcon(event: any) {
    this.readImageFile(event.target);
  }

  /** To validate image file */
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
    this.carrierInfoForm.patchValue({
      carrierIcon: ''
    });
    document.getElementById('addCarrierInformationErrorMsg').innerHTML = '';
    document.getElementById('carrierIconError').innerHTML = '';
    (<HTMLImageElement>document.getElementById('profileImage')).src = '/assets/img/icon/insurance_logo.png';
    this.carrierFormButton = false;
  }


  /**
   * Add new plan Integration
   */

  /**
   * To get policy type
   */
  getPolicyInfoType() {
    const policyType = CommonConstant.DROPDOWN_POLICY_TYPE;
    this.accountService.getDropdownList(policyType).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.policyTypes = res[CommonConstant.LIST];
          }
        },
        error => {
          console.log(error);
        }
      )
  }

  /**
   * To get policy plan type
   */
  getPolicyInfoPlanType() {
    const policyPlanType = CommonConstant.DROPDOWN_POLICY_PLAN_TYPE;
    this.accountService.getDropdownList(policyPlanType).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.policyPlanTypes = res[CommonConstant.LIST];
          }
        },
        error => {
          console.log(error);
        }
      )
  }

  /**To create policy information form */
  createPolicyInformationForm() {
    this.policyInfoForm = this._fb.group({
      carrierName: [''],
      productName: [''],
      type: [''],
      planType: ['']
    });
  }

  /**
   * Policy Information Functionality
   */
  openPlanInfoModal(form) {
    this.createPolicyInformationForm();
    this.getPolicyInfoType();
    this.getPolicyInfoPlanType();

    let carrierName = '';
    const carrierName1 = form.get('carrierName').value;
    if (carrierName1) {
      carrierName = carrierName1;
    }
    setTimeout(() => {
      this.policyInfoForm.patchValue({
        carrierName: carrierName
      })
    }, 200);
    // to open modal
    this.planInfoModalRef = this.modalService.show(this.planInfoModal, Object.assign({}, this.modalConfig.config, { class: 'modal-md' }));
  }

  /**
   * To close plan info modal
   */
  closePlanInfoModal() {
    if (this.planInfoModalRef) {
      this.planInfoModalRef.hide();
      this.planInfoModalRef = null;
    }
    this.copyAndCreateNewDataLoading = false;
  }

  /** Prepare request for policy information */
  preparePolicyInformationRequest() {
    const planInformationFormData = this.policyInfoForm.getRawValue();
    let planInfoData: any = {};
    planInfoData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();

    if (!planInformationFormData['carrierName']) {
      document.getElementById('addPolicyInformationErrorMsg').innerHTML = 'Please select carrier';
      return;
    }
    planInfoData[CarrierConstant.CARRIER_ID] = planInformationFormData['carrierName'];

    if (!planInformationFormData['productName']) {
      document.getElementById('addPolicyInformationErrorMsg').innerHTML = 'Plan name can not be empty';
      return;
    }
    planInfoData[CommonConstant.NAME] = planInformationFormData['productName'];

    if (!planInformationFormData['type']) {
      document.getElementById('addPolicyInformationErrorMsg').innerHTML = 'Please select type';
      return;
    }
    planInfoData[CarrierConstant.TYPE] = planInformationFormData['type'];

    if (!planInformationFormData['planType']) {
      document.getElementById('addPolicyInformationErrorMsg').innerHTML = 'Please select plan type';
      return;
    }
    planInfoData[CarrierConstant.PLAN_TYPE] = planInformationFormData['planType'];

    planInfoData = JSON.stringify(planInfoData);
    return planInfoData;
  }

  /**
   * To submit plan information
   */
  submitPolicyInfo() {
    document.getElementById('addPolicyInformationErrorMsg').innerHTML = '';
    const planInfoRequestData = this.preparePolicyInformationRequest();
    if (planInfoRequestData) {
      this.copyAndCreateNewDataLoading = true;
      this.accountService.submitNewPlanInfo(planInfoRequestData).subscribe(
          res => {
            this.copyAndCreateNewDataLoading = false;
            if (res[CommonConstant.ERROR_CODE] === 0) {
              // const resData: any = res[CommonConstant.DATA].policyPlan;
              this.closePlanInfoModal();
              // Emitting updated value to update parent value
              // this.onPolicyInfoChanged.emit(resData);
              const carrierId = this.policyInfoForm.get('carrierName').value;
              this.getPolicyInformation(carrierId);
            } else {
              document.getElementById('addPolicyInformationErrorMsg').innerHTML = res[CommonConstant.MESSAGE];
            }
          },
          error => {
            this.copyAndCreateNewDataLoading = false;
            document.getElementById('addPolicyInformationErrorMsg').innerHTML = 'Something went wrong..Please try agian later';
          }
        )
    }
  }


  /**
   * Add new Plan Rider Integration
   */

  /**To create policy information form */
  createRiderInformationForm() {
    this.riderInfoForm = this._fb.group({
      carrierName: [''],
      planName: [''],
      riderName: ['']
    });
  }

  /** To open rider modal */
  openRiderModal() {
    this.createRiderInformationForm();
    // to open modal
    this.riderInfoModalRef = this.modalService.show(this.riderModal, Object.assign({}, this.modalConfig.config, { class: 'modal-md' }));
  }

  /**
   * To close rider modal
   */
  closeRiderModal() {
    if (this.riderInfoModalRef) {
      this.riderInfoModalRef.hide();
      this.riderInfoModalRef = null;
    }

    /* this.rxjsHelper.unSubscribeModalServices.next();
    this.rxjsHelper.unSubscribeModalServices.complete(); */
  }

  /**To get policy information */
  getCarrierPlans(carrierId) {
    this.accountService.getPolicyInformation(carrierId).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            const resData = res[CommonConstant.DATA];
            this.carrierPlanData = [];
            if (resData.length > 0) {
              this.carrierPlanData = resData;
              console.log(this.carrierPlanData);
            }
          } else {

          }
        },
        error => {
          console.log('Something went wrong');
        }
      )
  }

  /** Carrier change in rider form */
  onCarrierChangeInRiderForm() {
    const carrierId = this.riderInfoForm.get('carrierName').value;
    if (carrierId) {
      this.getCarrierPlans(carrierId);
    } else {
      this.carrierPlanData = [];
    }
  }

  /**
   * To make request to submit policy commission and update poilicy commission
   */
  prepareRiderInformationRequest() {
    const riderInfoFormData = this.riderInfoForm.getRawValue();
    let riderInfoData: any = {};
    riderInfoData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    if (!riderInfoFormData['carrierName']) {
      document.getElementById('addRiderInformationErrorMsg').innerHTML = 'Please select carrier';
      return;
    }
    riderInfoData[CarrierConstant.CARRIER_ID] = riderInfoFormData['carrierName'];
    if (!riderInfoFormData['planName']) {
      document.getElementById('addRiderInformationErrorMsg').innerHTML = 'Please select planr';
      return;
    }
    riderInfoData[CarrierConstant.POLICY_PLAN_ID] = riderInfoFormData['planName'];
    if (!riderInfoFormData['riderName']) {
      document.getElementById('addRiderInformationErrorMsg').innerHTML = 'Rider name can not be empty';
      return;
    }
    riderInfoData[CommonConstant.NAME] = riderInfoFormData['riderName'];

    riderInfoData = JSON.stringify(riderInfoData);

    return riderInfoData;
  }

  /**To submit policy information */
  submitRiderInfo() {
    document.getElementById('addRiderInformationErrorMsg').innerHTML = '';
    const newRiderInfoData = this.prepareRiderInformationRequest();
    if (newRiderInfoData) {
      this.addRiderLoader = true;
      this.accountService.submitNewRider(newRiderInfoData).subscribe(
          res => {
            this.addRiderLoader = false;
            if (res[CommonConstant.ERROR_CODE] === 0) {
              // Emitting updated value to update parent value
              // this.onCarrierRiderInfoChange.emit(resData);
              const carrierId = this.riderInfoForm.get('carrierName').value;
              const policyPlanId = this.riderInfoForm.get('planName').value;
              this.getPolicyPlanRiders(carrierId, policyPlanId);

              this.closeRiderModal();
            } else {
              document.getElementById('addRiderInformationErrorMsg').innerHTML = res[CommonConstant.MESSAGE];
            }
          },
          error => {
            this.addRiderLoader = false;
            document.getElementById('addRiderInformationErrorMsg').innerHTML = 'Something went wrong..Please try agian later';
          }
        )
    }
  }

}
