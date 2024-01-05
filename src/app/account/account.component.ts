import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../shared/common/modal.config';
import { ChartConfig } from '../shared/common/chart.config';
import { Chart } from 'chart.js';

import { CommonConstant } from '../constants/common/common.constant';
import { AccountConstant } from '../constants/account/account.constant';
import { AccountHelper } from '../helpers/account/account.helper';
import { CommonNotificationComponent } from '../shared/notification.component';
import { NewPolicyComponent } from '../shared/policy/new-policy.component';
import { resetFrequency, headerGroupList, outputFileGroupList } from './account';

import { AccountService } from './account.service';
import { CommonHttpAdapterService } from '../adapters/common-http-adapter.service';
import { CommonHelperService } from '../helpers/common/common.helper';
import { ChartHelperService } from '../helpers/chart/chart.helper';
import { AuthorisedHeaderComponent } from '../header/authorised-header.component';
import { CustomOutputService } from '../custom-output/custom-output.service';

/** jquery integration */
declare var $: any;
import * as moment from 'moment';

/**
 * Account component
 */
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [
    AccountService, CommonHttpAdapterService, ChartHelperService,
    RxJSHelper
  ]
})
export class AccountComponent implements OnInit, OnDestroy {

  /** header component reference */
  @ViewChild('authorisedHeader',{static: false}) authorisedHeader: AuthorisedHeaderComponent;

  /** notification component reference */
  @ViewChild('notificationComponent', {static: false}) notificationComponent: CommonNotificationComponent;

  /** combine modal for online account and manual account */
  @ViewChild('combineLinkUploadStModal', {static: false}) combineLinkUploadStModal: TemplateRef<any>;

  /** new policy component reference */
  @ViewChild('newPolicyComponent', {static: false}) newPolicyComponent: NewPolicyComponent;

  /** password modal for pdf statement */
  @ViewChild('passwordModal', {static: false}) stmtPasswordModal: TemplateRef<any>;

  /** add account modal for online account */
  @ViewChild('addAccountModal', {static: false}) addAccountModal: TemplateRef<any>;

  /** upload statement modal for single upload and multi upload */
  @ViewChild('uploadStatementModal', {static: false}) uploadStmtModal: TemplateRef<any>;

  /** manual account delete mdoal */
  @ViewChild('manualAccounDeleteModal', {static: false}) manualAccounDeleteModal: TemplateRef<any>;

  /** edit account credential modal */
  @ViewChild('editAccountCredential', {static: false}) editAccountCredential: TemplateRef<any>;

  /** delete account modal */
  @ViewChild('deleteAccountModal', {static: false}) deleteAccountModal: TemplateRef<any>;

  delPropertyDataLoading: boolean;
  editPropertyDataLoading: boolean;
  addPropertyDataLoading: boolean;

  public dashboardServiceData: any = {};
  public bankMetaData: any = {};
  public investmentMetaData: any = {};
  public creditcardMetaData: any = {};
  public loanMetaData: any = {};
  public depositMetaData: any = {};
  public retirementMetaData: any = {};
  public userInstitutionListData: any[];
  public manualAccounts: any[] = [];

  notificationMessage: string;

  public UploadStatementForm: FormGroup;
  public otpModalRef: BsModalRef;
  public statementUploadModalRef: BsModalRef;
  public addAccountModalRef: BsModalRef;
  public propertyModalRef: BsModalRef;

  public manualAccounDeleteModalRef: BsModalRef;
  public editAccountCredentialModalRef: BsModalRef;
  public deleteAccountModalRef: BsModalRef;
  public combineLinkUploadStModalRef: BsModalRef;

  public statementCountries;
  public statementInstitutions: any[] = [];

  private uploadSt: any = {};
  private uploadStPass: any = {};
  private stmtFile: any = {};
  private statementData: any = {};
  public statementUploadPrefShow: boolean
  private multipleStmtFile: any[] = [];
  uploadMulStmtLoader = true;

  public uploadMulSt: any = {};
  public budgetChartData: any = {};
  private selectUndefinedOptionValue: any;

  uploadStmtLoader = true;
  uploadStSubmitButton = false;
  fileSizeExceeds = false;
  fileFormatNotMatched = false;
  pdfFileRequired = false;

  multipleUploadStSubmitButton = false;
  multipleFileSizeExceeds = false;
  multipleFileFormatNotMatched = false;
  multiplePdfFileRequired = false;

  overviewError = false;
  overviewPageLoad = false;
  displayAccountPage = false;

  public preferredCurrency: any;
  public totalOwn = 0;
  public totalOwe = 0;
  public netWorth = 0;
  public displayOwnData: boolean;
  public displayOweData: boolean;

  // property declarations
  public propertyObj: any = {};
  public propertyForm: FormGroup;
  public resetFrequency: any[] = resetFrequency;
  // public headerGroupList: any[] = [];
  public headerGroupList = headerGroupList;
  public orgOutputFileGroupList: any[] = outputFileGroupList;
  public outputFileGroupList: any[] = [];
  public selcectedCurrencySymbol;
  public addPropertyFlag = false;

  // online accoount integration declarations
  loading: boolean;
  destLocation: any;
  destHost: any;
  destPass: any;
  destUsername: any;
  mfaLevel: any;
  credPresent: boolean;
  showLoginField: boolean;
  showMFAOption: boolean;
  institutionNameInAction: any;
  institutions: any[];
  countryCode: string;
  accountType: string;
  loginFields: any;
  instCode = '';

  // insurance declaration
  displayOwnDataWithProtection: boolean;
  insuranceDataFlag: boolean;
  displayPageFlag: boolean
  public policyData: any[] = [];
  public insuranceData: any[] = [];
  public sumAssuredList: any[] = [];
  public insuranceGraphView = AccountConstant.DEATH;

  public currencyListData: any = [];
  /*Add Account Declaration */
  currentRefresh: any = {};

  /**Edit Account Declaration */
  loginFieldsEdit: any[] = [];
  getPromptLoading: boolean;
  updateCredentialTrackerId: string;
  refreshRequired: boolean;
  editCred: boolean;
  showUpdateButton: boolean;
  showEditField: boolean;

  /**Delete Account Declaration */
  deleteAccountDetailLoading: boolean;
  trackerIdForDelete: any;
  onlineAccountObject: any = {};

  editCurrency: boolean;
  preferredCurrencyChoice: string;
  showBudgetFlag: boolean;

  // Manual
  deleteManualData: any = {};
  public selectedManualInstitution: any[] = [];

  statementDeleteFlag = true;
  deleteManualAccountDataLoading = false;
  isAllSelected = false;

  /**
   * Dependency Injection for Account/Overview component
   * @param Title titleService
   * @param FormBuilder _fb
   * @param BsModalService modalService
   * @param ModalConfig modalConfig
   * @param ChartConfig chartConfig
   * @param AccountService accountService
   * @param CommonHttpAdapterService commonHttpAdapterService
   * @param Router router
   * @param AccountHelper accountHelper
   * @param CommonHelperService commonHelperService
   * @param ChartHelperService chartHelperService
   * @param RxJSHelper rxjsHelper
   * @param CustomOutputService customOutputService
   */
  constructor(
    private titleService: Title,
    private _fb: FormBuilder,
    private modalService: BsModalService,
    private modalConfig: ModalConfig,
    private chartConfig: ChartConfig,
    private accountService: AccountService,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private router: Router,
    private accountHelper: AccountHelper,
    private commonHelperService: CommonHelperService,
    private chartHelperService: ChartHelperService,
    private rxjsHelper: RxJSHelper,
    private customOutputService: CustomOutputService
  ) {
    /** To set page title */
    this.titleService.setTitle('Conjurer | Overview');
  }

  /** @ignore */
  ngOnInit() {
    this.createUploadSatementForm();
    // this.preferredCurrency = this.commonHelperService.getUserPreferredCurrency();
    // calling services
    this.getDashboardData();
    this.getCurrencyList();
    this.getManageAccountDetails();

    this.setInstitutionNameInAction();
    this.getBudgetChartData();

    this.getPoliciesFromEverest();
    this.getInsurance();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();
    this.uploadSt = {};
    this.closeModals();
  }

  /** To close all the modal on page change */
  closeModals() {
    this.closeAccountModalDetails();
    this.closeCombineLinkUploadStModal();
    this.closeDeleteAccountModal();
    this.closeEditAccountCredentialModal();
    this.closeManulaAccountDeleteModal();
    this.cancelStatementUploadDetails();
    this.cancelDetails();
    this.cancelPropertyDetails();
    this.cancelStatementUploadDetails();
  }

  /**
   * To get list of online institution supported
   */
  getOnlineInstitution() {
    this.accountService.getInstitutions().subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.institutions = res['institutions'];
        } else {
          console.log('Something went worng');
        }
      },
      errror => {
        console.log(errror);
      }
    )
  }

  /**
   * To get manage account details
   */
  getManageAccountDetails() {
    this.accountService.getManageAccountDetails()
      .subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          const resData = res[CommonConstant.DATA];
          this.manualAccounts = resData;
        } else {
          console.log('Something went worng');
        }
      },
      errror => {
        console.log(errror);
      }
    )
  }

  /**
   * To get dashboard data
   */
  getDashboardData() {
    this.accountService.getDashboardData().subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.overviewError = false;
          this.displayAccountPage = true;
          this.dashboardServiceData = res[CommonConstant.DATA];
          this.preferredCurrency = this.dashboardServiceData[CommonConstant.PREFERRED_CURRENCY];
          this.preferredCurrencyChoice = this.preferredCurrency;
          this.makeAccountsMetaData();
          this.setAllFlag();
          this.getUserInstitutionData();
          this.toDisplayOverviewTab();
          setTimeout(() => {
            this.drawHeadersChart();
            this.drawBankChart();
          }, 400);
        } else {
          this.overviewError = true;
          this.displayAccountPage = false;
          console.log('Something went wrong');
        }
      },
      error => {
        this.overviewError = true;
        this.displayAccountPage = false;
        console.log(error);
      }
    )
  }

  /**
   * To get currencies
   */
  getCurrencyList() {
    this.accountService.getCurrenyList().subscribe(
      res => {
        this.currencyListData = res.currencyList;
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * To get institutions
   */
  getUserInstitutionData() {
    const acountList: any[] = [];
    this.userInstitutionListData = [];
    if (this.dashboardServiceData.hasOwnProperty('banks')) {
      Array.prototype.push.apply(this.userInstitutionListData, this.dashboardServiceData.banks.accounts);
    }
    if (this.dashboardServiceData.hasOwnProperty('creditcards')) {
      Array.prototype.push.apply(this.userInstitutionListData, this.dashboardServiceData.creditcards.accounts);
    }
    if (this.dashboardServiceData.hasOwnProperty('investments')) {
      Array.prototype.push.apply(this.userInstitutionListData, this.dashboardServiceData.investments.accounts);
    }
    if (this.dashboardServiceData.hasOwnProperty('loans')) {
      Array.prototype.push.apply(this.userInstitutionListData, this.dashboardServiceData.loans.accounts);
    }
  }

  /**
   * @ignore
   * @param any[] data
   */
  createJsonForAccounts(data: any[]) {
    // for investment
    const accountMetaData = {};
    const result: any[] = [];
    data.forEach((element) => {
      // const key = element.accountName + '_' + element.bankId;
      const key = element.institutionName;
      if (accountMetaData[key]) {
        accountMetaData[key]['total'] += parseFloat(element.convertedBalance);
        accountMetaData[key]['accounts'].push(element);
      } else {
        const obj = {};
        obj['accountType'] = element.accountType;
        obj['accountName'] = element.accountName;
        obj['accountNumber'] = element.accountNumber;
        obj['institutionName'] = element.institutionName;
        obj['bankId'] = element.bankId;
        obj['totalBalance'] = parseFloat(element.convertedBalance);
        obj['updatedAt'] = element.updatedAt;
        obj['currency'] = element.currency;
        obj['institutionImageUrl'] = element.institutionImageUrl;

        obj['accounts'] = [];
        obj['accounts'].push(element);

        accountMetaData[key] = obj;
      }
    });
    for (const key in accountMetaData) {
      if (accountMetaData.hasOwnProperty(key)) {
        const element = accountMetaData[key];
        const temp3 = {};
        temp3[key] = element;
        result.push(temp3)
      }
    }
    return result;
  }

  /**
   * This is used to decide which view is going to appear on overview
   */
  setAllFlag() {
    if (Object.keys(this.dashboardServiceData).length > 0) {
      this.displayOwnData = this.dashboardServiceData.banks.accounts.length > 0
        || this.dashboardServiceData.investments.accounts.length > 0 || this.dashboardServiceData.properties.property.length > 0;

      /** For Owe Data */
      this.displayOweData = this.dashboardServiceData.creditcards.accounts.length > 0
        || this.dashboardServiceData.loans.accounts.length > 0;
      /**  Main page display Flag */
      this.displayPageFlag = this.displayOwnData || this.displayOweData;
    }
  }

  /**
   * To get budget chart data
   */
  getBudgetChartData() {
    this.accountService.getBudgetData().subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.budgetChartData = res[CommonConstant.DATA];
          setTimeout(() => {
            this.drwaBudgetStatus();
          }, 500);
        } else {
          console.log('Something went wrong');
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * To change preferred Currency
   */
  changePreferredCurrency() {
    this.accountService.changePreferredCurrency(this.preferredCurrencyChoice).subscribe(
      response => {
        if (response[CommonConstant.ERROR_CODE] === 0) {
          this.commonHelperService.setPreferredCurrency(this.preferredCurrencyChoice);
          setTimeout(() => {
            window.location.reload(true);
          }, 400);
        } else {
          this.notificationComponent.notificationMessage = response[CommonConstant.MESSAGE];
          this.notificationComponent.openComonNotificationModal();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * To show the account details like mobile device
   */
  makeAccountsMetaData() {
    // for bank data
    const groupByField = 'institutionName';
    this.bankMetaData = this.accountHelper.groupByInstitution(this.dashboardServiceData.banks.accounts, groupByField);
    this.investmentMetaData = this.accountHelper.groupByInstitution(this.dashboardServiceData.investments.accounts, groupByField);
    this.creditcardMetaData = this.accountHelper.groupByInstitution(this.dashboardServiceData.creditcards.accounts, groupByField);
    this.loanMetaData = this.accountHelper.groupByInstitution(this.dashboardServiceData.loans.accounts, groupByField);
    this.depositMetaData = this.accountHelper.groupByInstitution(this.dashboardServiceData.deposits.accounts, groupByField);
    // this.retirementMetaData = this.accountHelper.groupByInstitution(this.dashboardServiceData.retirements.accounts);
  }

  /**
   * To remove commna from number
   * @param any num
   */
  removeSpecialCharacter(num: any) {
    if (num) {
      num = this.commonHelperService.removeSpecialCharacters(num);
      return num;
    }
    return num;
  }

  /**
   * To draw header charts(owe, own)
   */
  drawHeadersChart() {

    // TO draw own chart
    if (this.displayOwnData) {
      const chart_container = document.getElementById('ownHeaderChart_content');
      if (chart_container == null) {
        return;
      }
      chart_container.innerHTML = '';
      chart_container.innerHTML += '<canvas id="ownHeaderChart"></canvas>';

      const ownChartLabel = [];
      const ownChartData = [];
      if (parseFloat(this.dashboardServiceData.banks.totalBalance) > 0) {
        ownChartLabel.push('Bank');
        ownChartData.push(parseFloat(this.dashboardServiceData.banks.totalBalance));
      }
      if (parseFloat(this.dashboardServiceData.investments.totalBalance) > 0) {
        ownChartLabel.push('Investment');
        ownChartData.push(parseFloat(this.dashboardServiceData.investments.totalBalance));
      }
      if (parseFloat(this.dashboardServiceData.deposits.totalBalance) > 0) {
        ownChartLabel.push('Deposit');
        ownChartData.push(parseFloat(this.dashboardServiceData.deposits.totalBalance));
      }
      /* if (parseFloat(this.dashboardServiceData.retirements.totalBalance) > 0) {
        ownChartLabel.push('Retirement');
        ownChartData.push(parseFloat(this.dashboardServiceData.retirements.totalBalance));
      } */
      if (parseFloat(this.dashboardServiceData.properties.totalBalance) > 0) {
        ownChartLabel.push('Property');
        ownChartData.push(parseFloat(this.dashboardServiceData.properties.totalBalance));
      }
      /* if (parseFloat(this.insuranceData.totalSavingAmount) > 0 || parseFloat(this.insuranceData.totalInvestmentAmount) > 0) {
        ownChartLabel.push('Insurance');
        ownChartData.push(parseFloat(this.insuranceData.totalSavingAmount) + parseFloat(this.insuranceData.totalInvestmentAmount));
      } */
      const currency_symbol = this.commonHelperService.toGetCurrencySymbol(this.preferredCurrency);
      // tslint:disable-next-line:max-line-length
      // if retirement - parseFloat(this.dashboardServiceData.retirements.totalBalance)
      // if insurance - parseFloat(this.insuranceData.totalSavingAmount) + parseFloat(this.insuranceData.totalInvestmentAmount);
      let totalOwn = parseFloat(this.dashboardServiceData.banks.totalBalance) +
        parseFloat(this.dashboardServiceData.investments.totalBalance) + parseFloat(this.dashboardServiceData.properties.totalBalance)
        + parseFloat(this.dashboardServiceData.deposits.totalBalance);
      this.totalOwn = totalOwn;
      // tslint:disable-next-line:radix
      totalOwn = this.totalOwn;
      totalOwn = this.commonHelperService.numberWithCommas(totalOwn);
      const defaultCenterLabel = 'You Own' + '<br />' + currency_symbol + ' ' + totalOwn;
      const total = 5;
      const chart_rendered = 'ownHeaderChart';
      const dataEmptyMessage = 'You have not added accounts.';
      const showLegend = '0';
      const legendPosition = 'down';

      const config = {
        type: 'doughnut',
        data: {
          labels: ownChartLabel,
          datasets: [{
            data: ownChartData,
            backgroundColor: this.chartConfig.poolColors(total),
            // hoverBackgroundColor: label
          }]
        },
        options: {
          cutoutPercentage: this.chartConfig.chartConfiguration.cutoutPercentage, // to set size of dognut chart
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            arc: {
              roundedCornersFor: 0,
              borderWidth: 0.5
            },
            center: {
              // the longest text that could appear in the center
              maxText: '100%',
              text: defaultCenterLabel,
              fontColor: '#777',
              fontFamily: this.chartConfig.chartConfiguration.fontFamily,
              fontStyle: 'normal',
              // fontSize: 12,
              // if a fontSize is NOT specified, we will scale (within the below limits) maxText to take up the maximum space in the center
              // if these are not specified either, we default to 1 and 256
              minFontSize: 1,
              maxFontSize: 13,
            }
          },
          legend: false,
          tooltips: {
            callbacks: {
              label: (tooltipItems, data) => {
                const label = data.labels;
                const sum = data.datasets[0].data.reduce(add, 0);
                function add(a, b) {
                  return a + b;
                }

                return label[tooltipItems.index] + ', ' + this.chartHelperService.getTooltipValue(data, tooltipItems, sum) + ' %';
              }
            }
          }
        }
      };

      const ownChart = (<HTMLCanvasElement>document.getElementById(chart_rendered)).getContext('2d');
      const myOwnChart = new Chart(ownChart, config);

      document.getElementById(chart_rendered).onclick = (evt) => {

        const activePoints = myOwnChart.getElementsAtEvent(evt);

        if (activePoints.length > 0) {
          // get the internal index of slice in pie myOwnChart
          const clickedElementindex = activePoints[0]['_index'];
          const instName = myOwnChart.data.labels[clickedElementindex];

          // On click chart plot to show corresponding tabs
          if (instName === 'Bank') {
            const tab = 'Banks-content';
            $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
            this.drawBankChart();  // To draw bank chart
          } else if (instName === 'Investment') {
            const tab = 'Investment-content';
            $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
            this.drawInvestmentChart();  // To draw investment chart
          } else if (instName === 'Deposit') {
            const tab = 'Deposits-content';
            $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
            this.drawDepositChart();  // To draw investment chart
          } else if (instName === 'Retirement') {
            const tab = 'Retirement-content';
            $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
            this.drawRetirementChart();  // To draw retirement chart
          } else if (instName === 'Property') {
            const tab = 'Properties-content';
            $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
            this.drawPropertiesChart();  // To draw property chart
          } else if (instName === 'Insurance') {
            const tab = 'Insurance-content';
            $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
            this.drawInsuranceChart(AccountConstant.DEATH);  // To draw insurance chart
          }

          /* other stuff that requires slice's label and value */
        } else {
          console.log('else');
        }
      };
    }

    // TO draw owe chart
    if (this.displayOweData) {
      const chart_container = document.getElementById('oweHeaderChart_content');
      if (chart_container == null) {
        return;
      }
      chart_container.innerHTML = '';
      chart_container.innerHTML += '<canvas id="oweHeaderChart"></canvas>';

      let totalOwe;
      const oweChartLabel = [];
      const oweChartData = [];
      if (this.dashboardServiceData.creditcards.totalBalance > 0) {
        oweChartLabel.push('Credit Cards');
        oweChartData.push(parseFloat(this.dashboardServiceData.creditcards.totalBalance));
      }

      if (this.dashboardServiceData.loans.totalBalance > 0) {
        oweChartLabel.push('Loan');
        oweChartData.push(parseFloat(this.dashboardServiceData.loans.totalBalance));
      }
      totalOwe = parseFloat(this.dashboardServiceData.creditcards.totalBalance) +
            parseFloat(this.dashboardServiceData.loans.totalBalance);
      const currency_symbol = this.commonHelperService.toGetCurrencySymbol(this.preferredCurrency);  // Getting currency symbol
      this.totalOwe = totalOwe;
      // tslint:disable-next-line:radix
      totalOwe = parseInt(totalOwe);
      totalOwe = this.commonHelperService.numberWithCommas(totalOwe);
      const defaultCenterLabel = 'You Owe' + '<br />' + currency_symbol + ' ' + totalOwe;

      const chart_rendered1 = 'oweHeaderChart';
      const dataEmptyMessage = 'You have not added accounts.';
      const showLegend = '0';
      const total = 5;
      const legendPosition = 'down';

      const config = {
        type: 'doughnut',
        data: {
          labels: oweChartLabel,
          datasets: [{
            data: oweChartData,
            backgroundColor: this.chartConfig.poolColors(total),
            // hoverBackgroundColor: label
          }]
        },
        options: {
          cutoutPercentage: this.chartConfig.chartConfiguration.cutoutPercentage, // to set size of dognut chart
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            arc: {
              roundedCornersFor: 0,
              borderWidth: 0.5
            },
            center: {
              // the longest text that could appear in the center
              maxText: '100%',
              text: defaultCenterLabel,
              fontColor: '#777',
              fontFamily: this.chartConfig.chartConfiguration.fontFamily,
              fontStyle: 'normal',
              // fontSize: 12,
              // if a fontSize is NOT specified, we will scale (within the below limits) maxText to take up the maximum space in the center
              // if these are not specified either, we default to 1 and 256
              minFontSize: 1,
              maxFontSize: 13,
            }
          },
          legend: false,
          tooltips: {
            callbacks: {
              label: (tooltipItems, data) => {
                const label = data.labels;
                const sum = data.datasets[0].data.reduce(add, 0);
                function add(a, b) {
                  return a + b;
                }

                return label[tooltipItems.index] + ', ' + this.chartHelperService.getTooltipValue(data, tooltipItems, sum) + ' %';
              }
            }
          }
        }
      };

      const oweChart = (<HTMLCanvasElement>document.getElementById(chart_rendered1)).getContext('2d');
      const myOweChart = new Chart(oweChart, config);

      document.getElementById(chart_rendered1).onclick = (evt) => {

        const activePoints = myOweChart.getElementsAtEvent(evt);

        if (activePoints.length > 0) {
          // get the internal index of slice in pie myOweChart
          const clickedElementindex = activePoints[0]['_index'];
          const instName = myOweChart.data.labels[clickedElementindex];

          // on click to show corresponding tab
          if (instName === 'Credit Cards') {
            const tab = 'Creditcard-content';
            $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
            this.drawCreditCardChart();  // To draw creditcard chart
          } else if (instName === 'Loan') {
            const tab = 'Loans-content';
            $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
            this.drawLoanChart();  // To draw loan chart
          }

        }
      }
    }

    if (this.displayOwnData || this.displayOweData) {
      // To calculate networth
      this.netWorth = this.totalOwn - this.totalOwe;
    }
  }

  /**
   * To highlight the tab on overview page where we have data
  */
  toDisplayOverviewTab() {
    if (this.dashboardServiceData.banks.accounts.length > 0) {
      const tab = 'Banks-content';
      $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
      this.drawBankChart();  // To draw bank chart
    } else if (this.dashboardServiceData.investments.accounts.length > 0) {
      const tab = 'Investment-content';
      $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
      this.drawInvestmentChart();  // To draw investment chart
    } else if (this.dashboardServiceData.creditcards.accounts.length > 0) {
      const tab = 'Creditcard-content';
      $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
      this.drawCreditCardChart();  // To draw creditcard chart
    } else if (this.dashboardServiceData.loans.accounts.length > 0) {
      const tab = 'Loans-content';
      $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
      this.drawLoanChart();  // To draw loan chart
    } else if (this.dashboardServiceData.properties.property.length > 0) {
      const tab = 'Properties-content';
      $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
      this.drawPropertiesChart();  // To draw property chart
    } else if (this.dashboardServiceData.deposits.accounts.length > 0) {
      const tab = 'Deposits-content';
      $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
      this.drawDepositChart();  // To draw property chart
    }
    /* else if (this.dashboardServiceData.retirements.accounts.length > 0) {
      const tab = 'Retirement-content';
      $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
      this.drawRetirementChart();  // To draw retirement chart
    } else if (this.insuranceData.insurances.length > 0) {
      const tab = 'Insurance-content';
      $('.nav-tabs a[data-target="#' + tab + '"]').tab('show');
      this.drawInsuranceChart();  // To draw insurance chart
    } else {
      console.log('Something went wrong');
    } */
  }

  /**
   * To draw budget status chart
   */
  drwaBudgetStatus() {
    const chart_container = document.getElementById('budget_status_content');
    if (chart_container == null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="budget_status"></canvas>';

    if (this.budgetChartData) {

      // To draw budget status chart
      const budgetPercentage = parseInt(this.budgetChartData.BudgetSpentPercentage, 10);
      const chart_rendered = 'budget_status';
      const defaultCenterLabel = 'Spent' + '<br />' + budgetPercentage + '%';
      if (parseInt(this.budgetChartData.totalBudgetAmount, 10) === 0) {
        this.showBudgetFlag = true;
      } else {
        this.showBudgetFlag = false;
        let data = [];
        let color;
        if (budgetPercentage >= 100) {
          data = [];
          data.push({ 'label': 'Spent', 'value': budgetPercentage });
          color = '#ff0000';

        } else if (budgetPercentage <= 75) {
          data = [];
          data.push({ 'label': 'Spent', 'value': budgetPercentage }, { 'label': 'Spent', 'value': 100 - budgetPercentage });
          color = '#008000,#CCD1D1'; // Green

        } else if (budgetPercentage > 75 && budgetPercentage <= 95) {
          data = [];
          data.push({ 'label': 'Spent', 'value': budgetPercentage }, { 'label': 'Spent', 'value': 100 - budgetPercentage });
          color = '#ffc200,#CCD1D1'; // orange

        } else if (budgetPercentage > 95 && budgetPercentage < 100) {
          data = [];
          data.push({ 'label': 'Spent', 'value': budgetPercentage }, { 'label': 'Spent', 'value': 100 - budgetPercentage });
          color = '#ff0000,#CCD1D1'; // Red
        }
        const label1 = [];
        const data1 = [];
        const color1 = color.split(',');
        data.forEach((element) => {
          label1.push(element.label);
          data1.push(element.value);
        });

        this.chartHelperService.commonStatusChart(label1, data1, color1, chart_rendered, defaultCenterLabel);

      }
    }
  }

  /**
   * To redirect to budget page
   * @param string type
   */
  getBudgetDteails(type: string) {
    setTimeout(() => {
      this.router.navigateByUrl('/budget');
    }, 300);
  }

  /**
   * To draw bank chart
   */
  drawBankChart() {
    const chart_container = document.getElementById('bank-chart-content');
    if (chart_container == null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="bank_chart"></canvas>';

    const bankChartData = [];
    if (this.dashboardServiceData) {
      // const data = {};
      const label = [];
      const data = [];
      this.dashboardServiceData.banks.accounts.forEach((element) => {
        // this.bankChartData.push({'label': element.accountName, 'value': element.convertedBalance});
        label.push(element.institutionName);
        data.push(parseFloat(element.convertedBalance));
      })

      // data = this.bankChartData;
      const currency_symbol = this.commonHelperService.toGetCurrencySymbol(this.preferredCurrency);
      // tslint:disable-next-line:radix
      let totalBankBalance = parseInt(this.dashboardServiceData.banks.totalBalance);
      totalBankBalance = this.commonHelperService.numberWithCommas(totalBankBalance);
      const defaultCenterLabel = 'You Own' + '<br />' + currency_symbol + ' ' + totalBankBalance;
      const total = this.dashboardServiceData.banks.accounts.length;

      const chart_rendered = 'bank_chart';
      const legend_rendered = 'bank-legend';
      const dataEmptyMessage = 'You have not added accounts.';
      const showLegend = '1';
      const legendPosition = 'down';

      setTimeout(() => {
        this.chartHelperService.commonDoughnutChart(
          label, data, chart_rendered, defaultCenterLabel, currency_symbol, total, legend_rendered);
      }, 200);
    }
  }

  /**
   * To draw investment chart
   */
  drawInvestmentChart() {
    const chart_container = document.getElementById('investment-chart-content');
    if (chart_container == null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="investment_chart"></canvas>';

    const investmentChartData = [];
    if (this.dashboardServiceData) {
      // const data = {};
      const label = [];
      const data = [];
      this.dashboardServiceData.investments.accounts.forEach((element) => {
        /*const data = {};
        this.investmentChartData.push({'label': element.accountName, 'value': element.convertedBalance});*/
        label.push(element.institutionName);
        data.push(parseFloat(element.convertedBalance));

      })
      // data = this.investmentChartData;
      const currency_symbol = this.commonHelperService.toGetCurrencySymbol(this.preferredCurrency);
      // tslint:disable-next-line:radix
      let totalInvestment = parseInt(this.dashboardServiceData.investments.totalBalance);
      totalInvestment = this.commonHelperService.numberWithCommas(totalInvestment);
      const defaultCenterLabel = 'You Own' + '<br />' + currency_symbol + ' ' + totalInvestment;
      const total = this.dashboardServiceData.investments.accounts.length;

      const chart_rendered = 'investment_chart';
      const legend_rendered = 'investment-legend';
      const dataEmptyMessage = 'You have not added accounts.';
      const showLegend = '1';
      const legendPosition = 'down';

      setTimeout(() => {
        this.chartHelperService.commonDoughnutChart(
          label, data, chart_rendered, defaultCenterLabel, currency_symbol, total, legend_rendered);
      }, 200);
    }
  }

  /**
   * To draw retirement chart
   */
  drawRetirementChart() {
    const chart_container = document.getElementById('retirement-chart-content');
    if (chart_container == null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="retirement_chart"></canvas>';

    const retirementChartData = [];
    if (this.dashboardServiceData) {
      // const data = {};
      const label = [];
      const data = [];
      this.dashboardServiceData.retirements.accounts.forEach((element) => {
        /*const data = {};
        this.retirementChartData.push({'label': element.accountName, 'value': element.convertedBalance});*/
        label.push(element.accountName);
        data.push(parseFloat(element.convertedBalance));
      })
      // data = this.retirementChartData;

      const currency_symbol = this.commonHelperService.toGetCurrencySymbol(this.preferredCurrency);
      // tslint:disable-next-line:radix
      let totalRetirement = parseInt(this.dashboardServiceData.retirements.totalBalance);
      totalRetirement = this.commonHelperService.numberWithCommas(totalRetirement);
      const defaultCenterLabel = 'You Own' + '<br />' + currency_symbol + ' ' + totalRetirement;
      const total = this.dashboardServiceData.retirements.accounts.length;

      const chart_rendered = 'retirement_chart';
      const legend_rendered = 'retirement-legend';
      const dataEmptyMessage = 'You have not added accounts.';
      const showLegend = '1';
      const legendPosition = 'down';

      setTimeout(() => {
        this.chartHelperService.commonDoughnutChart(
          label, data, chart_rendered, defaultCenterLabel, currency_symbol, total, legend_rendered);
      }, 200);
    }
  }

  /**
   * To draw deposite chart
   */
  drawDepositChart() {
    const chart_container = document.getElementById('deposit-chart-content');
    if (chart_container == null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="deposit_chart"></canvas>';

    if (this.dashboardServiceData) {
      const label = [];
      const data = [];
      this.dashboardServiceData.deposits.accounts.forEach((element) => {
        label.push(element.institutionName);
        data.push(parseFloat(element.convertedBalance));
      })

      const currency_symbol = this.commonHelperService.toGetCurrencySymbol(this.preferredCurrency);
      // tslint:disable-next-line:radix
      let totalBankBalance = parseInt(this.dashboardServiceData.deposits.totalBalance);
      totalBankBalance = this.commonHelperService.numberWithCommas(totalBankBalance);
      const defaultCenterLabel = 'You Own' + '<br />' + currency_symbol + ' ' + totalBankBalance;
      const total = this.dashboardServiceData.deposits.accounts.length;

      const chart_rendered = 'deposit_chart';
      const legend_rendered = 'deposit-legend';
      const dataEmptyMessage = 'You have not added accounts.';
      const showLegend = '1';
      const legendPosition = 'down';

      setTimeout(() => {
        this.chartHelperService.commonDoughnutChart(
          label, data, chart_rendered, defaultCenterLabel, currency_symbol, total, legend_rendered);
      }, 200);
    }
  }

  /**
   * To draw properties chart
   */
  drawPropertiesChart() {
    const chart_container = document.getElementById('properties-chart-content');
    if (chart_container == null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="properties_chart"></canvas>';

    const propertiesChartData = [];
    if (this.dashboardServiceData) {
      // const data = {};
      const label = [];
      const data = [];
      this.dashboardServiceData.properties.property.forEach((element) => {
        /*const data = {};
        this.propertiesChartData.push({'label': element.name, 'value': element.convertedBalance});*/
        label.push(element.name);
        data.push(parseFloat(element.convertedBalance));
      })
      // data = this.propertiesChartData;

      const currency_symbol = this.commonHelperService.toGetCurrencySymbol(this.preferredCurrency);
      // tslint:disable-next-line:radix
      let totalProperties = parseInt(this.dashboardServiceData.properties.totalBalance);
      totalProperties = this.commonHelperService.numberWithCommas(totalProperties);
      const defaultCenterLabel = 'Property Value' + '<br />' + currency_symbol + ' ' + totalProperties;
      const total = this.dashboardServiceData.properties.property.length;

      const chart_rendered = 'properties_chart';
      const legend_rendered = 'properties-legend';
      const dataEmptyMessage = 'You have not added accounts.';
      const showLegend = '1';
      const legendPosition = 'down';

      setTimeout(() => {
        this.chartHelperService.commonDoughnutChart(
          label, data, chart_rendered, defaultCenterLabel, currency_symbol, total, legend_rendered);
      }, 200);
    }
  }

  /**
   * To draw credit card chart
   */
  drawCreditCardChart() {
    const chart_container = document.getElementById('creditCard-chart-content');
    if (chart_container == null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="creditCard_chart"></canvas>';
    const creditCardChartData = [];
    if (this.dashboardServiceData) {
      const label = [];
      const data = [];
      this.dashboardServiceData.creditcards.accounts.forEach((element) => {
        if (element.convertedBalance < 0) {
        } else {
          label.push(element.accountName);
          data.push(parseFloat(element.convertedBalance));
        }
      })

      const currency_symbol = this.commonHelperService.toGetCurrencySymbol(this.preferredCurrency);
      // tslint:disable-next-line:radix
      let totalCredit = parseInt(this.dashboardServiceData.creditcards.totalBalance);
      totalCredit = this.commonHelperService.numberWithCommas(totalCredit);
      const defaultCenterLabel = 'You Owe' + '<br />' + currency_symbol + ' ' + totalCredit;
      const total = this.dashboardServiceData.creditcards.accounts.length;

      const chart_rendered = 'creditCard_chart';
      const legend_rendered = 'creditCard-legend';
      const dataEmptyMessage = 'You have not added accounts.';
      const showLegend = '1';
      const legendPosition = 'down';

      setTimeout(() => {
        this.chartHelperService.commonDoughnutChart(
          label, data, chart_rendered, defaultCenterLabel, currency_symbol, total, legend_rendered);
      }, 200);
    }
  }

  /**
   * To draw loan chart
   */
  drawLoanChart() {
    const chart_container = document.getElementById('loan-chart-content');
    if (chart_container == null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="loan_chart"></canvas>';

    const loanChartData = [];
    if (this.dashboardServiceData) {
      // const data = {};
      const label = [];
      const data = [];
      this.dashboardServiceData.loans.accounts.forEach((element) => {
        /*const data = {};
        this.loanChartData.push({'label': element.accountName, 'value': element.convertedBalance});*/
        label.push(element.accountName);
        data.push(parseFloat(element.convertedBalance));
      })
      // data = this.loanChartData;
      const currency_symbol = this.commonHelperService.toGetCurrencySymbol(this.preferredCurrency);
      // tslint:disable-next-line:radix
      let totalLoan = parseInt(this.dashboardServiceData.loans.totalBalance);
      totalLoan = this.commonHelperService.numberWithCommas(totalLoan);
      const defaultCenterLabel = 'You Owe' + '<br />' + currency_symbol + ' ' + totalLoan;
      const total = this.dashboardServiceData.loans.accounts.length;

      const chart_rendered = 'loan_chart';
      const legend_rendered = 'loan-legend';
      const dataEmptyMessage = 'You have not added accounts.';
      const showLegend = '1';
      const legendPosition = 'down';

      setTimeout(() => {
        this.chartHelperService.commonDoughnutChart(
          label, data, chart_rendered, defaultCenterLabel, currency_symbol, total, legend_rendered);
      }, 200);
    }
  }

  /**
   * Property Integration
   */

  /**
   * To open property modal
   * @param TemplateRef template
   * @param string type
   */
  openPropertyModal(template: TemplateRef<any>, type: string) {
    let className: string;
    if (type === 'add' || type === 'edit') {
      className = 'modal-md';
      if (type === 'add') {
        this.onCurrencyChange();
      }
    } else if (type === 'delete') {
      className = 'modal-md deleteTransconfModal';
    }
    this.propertyModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, {class: className}));
  }

  /**
   * To close statement upload modal
   */
  cancelPropertyDetails(): void {
    if (this.propertyModalRef) {
      this.propertyModalRef.hide();
      this.propertyModalRef = null;
    }
    this.addPropertyFlag = false;
  }

  /**
   * To create property form
   */
  createPropertyForm(): FormGroup {
    return this.propertyForm = this._fb.group({
      id: [''],
      name: [''],
      ownership: [''],
      propertyType: [''],
      purpose: [''],
      marketValue: [''],
      loan: [''],
      loanResidualTerms: [''],
      interestType: [''],
      interestRate: [''],
      benchMark: [''],
      spreadOverBenchMark: [''],
      resetFrequency: [''],
      lastResetDate: [''],
      propertyName: [''],
      address: [''],
      currency: [''],
      amount: [''],
      purchaseDate: [''],
      remarks: ['']
    })
  }

  /**
   * To open add property modal/dialog
   * @param TemplateRef template
   */
  prepareAddProperty(template: TemplateRef<any>): void {
    this.createPropertyForm();
    this.addPropertyFlag = true;
    this.propertyObj.currency = 'SGD';
    this.openPropertyModal(template, 'add');

    // purchase date
    $(document).on('focus', '.purchaseDate', function () {
      const date = new Date();
      $(this).datepicker({
        dateFormat: 'dd-mm-yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '1900:+0',
        minDate: new Date(1900, 10 - 1, 25),
        maxDate: new Date(),
      });
    });

    // last reset date
    $(document).on('focus', '.lastResetDate', function () {
      const date = new Date();
      $(this).datepicker({
        dateFormat: 'dd-mm-yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '1900:+0',
        minDate: new Date(1900, 10 - 1, 25),
        maxDate: new Date(),
      });
    });
  }

  /**
   * On currency change display target currency in each and every amount field
   * @param string currCode
   */
  onCurrencyChange(currCode?: string): void {
    if (currCode) {
      const currencySymbol = this.commonHelperService.getCurrencySymbol(currCode);
      this.selcectedCurrencySymbol = currencySymbol;
    } else {
      let currencyCode = this.propertyForm.get('currency').value;
      if (currencyCode) {
        const currencySymbol = this.commonHelperService.getCurrencySymbol(currencyCode);
        this.selcectedCurrencySymbol = currencySymbol;
      } else {
        currencyCode = 'SGD';
        const currencySymbol = this.commonHelperService.getCurrencySymbol(currencyCode);
        this.selcectedCurrencySymbol = currencySymbol;
        this.propertyForm.patchValue({
          currency: currencyCode
        });
      }
    }
  }

  /**
   * To make request to add property
   * @param any purchaseDateArg
   * @param any lastResetDateArg
   */
  prepareRequestForAddProperty(purchaseDateArg: any, lastResetDateArg?: any): Object {
    const propertyFormData = this.propertyForm.getRawValue();

    document.getElementById('addPropertyErrMsg').innerHTML = '';

    let propertyReqData = {};
    propertyReqData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    propertyReqData[AccountConstant.PROPERTY_ID] = propertyFormData['id'];
    propertyReqData[CommonConstant.NAME] = propertyFormData['name'];
    propertyReqData[AccountConstant.PROPERTY_TYPE] = propertyFormData['propertyType'];
    propertyReqData[AccountConstant.PURCHASE_DATE] = purchaseDateArg;
    propertyReqData[AccountConstant.OWNERSHIP] = propertyFormData['ownership'];
    propertyReqData[AccountConstant.PURPOSE] = propertyFormData['purpose'];

    propertyReqData[CommonConstant.CURRENCY] = propertyFormData['currency'];
    propertyReqData[CommonConstant.AMOUNT] = propertyFormData['amount'];
    propertyReqData[AccountConstant.MARKET_VALUE] = propertyFormData['marketValue'];
    propertyReqData[AccountConstant.LOAN_OUTSTANDING_AMOUNT] = propertyFormData['loan'];
    propertyReqData[AccountConstant.LOAN_RESIDUAL_TERMS] = propertyFormData['loanResidualTerms'];

    propertyReqData[AccountConstant.INTEREST_TYPE] = propertyFormData['interestType'];
    propertyReqData[AccountConstant.INTEREST_RATE] = propertyFormData['interestRate'];
    propertyReqData[AccountConstant.RESET_FREQUENCY] = propertyFormData['resetFrequency'];
    propertyReqData[AccountConstant.LAST_RESET_DATE] = lastResetDateArg;

    propertyReqData[AccountConstant.ADDRESS] = propertyFormData['address'];
    propertyReqData[AccountConstant.REMARKS] = propertyFormData['remarks'];

    propertyReqData = JSON.stringify(propertyReqData);

    return propertyReqData;
  }

  /**
   * calling service to add new property
   * @param any purchaseDateArg
   * @param any lastResetDateArg
   */
  addProperty(purchaseDateArg: any, lastResetDateArg: any): void {

    document.getElementById('addPropertyErrMsg').innerHTML = '';

    let purchaseDate = purchaseDateArg.value;
    if (purchaseDate) {
      purchaseDate = moment(purchaseDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    }

    let lastResetDate = '';
    if (lastResetDateArg) {
      lastResetDate = lastResetDateArg.value;
      if (lastResetDate) {
        lastResetDate = moment(lastResetDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
      }
    }

    const requestData = this.prepareRequestForAddProperty(purchaseDate, lastResetDate);
    if (requestData) {
      this.addPropertyDataLoading = true;
      // calling rest api
      this.accountService.addProperty(requestData).subscribe(
        response => {
          if (response[CommonConstant.ERROR_CODE] === 0) {
            this.cancelPropertyDetails();
            this.accountService.getDashboardData().subscribe(
              res => {
                this.addPropertyDataLoading = false;

                if (res[CommonConstant.ERROR_CODE] === 0) {
                  this.dashboardServiceData = res[CommonConstant.DATA];
                  this.makeAccountsMetaData();
                  this.setAllFlag();
                  setTimeout(() => {this.drawPropertiesChart()}, 200);
                  setTimeout(() => {this.drawHeadersChart()}, 200);
                } else {
                  console.log('Something went wrong');
                }
              },
              error => {
                this.addPropertyDataLoading = false;
              }
            )
          } else {
            this.addPropertyDataLoading = false;
            document.getElementById('addPropertyErrMsg').innerHTML = response[CommonConstant.MESSAGE];
          }
        },
        error => {
          this.addPropertyDataLoading = false;
          document.getElementById('addPropertyErrMsg').innerHTML = 'Something went wrong..Please try again';
        }
      )
    }

  }

  /**
   * To set existing propert data to the property form
   *
   * To edit the existing form
   * @param any property
   */
  setPropertyFormData(property: any) {

    let purchaseDate = '', lastResetDate = '';
    if (property[AccountConstant.PURCHASE_DATE]) {
      purchaseDate = this.commonHelperService.displayJqueryDateFormat(property[AccountConstant.PURCHASE_DATE], 'DD-MM-YYYY');
    }
    if (property[AccountConstant.LAST_RESET_DATE]) {
      lastResetDate = this.commonHelperService.displayJqueryDateFormat(property[AccountConstant.LAST_RESET_DATE], 'DD-MM-YYYY');
    }

    this.propertyForm.patchValue({
      id: property[CommonConstant.PLAIN_ID],
      name: property[CommonConstant.NAME],
      ownership: property[AccountConstant.OWNERSHIP],
      propertyType: property[CommonConstant.TYPE],
      purpose: property[AccountConstant.PURPOSE],
      marketValue: property[AccountConstant.MARKET_VALUE],
      loan: property[AccountConstant.LOAN_OUTSTANDING_AMOUNT],
      loanResidualTerms: property[AccountConstant.LOAN_RESIDUAL_TERMS],
      interestType: property[AccountConstant.INTEREST_TYPE],
      interestRate: property[AccountConstant.INTEREST_RATE],
      resetFrequency: property[AccountConstant.RESET_FREQUENCY],
      lastResetDate: lastResetDate,
      address: property[AccountConstant.ADDRESS],
      currency: property[CommonConstant.CURRENCY],
      amount: property[CommonConstant.AMOUNT],
      purchaseDate: purchaseDate,
      remarks: property[AccountConstant.REMARKS]
    });
    const currency = property[CommonConstant.CURRENCY];
    this.onCurrencyChange(currency);
  }

  /**
   * To edit existing property
   *
   * To open edit property form
   * @param TemplateRef template
   * @param string id
   * @param any propertyAmount
   * @param any property
   */
  prepareEditProperty = (template: TemplateRef<any>, id: string, propertyAmount: any, property: any) => {

    this.createPropertyForm();
    this.addPropertyFlag = false;
    this.openPropertyModal(template, 'edit');

    $(document).on('focus', '.purchaseDate', function () {
      const date = new Date();
      $(this).datepicker({
        dateFormat: 'dd-mm-yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '1900:+0',
        minDate: new Date(1900, 10 - 1, 25),
        maxDate: new Date(),
      });
    });

    $(document).on('focus', '.lastResetDate', function () {
      const date = new Date();
      $(this).datepicker({
        dateFormat: 'dd-mm-yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '1900:+0',
        minDate: new Date(1900, 10 - 1, 25),
        maxDate: new Date(),
      });
    });
    this.setPropertyFormData(property);
  }

  /**
   * Submit request data to edit existng property
   *
   * Calling rest api in this method
   * @param any purchaseDateArg
   * @param any lastResetDateArg
   */
  editProperty(purchaseDateArg: any, lastResetDateArg: any) {

    document.getElementById('addPropertyErrMsg').innerHTML = '';

    let purchaseDate = purchaseDateArg.value;
    if (purchaseDate) {
      purchaseDate = moment(purchaseDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    }

    let lastResetDate = '';
    if (lastResetDateArg) {
      lastResetDate = lastResetDateArg.value;
      if (lastResetDate) {
        lastResetDate = moment(lastResetDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
      }
    }

    const requestData = this.prepareRequestForAddProperty(purchaseDate, lastResetDate);
    if (requestData) {
      this.addPropertyDataLoading = true;
      this.accountService.editProperty(requestData).subscribe(
        response => {
          this.addPropertyDataLoading = false;
          if (response[CommonConstant.ERROR_CODE] === 0) {
            this.cancelPropertyDetails();
            this.accountService.getDashboardData().subscribe(
              res => {
                if (res[CommonConstant.ERROR_CODE] === 0) {
                  this.dashboardServiceData = res[CommonConstant.DATA];
                  this.makeAccountsMetaData();
                  this.setAllFlag();
                  setTimeout(() => {this.drawPropertiesChart()}, 200);
                  setTimeout(() => {this.drawHeadersChart()}, 200);
                } else {
                  console.log('Something went wrong');
                }
              },
              error => {
                this.addPropertyDataLoading = false;
              }
            )
          } else {
            this.addPropertyDataLoading = false;
            document.getElementById('addPropertyErrMsg').innerHTML = response[CommonConstant.MESSAGE];
          }
        },
        error => {
          this.addPropertyDataLoading = false;
          document.getElementById('addPropertyErrMsg').innerHTML = 'Something went wrong..Please try again';
        }
      )
    }

  }

  /**
   * To open delete property modal
   * @param TemplateRef template
   * @param string id
   */
  prepareDeleteProperty = (template: TemplateRef<any>, id: string) => {
    this.propertyObj = {};
    this.propertyObj['id'] = id;
    this.openPropertyModal(template, 'delete');
  }

  /**
   * To delete existing property
   *
   * Caling delete property rest api
   */
  deleteProperty() {
    this.delPropertyDataLoading = true;
    document.getElementById('delPropertyErrMsg').innerHTML = '';

    let data = {};
    data[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    data[AccountConstant.PROPERTY_ID] = this.propertyObj.id;
    data = JSON.stringify(data);
    // calling rest api
    this.accountService.deleteProperty(data).subscribe(
      response => {
        this.delPropertyDataLoading = false;
        if (response[CommonConstant.ERROR_CODE] === 0) {
          this.cancelPropertyDetails();
          this.accountService.getDashboardData().subscribe(
            res => {
              if (res[CommonConstant.ERROR_CODE] === 0) {
                this.dashboardServiceData = res[CommonConstant.DATA];
                this.makeAccountsMetaData();
                this.setAllFlag();
                setTimeout(() => {this.drawPropertiesChart()}, 200);
                setTimeout(() => {this.drawHeadersChart()}, 200);
              }
            },
            error => {
              console.log(error);
            }
          )
        } else {
          document.getElementById('delPropertyErrMsg').innerHTML = response[CommonConstant.MESSAGE];
        }
      },
      error => {
        document.getElementById('delPropertyErrMsg').innerHTML = 'Something went wrong..Please try again';
      }
    )
  }

  /**
   * Combine link up modal
   */
  openCombineLinkUploadStModal() {
    this.combineLinkUploadStModalRef = this.modalService.show(this.combineLinkUploadStModal, Object.assign(
      {}, this.modalConfig.config, {class: 'modal-md'}
    ))
  }

  /**
   * To close combined link up modal
   */
  closeCombineLinkUploadStModal() {
    if (this.combineLinkUploadStModalRef) {
      this.combineLinkUploadStModalRef.hide();
      this.combineLinkUploadStModalRef = null;
    }
  }

  /**
   * online account Integration
   */

  /**
   * To show statement upload modal
   */
  openAddAccountModal() {
    this.addAccountModalRef = this.modalService.show(this.addAccountModal,
      Object.assign({}, this.modalConfig.config, { class: 'modal-md' })); // addAccountModal
  }

  /**
   * To close statement upload modal
   */
  closeAccountModalDetails() {
    if (this.addAccountModalRef) {
      this.addAccountModalRef.hide();
      this.addAccountModalRef = null;
    }
    this.instCode = '';
    /* this.uploadStmtLoader = true;
    this.uploadSt = {};
    this.stmtFile = {}; */
  }

  /**
   * It will prompt to enter bank related credentials
   * by selecting any bank under institution
   */
  prepareAddAccountPrompt = () => {
    if (this.combineLinkUploadStModalRef) {
      this.closeCombineLinkUploadStModal();
    }
    this.institutionNameInAction = null;
    this.loginFields = null;
    // $("#addAccountBG").css('display', 'none');
    $('#acaErrorMessage').removeClass('pm-red');
    $('#acaErrorMessage').text('');
    this.getOnlineInstitution();
    setTimeout(() => {
      this.openAddAccountModal();
    }, 200);
  }

  /**
   * To get user credential fields to create fields
   *
   * It will prompt to enter bank related credentials
   */
  getPrompts = () => {
    this.institutionNameInAction = $('#institution_name option:selected').text();
    $('#acaErrorMessage').removeClass('pm-red');
    $('#acaErrorMessage').text('');
    this.showMFAOption = false;

    if (this.instCode === '') {
      this.showLoginField = false;
      this.credPresent = false;
      return;
    }
    const userData = {};
    userData['institutionCode'] = this.instCode;
    userData['userId'] = this.commonHttpAdapterService.getCurrentUserId();
    const data = JSON.stringify(userData);
    this.accountService.getPrompts(data).subscribe(
      (response) => {
        if (response) {
          // response = response.data;
          if (response.status === 'Success') {
            this.loginFields = response.fields;
            this.mfaLevel = response.mfaLevel;
            if (response.fields.length > 0) {
              this.showLoginField = true;
              $('#addAccountbtn').removeAttr('disabled');
            } else {
              this.showLoginField = false;
            }

          } else {
            this.showLoginField = false;
          }
        } else {
          console.log('Something went wrong');
          this.showLoginField = false;
        }
      },
      error => {
        console.log('Something went wrong please try again later');
      }
    );
  }

  /**
   * To check MFA
   */
  checkMFAOption = (value: string) => {
    if (value === 'allDetail' && this.mfaLevel === 1) {
      this.showMFAOption = true;
    } else {
      this.showMFAOption = false;
    }
  }

  /**
   * To add online account data
   */
  addAccount = () => {
    $('#acaErrorMessage').text('');
    $('#acaErrorMessage').removeClass('pm-red');
    const userData = {};
    if (!this.instCode) {
      $('#acaErrorMessage').addClass('pm-red');
      $('#acaErrorMessage').text('Please Select a Institution');
      return;
    } else {
      $('#acaErrorMessage').removeClass('pm-red');
    }
    userData['institutionCode'] = this.instCode;
    userData['requestCode'] = 'pimoney';
    userData['userId'] = this.commonHttpAdapterService.getCurrentUserId();
    userData['process'] = 'add';
    if (this.destUsername) {
      userData[AccountConstant.DESTINATION_USERNAME] = this.destUsername;
    } else {
      userData[AccountConstant.DESTINATION_USERNAME] = '';
    }
    if (this.destPass) {
      userData[AccountConstant.DESTINATION_PASS] = this.destPass;
    } else {
      userData[AccountConstant.DESTINATION_PASS] = '';
    }
    if (this.destHost) {
      userData[AccountConstant.DESTINATION_HOST] = this.destHost;
    } else {
      userData[AccountConstant.DESTINATION_HOST] = '';
    }

    if (this.destLocation) {
      userData[AccountConstant.DESTINATION_LOCATION] = this.destLocation;
    } else {
      userData[AccountConstant.DESTINATION_LOCATION] = '';
    }

    const fields = [];

    let isValidationSuccess = true;

    let scrapingPrefSelected = 'accountDetail';
    let mfaFieldSelected = null;
    this.loginFields.forEach(function (field) {
      const fieldData = {};
      fieldData['loginFieldCode'] = field.loginFieldCode;
      fieldData['field'] = field.field;
      fieldData['marker'] = field.marker;
      fieldData['value'] = field.value;
      fieldData['optional'] = field.optional;
      fieldData['options'] = field.options;
      fields.push(fieldData);

      if (field.field.indexOf('scrapingPref') > -1) {
        scrapingPrefSelected = field.value;
      } else if (field.field.indexOf('mfaField') > -1) {
        mfaFieldSelected = field.value;
      }
      if ((!field.value || field.value === '') && field.field !== 'typeChoice'
        && field.field !== 'persistCredentials' && field.field.indexOf('mfaField') < 0 && !field.optional) {
        isValidationSuccess = false;
      }
    });


    // add when dest loc and dest host ( || !this.destHost || !this.destLocation )
    /* if (!this.destUsername || !this.destPass) {
      $('#acaErrorMessage').addClass('pm-red');
      $('#acaErrorMessage').text('Please enter destination path');
      return;
    } else {
      $('#acaErrorMessage').removeClass('pm-red');
      $('#acaErrorMessage').text('');
    } */

    if (scrapingPrefSelected === 'allDetail' && mfaFieldSelected != null && mfaFieldSelected === '') {
      isValidationSuccess = false;
    }
    if (!isValidationSuccess) {
      $('#acaErrorMessage').addClass('pm-red');
      $('#acaErrorMessage').text('Please Fill All Required Fields');
      return;
    } else {
      $('#acaErrorMessage').removeClass('pm-red');
      $('#acaErrorMessage').text('');
    }
    userData['fields'] = fields;

    const data = JSON.stringify(userData);
    this.loading = true;
    $('#addAccountbtn').attr('disabled', 'disabled');
    // To keep in background
    setTimeout(() => {
      $('.infoMessageforAdd').css('display', 'block');
      $('#addAccountLoader').css('display', 'block');
      // $(".addAccountModal").modal('hide');
    }, 200);
    this.accountService.addAccount(data).subscribe(
      (response) => {
        if (response) {
          if (response.status === 'Success') {
            $('#addAccountLoader').css('display', 'none');
            $('.account-action').attr('disabled', 'disabled');
            // $('.addAccountModal').modal('hide');
            this.closeAccountModalDetails();
            setTimeout(() => {
              this.setRefreshData(this.institutionNameInAction, response.trackerId, 'add');
            }, 300);
          } else {
            $('#addAccountLoader').css('display', 'none');
            $('#acaErrorMessage').addClass('pm-red');
            $('#acaErrorMessage').text(response.message);
            $('#addAccountbtn').removeAttr('disabled');
          }
        } else {
          console.log('Something went wrong');
        }
      },
      error => {
        console.log('Something went wrong..Please try agian later');
      }
    );
  }

  /**
   * To set refresh data
   * @param string institutionName
   * @param string trackerId
   * @param string processType
   */
  setRefreshData = (institutionName: string, trackerId: string, processType: string) => {
    const currentRefresh = {
      institutionName: institutionName,
      trackerId: trackerId,
      processType: processType,
      refreshTriggered: false,
      refreshStatus: null
    };
    this.accountHelper.setAddAccountData(currentRefresh);
    setTimeout(() => {
      this.authorisedHeader.setCurrentRefresh(currentRefresh);
    }, 200);
    setTimeout(() => {
      this.currentRefresh = currentRefresh;
      this.authorisedHeader.checkAddAccountStatus();
    }, 5000);
  }

  /**
   * To set institution name
   */
  setInstitutionNameInAction = () => {
    if (this.currentRefresh) {
      this.institutionNameInAction = this.currentRefresh.institutionName;
    } else {
      const currentRefresh = this.accountHelper.getAddAccountData();
      this.institutionNameInAction = currentRefresh['institutionName'];
    }
  }

  /**
   * Callback funtion on account added successfully
   * @param any event
   */
  callBackOnAccountAdded(event: any) {
    this.accountService.getDashboardData().subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.dashboardServiceData = res[CommonConstant.DATA];
          this.makeAccountsMetaData();
          this.setAllFlag();
          setTimeout(() => {
            this.getUserInstitutionData();
          }, 300);
          setTimeout(() => {this.drawHeadersChart()}, 200);
        } else {
          console.log('Something went wrong');
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * To redirect to statement repository page
   */
  redirectToRepository() {
    setTimeout(() => {
      this.router.navigateByUrl('/repo/statementrepository');
    }, 300);
  }

  /**
   * Edit Account Integration
   */

  /**
   * To open edit account modal
   */
  openEditAccountCredentialModal() {
    this.editAccountCredentialModalRef = this.modalService.show(this.editAccountCredential, Object.assign(
      {}, this.modalConfig.config, {class: 'modal-md'}
    ))
  }

  /**
   * To close edit account modal
   */
  closeEditAccountCredentialModal() {
    if (this.editAccountCredentialModalRef) {
      this.editAccountCredentialModalRef.hide();
      this.editAccountCredentialModalRef = null;
    }
  }

  /**
   * To prepare online edit account
   * @param string trackerId
   * @param string institutionName
   */
  prepareEditAccount = (trackerId: string, institutionName: string) => {
    $('#editAccountLoader').css('display', 'none');
    $('#editErrorMessage').removeClass('pm-red');
    $('#editErrorMessage').text('');
    this.institutionNameInAction = institutionName;
    this.loginFieldsEdit = null;
    this.getPromptLoading = true;
    this.updateCredentialTrackerId = trackerId;
    this.refreshRequired = false;
    this.getEditPrompts(trackerId);
    this.openEditAccountCredentialModal();
  }

  /**
   * To toggle button
   */
  showHideEdit = (value: any) => {
    setTimeout(() => {
      this.editCred = !value;
      this.showUpdateButton = value;
    }, 300);
  }

  /**
   * To refersh online account
   */
  editRefreshAccount = () => {
    this.refreshRequired = true;
    this.editAccount();
  }

  /**
   * To hide or show update button
   */
  showHideUpdate = (value: any) => {
    this.showUpdateButton = value;
  }

  /**
   * Edit online account
   */
  editAccount = () => {

    const trackerId = this.updateCredentialTrackerId;
    const userData = {};

    userData['userId'] = this.commonHttpAdapterService.getCurrentUserId();
    userData['requestCode'] = 'pimoney';
    userData['process'] = 'edit';
    userData['trackerId'] = trackerId;

    const fields = [];
    let isValidationSuccess = true;

    let scrapingPrefSelected = 'accountDetail';
    let mfaFieldSelected = null;
    this.loginFieldsEdit.forEach((field) => {
      const fieldData = {};
      fieldData['loginFieldCode'] = field.loginFieldCode;
      fieldData['field'] = field.field;
      fieldData['marker'] = field.marker;
      fieldData['value'] = field.value;
      fieldData['optional'] = field.optional;
      fieldData['options'] = field.options;
      fields.push(fieldData);
      if (field.field.indexOf('scrapingPref') > -1) {
        scrapingPrefSelected = field.value;
      } else if (field.field.indexOf('mfaField') > -1) {
        mfaFieldSelected = field.value;
      }
      // tslint:disable-next-line:max-line-length
      if ((!field.value || field.value === '') && this.editCred && field.field !== 'typeChoice'
        && field.field !== 'persistCredentials' && field.field.indexOf('mfaField') < 0 && !field.optional) {
        isValidationSuccess = false;
      }
    });

    if (scrapingPrefSelected === 'allDetail' && mfaFieldSelected != null && mfaFieldSelected === '') {
      isValidationSuccess = false;
    }
    if (!isValidationSuccess) {
      // console.log("field validation failed");
      $('#editErrorMessage').addClass('pm-red');
      $('#editErrorMessage').text('Please Fill All Required Fields');
      return;
    } else {
      $('#editErrorMessage').removeClass('pm-red');
      $('#editErrorMessage').text('');
    }
    userData['fields'] = fields;

    const data = JSON.stringify(userData);
    $('#editAccountLoader').css('display', 'block');
    this.accountService.updateAccountCredential(data).subscribe(
      response => {
        if (response.status === 'Success') {
          this.closeEditAccountCredentialModal();
          this.notificationMessage = 'Account information updated successfully';
          this.notificationComponent.openComonNotificationModal();
          this.callBackOnAccountAdded('edited');
          if (this.refreshRequired && this.refreshRequired === true) {
            this.accountRefresh(this.updateCredentialTrackerId, this.institutionNameInAction);
          }
        } else {
          $('#editErrorMessage').addClass('pm-red');
          $('#editErrorMessage').text('Could not update the account details.');
        }
      },
      error => {
        console.log(error);
      }
    );

    $('.' + trackerId).removeAttr('disabled');
    $('#editAccountLoader').css('display', 'none');

  }

  /**
   * To get prompts to edit online account
   */
  getEditPrompts = (trackerId) => {

    $('#editErrorMessage').removeClass('pm-red');
    $('#editErrorMessage').text('');
    const userData = {};
    userData['trackerId'] = trackerId;
    userData['userId'] = this.commonHttpAdapterService.getCurrentUserId();
    const data = JSON.stringify(userData);
    this.accountService.getPrompts(data).subscribe(
      response => {
        if (response.status === 'Success') {
          this.loginFieldsEdit = response.fields;
          // initialising
          this.loginFieldsEdit.forEach((field) => {
            this.showHideEdit(field.value);
          })
          this.mfaLevel = response.mfaLevel;
          if (response.fields.length > 0) {
            this.showEditField = true;
            $('#editAccountbtn').removeAttr('disabled');
            this.getPromptLoading = false;
            setTimeout(() => {
              const scrapingPrefSelected = $('#scrapingPref option:selected').val();
              if (scrapingPrefSelected === 'allDetail') {
                this.showMFAOption = true;
              }
            }, 500);

          } else {
            $('#editErrorMessage').removeClass('pm-red');
            $('#editErrorMessage').text('No Fields Found');
          }

        } else {
          $('#editErrorMessage').removeClass('pm-red');
          $('#editErrorMessage').text(response.message);
        }
      }
    );
  }

  /**
   * To refresh online account
   */
  accountRefresh = (trackerId, institutionName) => {
    this.institutionNameInAction = institutionName;

    const userData = {};
    userData['requestCode'] = 'pimoney';
    userData['process'] = 'refresh';
    userData['trackerId'] = trackerId;
    userData['userId'] = this.commonHttpAdapterService.getCurrentUserId();
    const data = JSON.stringify(userData);
    this.accountService.refreshAccount(data).subscribe(
      response => {
      this.loading = false;
      if (response.status === 'Success') {
        $('#addAccountLoader').removeAttr('disabled');
        $('.infoMessageforRefresh').css('display', 'block');
        $('.account-action').attr('disabled', 'disabled');
        this.callBackOnAccountAdded('refreshed');
        this.setRefreshData(this.institutionNameInAction, trackerId, 'refresh');
      } else if (response.errorCode === 98) {
        this.prepareEditAccount(trackerId, institutionName);
        // this.openEditAccountCredentialModal();
        // $('#editAccountCredential').modal().show();
      } else {
        $('#acaErrorMessage').addClass('pm-red');
        $('#acaErrorMessage').text(response.message);
      }
    })
  }

  /**
   * Delete account integration
   */
  openDeleteAccountModal() {
    this.deleteAccountModalRef = this.modalService.show(this.deleteAccountModal, Object.assign(
      {}, this.modalConfig.config, {class: 'modal-md deleteTransconfModal'}
    ))
  }

  /**
   * To close account delete modal
   */
  closeDeleteAccountModal() {
    if (this.deleteAccountModalRef) {
      this.deleteAccountModalRef.hide();
      this.deleteAccountModalRef = null;
    }
  }

  /**
   * To prepare account delete and open account delete modal
   */
  prepareDeleteAccount = (account) => {
    this.institutionNameInAction = account.institutionName;  // institutionName
    this.trackerIdForDelete = account.bankId; // trackerId
    this.onlineAccountObject = account;
    this.openDeleteAccountModal();
  }

  /**
   * To delete online account
   */
  deleteOnlineAccount = (trackerId) => {
    this.deleteAccountDetailLoading = true;
    let userData = {};
    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData[CommonConstant.TRACKER_ID] = this.onlineAccountObject['bankId'];
    userData[CommonConstant.TAG] = this.onlineAccountObject[CommonConstant.TAG];
    userData[CommonConstant.ACCOUNT_ID] = this.onlineAccountObject[CommonConstant.PLAIN_ID];
    userData['process'] = 'delete';
    userData = JSON.stringify(userData);

    this.loading = true;
    this.accountService.deleteOnlineAccount(userData).subscribe(
      response => {
        this.deleteAccountDetailLoading = false;
        this.loading = false;
        this.closeDeleteAccountModal();
        $('.' + trackerId).removeAttr('disabled');
        if (response === true) {
          this.notificationMessage = 'Account Deleted successfully';
          this.notificationComponent.openComonNotificationModal();
          $('#notificationText').text('Account Deleted successfully');
        } else {
          this.notificationMessage = response.message;
          this.notificationComponent.openComonNotificationModal();
          $('#notificationText').text(response.message);
        }
        this.callBackOnAccountAdded('deleted');
      },
      error => {
        this.deleteAccountDetailLoading = false;
        this.notificationComponent.openComonNotificationModal();
        this.notificationMessage = 'Something went wrong..Please try agian later';
      }
    );

  }

  /**
   * To get custom headers
   */
  getCustomHeaders() {
    let requestData: any = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    requestData = JSON.stringify(requestData);

    this.customOutputService.getCustomHeaderList(requestData).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            const resData = res[CommonConstant.DATA];
            this.headerGroupList = resData;
            // format header group data to show it into dropdown
            /* let reqObj: Object = {};
            resData.forEach(element => {
              reqObj = {};
              reqObj['displayText'] = element;
              if (element) {
                reqObj['value'] = element.toLowerCase();
              }
              this.headerGroupList.push(reqObj);
            }); */
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
   * Upload statement Functionality
   */

  /**
   * To create upload statement form
   */
  createUploadSatementForm() {
    return this.UploadStatementForm = this._fb.group({
      'manualCountry': [''],
      'manualInst': [''],
      'dflHost': [''],
      'dfl': [''],
      'dflUname': [''],
      'dflPass': [''],
      'statementFile': ['']
    });
  }

  /**
   * To get country list
   */
  getStatementCountries() {
    this.accountService.getStatementCountryList().subscribe(
      data => {
        this.statementCountries = data.countries;
      },
      error => {
        console.log('Something went wrong');
      }
    )
  }

  /**
   * To show upload statement modal
   */
  prepareUploadStatement() {
    if (this.combineLinkUploadStModalRef) {
      this.closeCombineLinkUploadStModal();
    }
    this.uploadSt = {};
    // this.getStatementCountries();
    const currencyCode = 'ALL'; // to fetch all institutions
    this.getStatementInstitutions(currencyCode);

    // this.getCustomHeaders(); // to get custom headers
    this.statementUploadPrefShow = true;
    this.openStatementUploadModal(this.uploadStmtModal);
    this.uploadStSubmitButton = false;
    this.fileSizeExceeds = false;
    this.fileFormatNotMatched = false;
    this.uploadSt.manualInst = '';
    // this.uploadSt['outputFileFormat'] = 'taurus';
    this.uploadSt['statementUploadPref'] = 'pimoney';
  }

  /**
   * On header groun change
   */
  headerGroupOnChange() {
    if (this.uploadSt['headerGroup']) {
      let headerGroup = this.uploadSt.headerGroup;
      if (headerGroup) {
        headerGroup = headerGroup.toLowerCase();
      }
      const orgOutputFileGroupList = this.orgOutputFileGroupList;
      let targetArray: any = [];
      if (headerGroup === 'taurus') {
        this.uploadSt['outputFileFormat'] = 'taurus';
        this.outputFileGroupList = this.orgOutputFileGroupList;
      } else {
        targetArray = orgOutputFileGroupList.filter(obj => {
          return obj.value !== 'taurus' && obj.value !== 'xml';
        });
        this.outputFileGroupList = targetArray;
        this.uploadSt['outputFileFormat'] = 'csv';
      }
    }
  }

  /**
   * To reset output file format button
   */
  resetOutputFileFormatButton() {
    this.uploadSt['headerGroup'] = 'pimoney';
    this.uploadSt['outputFileFormat'] = 'csv';
    this.outputFileGroupList = this.orgOutputFileGroupList;

    this.headerGroupOnChange();
  }

  /**
   * To get institutions for statement
   */
  getStatementInstitutions(country_code) {
    this.accountService.getStatementInstitutions(country_code).subscribe(
      data => {
        this.statementInstitutions = data.institutions;
        // remove duplicates
        this.statementInstitutions = this.commonHelperService.removeDuplicates(this.statementInstitutions, 'name');
      },
      error => {
        console.log('Something went wrong');
      }
    )
  }

  /**
   * To fetch statement institutions
   * @param any uploadSt
   */
  fetchStatementInstitutions(uploadSt: any) {
    const country_code = uploadSt.manualCountry;
    uploadSt.manualInst = '';
    this.getStatementInstitutions(country_code);
  }

  /**
   * To read pdf statement
   * @param event
   */
  validateStatement(event: any) {
    this.readStatementFile(event.target);
  }

  /**
   * To calidate pdf file
   * @param any inputValue
   */
  readStatementFile(inputValue: any): void {
    const file: File = inputValue.files[0];
    if (file) {
      const reader: FileReader = new FileReader();

      reader.onloadend = (e) => {

        const maxFileSize = 15360;
        const fileSize: number = file.size / 1024;
        const fileName: string = file.name;
        const fileExtension: string = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        // tslint:disable-next-line:max-line-length
        if (fileExtension === 'pdf') {
          if (fileSize < maxFileSize) {
            this.stmtFile['name'] = fileName;
            this.stmtFile['file'] = reader.result;
            this.stmtFile['file'] = this.stmtFile['file'].split(',')[1];
            this.uploadSt['statementFileName'] = fileName;
            this.uploadStSubmitButton = false;
            this.fileSizeExceeds = false;
            this.fileFormatNotMatched = false;
          } else {
            this.uploadStSubmitButton = true;
            this.fileSizeExceeds = true;
            // console.log('File size exceeds the maximum allowable size of 15MB');
          }
        } else {
          this.fileFormatNotMatched = true;
          this.uploadStSubmitButton = true;
          // console.log('Only PDF allowed');
        }
      }

      reader.readAsDataURL(file);
    }
  }

  /**
   * Upload statement without password protected
   */
  uploadStatement(uploadSt: any) {
    document.getElementById('uploadStErrorMsg').innerHTML = '';
    this.pdfFileRequired = false;
    this.fileSizeExceeds = false;
    this.fileFormatNotMatched = false;

    this.statementData = {};
    this.statementData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    if (Object.keys(this.stmtFile).length === 0) {
      this.pdfFileRequired = true;
      return;
    }
    this.statementData[AccountConstant.STATEMENT_FILE_NAME] = this.stmtFile['name'];
    this.statementData[AccountConstant.DOC_TYPE] = this.stmtFile['file'];
    if (!uploadSt.manualCountry) {
      this.statementData[AccountConstant.LOCALE] = '';
    } else {
      this.statementData[AccountConstant.LOCALE] = uploadSt.manualCountry;
    }
    this.statementData[AccountConstant.INSTITUTION_CODE] = uploadSt.manualInst;
    const stmtPrefShow: boolean = this.statementUploadPrefShow;
    if (stmtPrefShow) {
      this.statementData[CommonConstant.FLOW] = uploadSt.statementUploadPref;
      const headerGroup: string = uploadSt.headerGroup;
      if (uploadSt.statementUploadPref === 'gx') {
        // this.statementData[AccountConstant.HEADER_GROUP_FORMAT] = uploadSt.headerGroup;
        this.statementData[AccountConstant.HEADER_GROUP_FORMAT] = headerGroup;
        this.statementData[AccountConstant.OUTPUT_FILE_FORMAT] = uploadSt.outputFileFormat;
      } else {
        // console.log();
        /* this.statementData[AccountConstant.HEADER_GROUP_FORMAT] = uploadSt.headerGroup;
        this.statementData[AccountConstant.OUTPUT_FILE_FORMAT] = uploadSt.outputFileFormat; */

        this.statementData[AccountConstant.HEADER_GROUP_FORMAT] = 'pimoney';
        this.statementData[AccountConstant.OUTPUT_FILE_FORMAT] = 'json';
      }
    }
    this.uploadStmtLoader = false;

    if (uploadSt.manualInst) {
      this.statementInstitutions.forEach(element => {
        if (element.code === uploadSt.manualInst) {
          this.statementData[CommonConstant.NAME] = element.name;
        }
      });
    }

    this.statementData[AccountConstant.STATEMENT_PASSWORD] = '';
    this.statementData = JSON.stringify(this.statementData);

    // console.log(this.statementData);

    // to check encription
    this.accountService.checkFileEncryption(this.stmtFile['file']).subscribe(
      data => {
        if (data[CommonConstant.ERROR_CODE] === 0) {

          if (data.isPasswordProtected) {
            this.openPasswordModal(this.stmtPasswordModal);
          } else {
            // calling upload statement
            this.accountService.parseStatement(this.statementData).subscribe(
              res => {
                this.uploadStmtLoader = true;
                if (res[CommonConstant.ERROR_CODE] === 0 && res[CommonConstant.STATUS] !== CommonConstant.FAIL) {
                  this.cancelStatementUploadDetails(); // to hide statement upload modal
                  // to set fileRepoId in sessionStorage
                  this.accountHelper.setUploadStatementData(res);
                  // redirecting to another page according to statement upload preference
                  const uploadRef = uploadSt.statementUploadPref;
                  setTimeout(() => {
                    if (uploadRef === 'pimoney') {
                      this.router.navigateByUrl('preview');
                    } else {
                      this.router.navigateByUrl('review');
                    }
                  }, 300);
                } else if (res[CommonConstant.ERROR_CODE] === 0 && res[CommonConstant.STATUS] === CommonConstant.FAIL) {
                  document.getElementById('uploadStErrorMsg').innerHTML = res[CommonConstant.MESSAGE];
                } else {
                  document.getElementById('uploadStErrorMsg').innerHTML = res[CommonConstant.MESSAGE];
                }
              },
              error => {
                this.uploadStmtLoader = true;
                document.getElementById('uploadStErrorMsg').innerHTML = 'Something went wrong.. Please try again';
              }
            )
          }
        } else {
          this.uploadStmtLoader = true;
          document.getElementById('uploadStErrorMsg').innerHTML = 'Something went wrong..Please try again';
        }
      },
      error => {
        this.uploadStmtLoader = true;
        document.getElementById('uploadStErrorMsg').innerHTML = 'Something went wrong..Please try again';
      }
    )
  }

  /**
   * To open password input modal
   * @param TemplateRef template
   */
  openPasswordModal(template: TemplateRef<any>) {
    this.otpModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, {class: 'modal-sm'}));
  }

  /**
   * To close password modal
   */
  cancelDetails() {
    if (this.otpModalRef) {
      this.otpModalRef.hide();
      this.otpModalRef = null;
    }
  }

  /**
   * To go back from otp modal
   */
  goBackFromStatementPassword() {

    // hiding otp modap
    if (this.otpModalRef) {
      this.otpModalRef.hide();
      this.otpModalRef = null;
      this.uploadStPass.verify_stmt_pass = '';
    }
    // hiding statement upload modal
    this.cancelStatementUploadDetails();
  }

  /**
   * To show statement upload modal
   */
  openStatementUploadModal(template: TemplateRef<any>) {
    this.statementUploadModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, {class: 'modal-md'}));
  }

  /**
   * To close statement upload modal
   */
  cancelStatementUploadDetails() {
    if (this.statementUploadModalRef) {
      this.statementUploadModalRef.hide();
      this.statementUploadModalRef = null;
    }
    this.uploadStmtLoader = true;
    // this.uploadSt = {};
    this.stmtFile = {};
  }

  /**
   * To upload statement with password protected
   * @param any uploadStPass
   */
  uploadStatementWithPassword(uploadStPass: any) {
    document.getElementById('uploadStErrorMsg').innerHTML = '';
    if (uploadStPass.verify_stmt_pass) {

      let statementDataForPass: any = {};
      statementDataForPass = JSON.parse(this.statementData);  // to parse object data
      statementDataForPass[AccountConstant.STATEMENT_PASSWORD] = uploadStPass.verify_stmt_pass;

      setTimeout(() => {
        if (this.otpModalRef) {
          this.otpModalRef.hide();
          this.otpModalRef = null;
          this.uploadStPass.verify_stmt_pass = '';
        }

         // calling statement parse service
         this.accountService.parseStatement(statementDataForPass).subscribe(
          res => {
            this.uploadStmtLoader = true;
            if (res[CommonConstant.ERROR_CODE] === 0 && res[CommonConstant.STATUS] !== CommonConstant.FAIL) {
              this.cancelStatementUploadDetails(); // to hide statement upload modal
              // redirecting to another page according to statement upload preference
              const uploadRef = this.uploadSt.statementUploadPref;
              setTimeout(() => {
                if (uploadRef === 'pimoney') {
                  this.router.navigateByUrl('preview');
                } else {
                  this.router.navigateByUrl('review');
                }
              }, 300);
            } else if (res[CommonConstant.ERROR_CODE] === 0 && res[CommonConstant.STATUS] === CommonConstant.FAIL) {
              document.getElementById('uploadStErrorMsg').innerHTML = res[CommonConstant.MESSAGE];
            } else {
              document.getElementById('uploadStErrorMsg').innerHTML = res[CommonConstant.MESSAGE];
            }
          },
          error => {
            this.uploadStmtLoader = true;
            document.getElementById('uploadStErrorMsg').innerHTML = 'Something went wrong..Please try again';
          }
        )
      });
    }
  }

  /**
   * Multiple upload statement
   */

  /**
   * To read pedf file
   * @param event
   */
  validateMultipleStatement(event: any) {
    this.multipleStmtFile = [];
    this.readMultipleStatementFile(event.target);
  }

  /**
   * To read pdf file
   * @param any inputValue
   */
  readMultipleStatementFile(inputValue: any): void {
    const files: File = inputValue.files;
    this.multipleStmtFile = [];
    let fileObject: any = {};
    // Loop through the FileList and render image files as thumbnails.
    for (let i = 0, file; file = files[i]; i++) {
      // Only process image files.
      if (!file.type.match('pdf.*')) {
        continue;
      }

      const reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        document.getElementById('list').innerHTML = '';
        return function(e) {
          // Render thumbnail.
          const span = document.createElement('span');
          span.innerHTML = ['<i class="fa fa-file-pdf-o" style="font-size:13px;color:red"></i> ' + theFile.name + ''].join('');
          /* span.innerHTML = ['<img class="thumb" src="', e.target.result,
                            '" title="', theFile.name, '"/>'].join(''); */
          document.getElementById('list').insertBefore(span, null);
        };
      })(file);

      reader.onloadend = (e) => {
        const maxFileSize = 15360;
        const fileSize: number = file.size / 1024;
        const fileName: string = file.name;
        const fileType: string = file.type;
        const fileExtension: string = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        // tslint:disable-next-line:max-line-length
        if (fileExtension === 'pdf') {
          if (fileSize < maxFileSize) {
            fileObject = {};
            fileObject['fileName'] = fileName;
            fileObject['type'] = fileType;
            fileObject['file'] = reader.result;
            fileObject['file'] = fileObject['file'].split(',')[1];
            this.multipleStmtFile.push(fileObject);
            this.multipleUploadStSubmitButton = false;
            this.multipleFileSizeExceeds = false;
            this.multipleFileFormatNotMatched = false;
          } else {
            this.multipleUploadStSubmitButton = true;
            this.multipleFileSizeExceeds = true;
            // console.log('File size exceeds the maximum allowable size of 15MB');
          }
        } else {
          this.multipleFileFormatNotMatched = true;
          this.multiplePdfFileRequired = true;
          // console.log('Only PDF allowed');
        }
      }

      // Read in the image file as a data URL.
      reader.readAsDataURL(file);
    }

  }

  /**
   * To upload multiple pdf statement
   * @param any uploadMulSt
   */
  uploadMultipleStatement(uploadMulSt: any) {
    document.getElementById('uploadMulStErrorMsg').innerHTML = '';
    let requestData: any = {};
    requestData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    console.log(this.multipleStmtFile);
    // getting files
    if (this.multipleStmtFile.length > 0) {
      requestData[CommonConstant.FILES] = this.multipleStmtFile;
    } else {
      document.getElementById('uploadMulStErrorMsg').innerHTML = 'Please select file';
      requestData[CommonConstant.FILES] = [];
      return;
    }
    requestData = JSON.stringify(requestData);
    // console.log(requestData);
    // to check encription
    this.uploadMulStmtLoader = false;
    // calling upload statement
    this.accountService.storeStatement(requestData).subscribe(
      res => {
        // this.uploadMulStmtLoader = true;
        if (res[CommonConstant.ERROR_CODE] === 0 && res[CommonConstant.STATUS] !== CommonConstant.FAIL) {

          // multiple statement parsing
          this.accountService.multipleStatementParsing().subscribe(
              response => {
                this.uploadMulStmtLoader = true;
                if (response[CommonConstant.ERROR_CODE] === 0 && response[CommonConstant.STATUS] !== CommonConstant.FAIL) {
                  this.cancelStatementUploadDetails(); // to hide statement upload modal
                  this.notificationComponent.notificationMessage = response[CommonConstant.MESSAGE];
                  this.notificationComponent.openComonNotificationModal();
                } else if (response[CommonConstant.ERROR_CODE] === 0 && response[CommonConstant.STATUS] === CommonConstant.FAIL) {
                  document.getElementById('uploadMulStErrorMsg').innerHTML = response[CommonConstant.MESSAGE];
                } else {
                  document.getElementById('uploadMulStErrorMsg').innerHTML = response[CommonConstant.MESSAGE];
                }
              },
              error => {
                this.uploadMulStmtLoader = true;
                document.getElementById('uploadMulStErrorMsg').innerHTML = 'Something went wrong.. Please try again';
              }
            )
        } else if (res[CommonConstant.ERROR_CODE] === 0 && res[CommonConstant.STATUS] === CommonConstant.FAIL) {
          document.getElementById('uploadMulStErrorMsg').innerHTML = res[CommonConstant.MESSAGE];
        } else {
          document.getElementById('uploadMulStErrorMsg').innerHTML = res[CommonConstant.MESSAGE];
        }
      },
      error => {
        this.uploadMulStmtLoader = true;
        document.getElementById('uploadMulStErrorMsg').innerHTML = 'Something went wrong.. Please try again';
      }
    )
  }

  /**
   * Pre-populate all data into upload statement moda to refresh manual account
   * @param any stmtData
   */
  manualAccountRefresh = (stmtData: any) => {
    if (stmtData) {
      this.uploadSt = {};
      this.getStatementCountries();
      this.uploadStSubmitButton = false;
      this.fileSizeExceeds = false;
      this.fileFormatNotMatched = false;
      this.statementUploadPrefShow = false;
      // this.uploadSt['statementUploadPref'] = 'pimoney';
      // const countryCode = stmtData.countryCode;
      const countryCode = 'ALL';

      this.uploadSt['currency'] = stmtData.currency;
      this.uploadSt['manualCountry'] = countryCode;

      let data = {};
      data[CommonConstant.ACCOUNT_TYPE] = stmtData.accountType;
      // data[CommonConstant.COUNTRY_CODE] = country_code;
      data = JSON.stringify(data);

      // To get manual institutions
      if (this.statementInstitutions && this.statementInstitutions.length > 0) {
        this.statementInstitutions.forEach((element) => {
          if (stmtData.institutionName === element.name) {
            this.uploadSt['manualInst'] = element.code;
          }
        })
      } else {
        this.accountService.getStatementInstitutions(countryCode).subscribe(
          response => {
            this.statementInstitutions = response.institutions;
            this.statementInstitutions.forEach((element) => {
              if (stmtData.institutionName === element.name) {
                this.uploadSt['manualInst'] = element.code;
              }
            })
          },
          error => {
            console.log('Something went wrong');
          }
        )
      }

      this.openStatementUploadModal(this.uploadStmtModal);
    }
  }

  /**
   * To open modal to delete manual account
   */
  openManulaAccountDeleteModal() {
    this.manualAccounDeleteModalRef = this.modalService.show(
        this.manualAccounDeleteModal, Object.assign({}, this.modalConfig.config, {class: 'modal-md deleteTransconfModal'}));
  }

  /**
   * To close manual account delete modal
   */
  closeManulaAccountDeleteModal() {
    if (this.manualAccounDeleteModalRef) {
      this.manualAccounDeleteModalRef.hide();
      this.manualAccounDeleteModalRef = null;
    }
  }

  /**
   * To open manual account delete modal
   * @param data
   */
  prepareDeleteManualAccountModal(data: any) {
    this.deleteManualData = data;
    this.openManulaAccountDeleteModal();
    // (<HTMLInputElement>document.getElementById('deleteSubmit')).disabled = true;
  };

  // //to validate recepient
  toggleAllAccount = () => {
    // to validate recepient
    if (this.isAllSelected) {
      (<HTMLInputElement>document.getElementById('deleteSubmit')).disabled = false;
    } else {
      (<any>document.getElementById('deleteSubmit')).disabled = true;
    }
    this.selectedManualInstitution.forEach((manualaccount) => {
      manualaccount.selected = this.isAllSelected;
    });
  }

  optionToggled = (account) => {
    let count = 0;
    this.selectedManualInstitution.forEach((element) => {
      if (element.selected) {
        count = count + 1;
      }
    });

    if (count > 0) { // if any of the check box is selected
      (<any>document.getElementById('deleteSubmit')).disabled = false;
    } else {
      (<any>document.getElementById('deleteSubmit')).disabled = true;
    }

    this.isAllSelected = this.selectedManualInstitution.every((manualaccount) => {
      return manualaccount.selected;
    });
  }

  /**
   * Service call to delete manual account
   */
  deleteManualAccount = () => {
    let accountData = {};
    accountData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();

    accountData[CommonConstant.PLAIN_ID] = this.deleteManualData.id;
    accountData[CommonConstant.STATEMENT_GROUP_ID] = this.deleteManualData.stmtGroupId;
    accountData[CommonConstant.INSTITUTION_NAME] = this.deleteManualData.institutionName;
    accountData[CommonConstant.FLOW] = 'pimoney';
    accountData[CommonConstant.TAG] = this.deleteManualData[CommonConstant.TAG];
    accountData = JSON.stringify(accountData);

    this.deleteManualAccountDataLoading = true;
    // Calling service to delete pdf statement
    this.accountService.deleteGroupStatements(accountData).subscribe(
      response => {
        this.deleteManualAccountDataLoading = false;
        if (response[CommonConstant.ERROR_CODE] === 0) {
          this.closeManulaAccountDeleteModal();
          // to refresh contents after delete
          this.callBackOnAccountAdded('deleted manual account');
          this.getManageAccountDetails();
        } else {
          this.notificationMessage = response[CommonConstant.MESSAGE];
          this.notificationComponent.openComonNotificationModal();
        }
      },
      error => {
        this.deleteManualAccountDataLoading = false;
        this.notificationMessage = 'Something went wrong..Please try again';
        this.notificationComponent.openComonNotificationModal();
      }
    );

  };


  /**
   * Insurance Functionality
   */

  /**
   * get Policy Details
   */
  getPoliciesFromEverest() {
    this.accountService.getPolicies().subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          const resData = res[CommonConstant.DATA];
          this.policyData = resData;
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
   * get Policy Details
   */
  getInsurance(addFlag?) {
    this.accountService.getInsurance().subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          const resData = res[CommonConstant.DATA];
          this.insuranceData = resData;
          if (addFlag) {
            setTimeout(() => {
              this.drawInsuranceChart(AccountConstant.DEATH);
            }, 300);
          }
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
   * Cobmine insurance from counjuer and auctor
   */
  combineInsuranceAndPolicyData(): any[] {
    const list: any[] = [];
    Array.prototype.push.apply(list, this.policyData);
    Array.prototype.push.apply(list, this.insuranceData);
    return list
  }

  /**
   * To draw insurance chart
   * @param any type
   */
  drawInsuranceChart(type?: any) {
    // getting sum assured list from account helper
    this.sumAssuredList = this.accountHelper.sumAssuredList;

    const chart_container = document.getElementById('insurance-chart-content');
    if (chart_container == null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="insurance_chart"></canvas>';

    let label = [];
    let data = [];
    let totalPolicyAmount = 0;
    let combinedInsuranceData: any[] = [];
    if (this.policyData.length > 0 || this.insuranceData.length > 0) {

      combinedInsuranceData = this.combineInsuranceAndPolicyData();

      const toDrawGraphData = [];
      const drawData = {};
      const death = AccountConstant.DEATH;
      const accDeath = AccountConstant.ACCIDENTAL_DEATH;
      const permanentDis = AccountConstant.PERMANENT_DISABLITY;
      const criticalIll = AccountConstant.CRITICAL_ILLNESS;

      combinedInsuranceData.forEach(element => {
        if (type === death) {
          if (element[death]) {
            if (element[death]['amount']) {
              label.push('Death');
              data.push(element[death]['amount']);
              totalPolicyAmount = totalPolicyAmount + parseFloat(element[death]['amount']);
            } else if (element[death]) {
              label.push('Death');
              data.push(element[death]);
              totalPolicyAmount = totalPolicyAmount + parseFloat(element[death]);
            }
          }
        } else if (type === accDeath) {
          if (element[accDeath]) {
            if (element[accDeath]['amount']) {
              label.push('Accidental Death');
              data.push(element[accDeath]['amount']);
              totalPolicyAmount = totalPolicyAmount + parseFloat(element[accDeath]['amount']);
            } else if (element[accDeath]) {
              label.push('Accidental Death');
              data.push(element[accDeath]);
              totalPolicyAmount = totalPolicyAmount + parseFloat(element[accDeath]);
            }
          }
        } else if (type === permanentDis) {
          if (element[permanentDis]) {
            if (element[permanentDis]['amount']) {
              label.push('Permanent Disability');
              data.push(element[permanentDis]['amount']);
              totalPolicyAmount = totalPolicyAmount + parseFloat(element[permanentDis]['amount']);
            } else if (element[permanentDis]) {
              label.push('Permanent Disability');
              data.push(element[permanentDis]);
              totalPolicyAmount = totalPolicyAmount + parseFloat(element[permanentDis]);
            }
          }
        } else if (type === criticalIll) {
          if (element[criticalIll]) {
            if (element[criticalIll]['amount']) {
              label.push('Critical Illness');
              data.push(element[criticalIll]['amount']);
              totalPolicyAmount = totalPolicyAmount + parseFloat(element[criticalIll]['amount']);
            } else if (element[criticalIll]) {
              label.push('Critical Illness');
              data.push(element[criticalIll]);
              totalPolicyAmount = totalPolicyAmount + parseFloat(element[criticalIll]);
            }
          }
        }
      })

    } else {
      label = [];
      data = [];
    }
    const currency_symbol = this.commonHelperService.toGetCurrencySymbol(this.preferredCurrency);
    totalPolicyAmount = totalPolicyAmount;
    totalPolicyAmount = this.commonHelperService.numberWithCommas(totalPolicyAmount);
    const defaultCenterLabel = 'Total Insurance' + '<br />' + currency_symbol + ' ' + totalPolicyAmount;
    const total = 3;

    const chart_rendered = 'insurance_chart';
    const legend_rendered = 'insurance-legend';
    const dataEmptyMessage = 'You have not added any insurance.';
    const showLegend = '1';
    const legendPosition = 'down';

    setTimeout(() => {
      this.chartHelperService.commonDoughnutChart(
        label, data, chart_rendered, defaultCenterLabel, currency_symbol, total, legend_rendered);
    }, 200);
  }

  /**
   * On chart view type change
   */
  insuranceGraphViewChange() {
    if (this.insuranceGraphView) {
      this.drawInsuranceChart(this.insuranceGraphView);
    }
  }

  /**
   * Add new policy Integration with common component
   */
  addNewPolicy(selectionFlag?) {
    this.newPolicyComponent.openMainPolicyModal('addnew');
  }

  /**
   * To emit new policy to sidebar components
   * @param event
   */
  onNewPolicyChanged(event) {
    // this.onMainPolicyChanged.emit(event);
    this.getInsurance('insurance added');
  }

}
