import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../shared/common/modal.config';
import { ChartConfig } from '../shared/common/chart.config';
import { Chart } from 'chart.js';
/** Jquery integration */
declare var $: any;
import * as moment from 'moment';

import { CommonConstant } from '../constants/common/common.constant';
import { PreviewConstant } from '../constants/preview/preview.constant';
import { TransactionConstant } from '../constants/transaction/transaction.constant';
import { CommonHttpAdapterService } from '../adapters/common-http-adapter.service';
import { CommonHelperService } from '../helpers/common/common.helper';
import { CommonService } from '../services/common/common.service';
import { AccountService } from '../account/account.service';
import { CommonNotificationComponent } from '../shared/notification.component';

import { institutions, accountTypesData, transactionTypesData } from './transaction';
import { TransactionService } from './transaction.service';

/**
 * transaction component class
 */
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
  providers: [
    CommonHttpAdapterService, CommonHelperService,
    TransactionService, CommonService, AccountService,
    RxJSHelper
  ]
})
export class TransactionComponent implements OnInit, OnDestroy {

  /** Notification component reference */
  @ViewChild('notificationComponent') notificationComponent: CommonNotificationComponent;

  /** Add transaction modal */
  @ViewChild('addTransactionModal') addTransactionModal: TemplateRef<any>;

  /** Delete transaction modal */
  @ViewChild('deleteTransactionModal') deleteTransactionModal: TemplateRef<any>;

  statementCountries: any;
  statementInstitutions: any;
  notificationMessage: string;
  remainingAmount: number;
  transactionCounts: any;

  public transactions: any[] = [];
  public expenseCategoryData: any = {};
  public categorySubCategoryLists: any[] = [];
  public topTransactions: any[] = [];
  public merchantList: any[] = [];

  displayTransactionPage = false;

  // multi filter array declarations
  Filter: any = {
    accountType: [],
    accountNumber: [],
    institutionName: [],
    category: [],
    merchantName: [],
    tags: []
  };

  public accountType = '';
  public accountNumber = '';
  public institutionName = '';
  public category = '';
  public merchantName = '';
  public tag = '';

  public accounts;
  public accountTypes;
  public institutions;
  public categories;
  public merchants;
  public tags;

  public top3expensecategory = '';
  public transactionHeaderChartLoading = true;

  // split transaction
  // initialised list for split txn
  splitTransactionList = {
    lists: []
  };

  // add transaction
  public addTransactionModalRef: BsModalRef;
  public delTransactionModalRef: BsModalRef;
  public currencyListData: any[];
  public popularCurrencyList: any[];
  public accountTypesData: any[];
  public transactionTypesData: any[];
  public addTrans: any = {};
  public institutionList: any[] = [];

  editMulTxnDataLoading: boolean;
  splitTxnDataLoading: boolean;
  addTxnDataLoading: boolean;

  public editTransactionObj: any = {};

  // Delete Transaction
  public transactionObj: any = {};
  delTxnDataLoading: boolean;

  public updateTxnObject: any = {};
  public splitTxnObject: any = {};
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
    disableSince: this.commonHelperService.getCurrentDate()
  };

  // Filter
  startOfMonth: any;
  endOfMonth: any;

  public p = 1;
  public pagesize = 10;

  /**
   * Trnasaciton component class dependencies
   * @param Title titleService
   * @param BsModalService modalService
   * @param ModalConfig modalConfig
   * @param ChartConfig chartConfig
   * @param CommonHttpAdapterService commonHttpAdapterService
   * @param commonHelperService
   * @param TransactionService transactionService
   * @param CommonService commonService
   * @param AccountService accountService
   * @param DomSanitizer _sanitizer
   * @param RxJSHelper rxjsHelper
   */
  constructor(
    private titleService: Title,
    private modalService: BsModalService,
    private modalConfig: ModalConfig,
    private chartConfig: ChartConfig,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private commonHelperService: CommonHelperService,
    private transactionService: TransactionService,
    private commonService: CommonService,
    private accountService: AccountService,
    private _sanitizer: DomSanitizer,
    private rxjsHelper: RxJSHelper
  ) {
    /** To set the title of the page */
    this.titleService.setTitle('Conjurer | Transactions');
  }

  /** @ignore */
  ngOnInit() {
    this.getAllTransactions();
    this.getExpenseCategoryData();

    // To initialize filter object
    this.initFilterObject();
    this.inlineEditTransaction();
    this.getMerchantList();
    this.getCategoryWithSubcategory();
    this.getCurrencyList();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();
    this.closeModals();
  }

  /**
   * Track by function
   */
  trackByFn(index, data) {
    return index;
  }

  /**
   * To close all the modals when component destroys
   */
  closeModals() {
    this.closeAddTransactionModal();
    this.closeDeleteTransactionModal();

    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();
  }

  /**
   * To get the all transactions
   */
  getAllTransactions() {
    this.transactionService.getAllTransactions().subscribe(
      res => {
        this.displayTransactionPage = true;
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.transactions = res['transactions'];
          this.allTransaction();
        } else {
          console.log(res[CommonConstant.MESSAGE]);
        }
      },
      error => {
        this.displayTransactionPage = false;
      }
    )
  }

  /**
   * date picker format
   */
  formatMyDatePickerDate() {
    const d: Date = new Date();
    return {
      date: {
        year: '2017',
        month: '10',
        day: '12'
      }
    };
  }

  /**
   * To get category and subcategory
   */
  getCategoryWithSubcategory() {
    this.commonService.getCategorySubcategoryList().subscribe(
      res => {
        this.categorySubCategoryLists = res;
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * To get expense category data
   */
  getExpenseCategoryData() {
    this.transactionService.getExpensesCategoryGraphData().subscribe(
      res => {
        this.expenseCategoryData = res;
        this.transactionHeaderChartLoading = false;
        setTimeout(() => {
          this.drawExpenseCategoryGraph();
        }, 300);
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * To get all currencies
   */
  getCurrencyList() {
    this.commonService.getCurrenyList().subscribe(
      res => {
        this.currencyListData = res.currencyList;
        this.makePopularCurrencyList();
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * To filter out popular currencies from currency list
   */
  makePopularCurrencyList = () => {
    this.popularCurrencyList = [];
    this.currencyListData.forEach((element) => {
      if (element.popular) {
        this.popularCurrencyList.push(element);
      }
    })
  }

  /**
   * To get countries list
   */
  getCountries() {
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
   * To fetch statement institutions
   * @param any addTrans
   */
  fetchInstitutions(addTrans: any) {
    const country_code = addTrans.countryCode;
    this.getInstitutions(country_code);
  }

  /**
   * To get institutions based on country code
   * @param string country_code
   */
  getInstitutions(country_code: string) {
    this.institutionList = institutions;
    this.accountService.getStatementInstitutions(country_code).subscribe(
      data => {
        this.statementInstitutions = data.institutions;
      },
      error => {
        console.log('Something went wrong');
      }
    )
  }

  /**
   * To get all account types
   */
  getAccountTypes() {
    this.accountTypesData = accountTypesData['accountTypes'];
  }

  /**
   * To get transaction types
   */
  getTransactionTypes() {
    this.transactionTypesData = transactionTypesData['configurations'];
  }

  /**
   * To get all merchants
   */
  getMerchantList() {
    this.commonService.getmerchantList().subscribe(
      res => {
        this.merchantList = res;
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * To format data to show it into dropdown
   * @param any data
   */
  autocompleListFormatter = (data: any) => {
    const html = `<span style='color:black'>${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * To remove comma from number
   * @param num
   */
  removeSpecialCharacter(num: any) {
    if (num) {
      num = this.commonHelperService.removeSpecialCharacters(num);
      return num;
    }
    return num;
  }

  /**
   * To initialize filter lists
   */
  initFilterObject() {
    this.Filter['accountType'] = [];
    this.Filter['accountNumber'] = [];
    this.Filter['institutionName'] = [];
    this.Filter['category'] = [];
    this.Filter['merchantName'] = [];
    this.Filter['tags'] = [];
  }

  /**
   * To declare all the filetes
   */
  declareAllFilter() {
    this.Filter['accountType'] = [];
    this.Filter['accountNumber'] = [];
    this.Filter['institutionName'] = [];
    this.Filter['category'] = [];
    this.Filter['merchantName'] = [];
    this.Filter['tags'] = [];
  }

  /**
   * Function to clear all the filters
   */
  clearAllFilter = () => {
    this.Filter['accountType'] = [];
    this.Filter['accountNumber'] = [];
    this.Filter['institutionName'] = [];
    this.Filter['category'] = [];
    this.Filter['merchantName'] = [];
    this.Filter['tags'] = [];

    this.accountType = '';
    this.accountNumber = '';
    this.institutionName = '';
    this.category = '';
    this.merchantName = '';
    this.tag = '';

    // Clear function for side graph click event
    // delete this.passDatetoFilter;
    // Hiding transaction category graph on clear individual filter
    $('#category_chart_div').hide();
  }

  /**
   * get all filters data
   */
  filterDetails = () => {
    // code to create other data objects required for filtering purpose(i.e. dropdown data) on transaction page
    let accounts: any = { 'accounts': [] };
    let accountTypes: any = { 'accountTypes': [] };
    let institutions: any = { 'institutions': [] };
    let categories: any = { 'categories': [] };
    let merchants: any = { 'merchants': [] };
    let tags: any = { 'tags': [] };
    const acc = [];
    this.transactions.forEach((trans) => {
      if ($.inArray(trans.accountNumber, accounts.accounts) < 0) {
        accounts.accounts.push(trans.accountNumber);
      }
      if ($.inArray(trans.tag, accountTypes.accountTypes) < 0) {
        accountTypes.accountTypes.push(trans.tag);
      }
      if ($.inArray(trans.institutionName, institutions.institutions) < 0) {
        institutions.institutions.push(trans.institutionName);
      }
      if ($.inArray(trans.category, categories.categories) < 0) {
        categories.categories.push(trans.category);
      }
      if ($.inArray(trans.merchantName, merchants.merchants) < 0) {
        merchants.merchants.push(trans.merchantName);
      }
      /* if ($.inArray(trans.tag, tags.tags) < 0 && trans.tag != null && trans.tag !== '') {
        tags.tags.push(trans.tag);
      } */
      // to show the all transactions with blank tags also
      /* if (trans.tag === null) {
        trans.tag = '';
      } */
    })

    accounts = accounts.accounts;
    accountTypes = accountTypes.accountTypes;
    institutions = institutions.institutions;
    categories = categories.categories;
    merchants = merchants.merchants;
    tags = tags.tags;

    this.accounts = accounts;
    this.accountTypes = accountTypes;
    this.institutions = institutions;
    this.categories = categories;
    this.merchants = merchants;
    this.tags = tags;
  }

  /**
   * get all transation
   */
  allTransaction() {
    // declare all filters
    this.declareAllFilter();
    // calling filterdetails to populate data in dropdowns on transaction page
    this.filterDetails();
  }

  /**
   * Push account type to list when apply filter
   */
  pushAccountType = () => {
    if (this.accountType === '' || this.accountType === undefined) {
      this.Filter['accountType'] = [];
      this.accountType = '';
    } else {
      if ($.inArray(this.accountType, this.Filter['accountType']) < 0) {
        this.Filter['accountType'].push(this.accountType);
      }
    }
  }

  /**
   * To remove account type form Filter.accountType list
   */
  spliceAccountType = (index: number) => {
    if (this.Filter['accountType'].length === 1) {
      this.accountType = '';
    }
    this.Filter['accountType'].splice(index, 1);
    // Hiding transaction category graph on clear individual filter
    $('#category_chart_div').hide();
  }

  /**
   * To create Filter.accountNumber list
   */
  pushAccountNumber = () => {
    if (this.accountNumber === '' || this.accountNumber === undefined) {
      this.Filter['accountNumber'] = [];
      this.accountNumber = '';
    } else {
      if ($.inArray(this.accountNumber, this.Filter['accountNumber']) < 0) {
        this.Filter['accountNumber'].push(this.accountNumber);
      }
    }

  }

  /**
   * To remove account number form Filter.accountNumber list
   */
  spliceAccountNumber = (index) => {
    if (this.Filter['accountNumber'].length === 1) {
      // delete this.accountNumber;
      this.accountNumber = '';
    }
    this.Filter['accountNumber'].splice(index, 1);
    // Hiding transaction category graph on clear individual filter
    $('#category_chart_div').hide();
  }

  /**
   * To create Filter.institutionName list
   */
  pushInstitutionName = () => {
    if (this.institutionName === '' || this.institutionName === undefined) {
      this.Filter['institutionName'] = [];
      this.institutionName = '';
    } else {
      if ($.inArray(this.institutionName, this.Filter['institutionName']) < 0) {
        this.Filter['institutionName'].push(this.institutionName);
      }
    }
  }

  /**
   * To remove institution name form Filter.institutionName list
   */
  spliceInstitutionName = (index) => {
    if (this.Filter['institutionName'].length === 1) {
      // delete this.institutionName;
      this.institutionName = '';
    }
    this.Filter['institutionName'].splice(index, 1);
    // Hiding transaction category graph on clear individual filter
    $('#category_chart_div').hide();
  }

  /**
   * To create Filter.category list
   */
  pushCategory = () => {
    // Clear function for side graph click event
    // delete this.passDatetoFilter;
    if (this.category === '' || this.category === undefined) {
      this.Filter['category'] = [];
      this.category = '';
    } else {
      if ($.inArray(this.category, this.Filter['category']) < 0) {
        this.Filter['category'].push(this.category);
      }
    }
  }
  // TO remove category form Filter.category list
  spliceCategory = (index) => {
    // Clear function for side graph click event
    // delete this.passDatetoFilter;

    if (this.Filter['category'].length === 1) {
      this.category = '';
    }
    this.Filter['category'].splice(index, 1);
    // Hiding transaction category graph on clear individual filter
    $('#category_chart_div').hide();
  }

  /**
   * To create Filter.merchantName list
   */
  pushMerchantName = () => {
    if (this.merchantName === '' || this.merchantName === undefined) {
      this.Filter['merchantName'] = [];
      this.merchantName = '';
    } else {
      if ($.inArray(this.merchantName, this.Filter['merchantName']) < 0) {
        this.Filter['merchantName'].push(this.merchantName);
      }
    }
  }

  /**
   * To remove merchant name form Filter.merchantName list
   */
  spliceMerchantName = (index) => {
    if (this.Filter['merchantName'].length === 1) {
      delete this.merchantName;
    }
    this.Filter['merchantName'].splice(index, 1);
    // Hiding transaction category graph on clear individual filter
    $('#category_chart_div').hide();
  }

  /**
   * To create Filter.tags list
   */
  pushTags = () => {
    if (this.tag === '' || this.tag === undefined) {
      this.Filter['tags'] = [];
      this.tag = '';
    } else {
      if ($.inArray(this.tag, this.Filter['tags']) < 0) {
        this.Filter['tags'].push(this.tag);
      }
    }
  }

  /**
   * To remove tag from Filter.tags list
   */
  spliceTags = (index) => {
    if (this.Filter['tags'].length === 1) {
      this.tag = '';
    }
    this.Filter['tags'].splice(index, 1);
    // Hiding transaction category graph on clear individual filter
    $('#category_chart_div').hide();
  }

  /**
   * Expense category graph
   */
  drawExpenseCategoryGraph() {

    const chart_container = document.getElementById('transaction_hero_content');
    if (chart_container === null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="transaction_hero"></canvas>';

    // To get currency symbol
    let currency_symbol;
    /* if (this.expenseCategoryData['currency']) {
      currency_symbol = this.commonHelperService.toGetCurrencySymbol(this.expenseCategoryData['currency']);
    } */
    const curr = this.commonHelperService.getUserPreferredCurrency();
    currency_symbol = this.commonHelperService.toGetCurrencySymbol(curr);
    let totalExpense = this.expenseCategoryData['totalExpense'];
    // tslint:disable-next-line:radix
    totalExpense = parseInt(totalExpense);
    totalExpense = this.commonHelperService.numberWithCommas(totalExpense);

    const label = [];
    const data = [];
    const colorList: string[] = [];
    // const color = this.expenseCategoryData.color.split(',');
    const total = this.expenseCategoryData['graphData'].length;
    this.expenseCategoryData['graphData'].forEach((element) => {
      label.push(element.label);
      data.push(parseFloat(element.value));
      const categoryColor = this.chartConfig.getCategoryColorCode(element.label);
      colorList.push(categoryColor);
    })

    let defaultCenterLabel;
    if (label.length > 0 && data.length > 0) {
      defaultCenterLabel = 'Total Expense<br />' + currency_symbol + '' + totalExpense
    } else {
      defaultCenterLabel = 'There are no expenses in the current month'
    }
    const config = {
      type: 'doughnut',
      data: {
        labels: label,
        datasets: [{
          data: data,
          backgroundColor: colorList,
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
            label: function (tooltipItems, data1) {
              const label1 = data1.labels;
              const sum = data1.datasets[0].data.reduce(add, 0);
              function add(a, b) {
                return a + b;
              }

              return label1[tooltipItems.index] + ', ' + (data1.datasets[0].data[tooltipItems.index] / sum * 100) + ' %';
            }
          }
        }
      }
    };

    const txnCategoryChart = (<HTMLCanvasElement>document.getElementById('transaction_hero')).getContext('2d');
    const myTxnChart = new Chart(txnCategoryChart, config);

    setTimeout(() => {
      // this.callAfterTxnPieChartChartLoaded(myTxnChart);
      this.topTransactions = this.expenseCategoryData['topTransaction'];
    })

    document.getElementById('transaction_hero').onclick = (evt) => {
      const activePoints = myTxnChart.getElementsAtEvent(evt);

      if (activePoints.length > 0) {
        // get the internal index of slice in pie myTxnChart
        const clickedElementindex = activePoints[0]['_index'];
      }
    }
  }

  /**
   * To show edit multiple transaction
   */
  showTransactionEdit = (event, transaction) => {
    this.updateTxnObject = {};
    if (Object.keys(transaction).length > 0) {
      this.updateTxnObject = transaction;
    }
    const id = event.currentTarget.id.split('_')[1];
    // For Edit Transacitons (No of Transaction)
    $('#editmultitxn_' + id).show();
    if ($('#splittxn_' + id).is(':visible')) {
      $('#splittxn_' + id).hide();
    }
  }

  /**
   * To find ancestor of any element
   * @param any el
   * @param any cls
   */
  findAncestor(el: any, cls: any) {
    // tslint:disable-next-line:curly
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }

  /**
   * To inline edit for transaction
   * @param number i
   * @param any transaction
   * @param any event
   */
  editTransaction(i: number, transaction: any, event: any) {
    if (!transaction.editTxn) {
      this.editTransactionObj = {};
      this.editTransactionObj = transaction;
      this.editTransactionObj['updatedTransDate'] =
        this.commonHelperService.displayDateFormatMyDatePicker(this.editTransactionObj.transDate);

      this.editTransactionObj['updatedMerchantName'] = this.editTransactionObj.merchantName;
      this.editTransactionObj['updatedCategory'] = this.editTransactionObj.category;
      this.editTransactionObj['updatedSubcategory'] = this.editTransactionObj.subcategory;
      this.editTransactionObj['updatedAmount'] = this.editTransactionObj.amount;

      $('#category_chart_div').show();
      this.drawTransactionCategoryGraph(transaction.id, transaction.category, transaction.tag);

      this.transactions.forEach(element => {
        element.editTxn = false;
      });

      transaction.editTxn = true;

      const ancestor = this.findAncestor(event.target, 'edit_no');
      const ID = ancestor.getAttribute('id');

      // Removing class from editable fields
      $('.edit_no').parent().parent().removeClass('edit-mode').removeClass('edit-multiple');

      // Adding class to make fields editable
      // .addClass('edit-mode').addClass('edit-multiple');
      const d = ancestor.parentElement.parentElement;
      d.className += ' edit-mode';
      d.className += ' edit-multiple';

      // $('#subcategory_input_' + transaction.id).show();
      this.loadDropdown(transaction.id);

      // Adding disabled attribute to delete, split and edit button
      $('.delete-txn-btn').attr('disabled', 'disabled');
      $('.delete-txn-btn').children().attr('src', '/assets/img/transaction/delete1.svg');
      $('.split-txn-btn').attr('disabled', 'disabled');
      $('.split-txn-btn').children().attr('src', '/assets/img/transaction/split1.svg');
      $('.edit-txn-btn').attr('disabled', 'disabled');
      $('.edit-txn-btn').children().attr('src', '/assets/img/transaction/edit_multiple1.svg');

      // Removing disabled attribute to delete, split and edit button
      $('#deltxnbtn_' + ID).removeAttr('disabled');
      $('#deltxnbtn_' + ID).children().attr('src', '/assets/img/transaction/delete2.svg');
      $('#splittxnbtn_' + ID).removeAttr('disabled');
      $('#splittxnbtn_' + ID).children().attr('src', '/assets/img/transaction/split2.svg');
      $('#edittxnbtn_' + ID).removeAttr('disabled');
      $('#edittxnbtn_' + ID).children().attr('src', '/assets/img/transaction/edit_multiple2.svg');
    }
  }

  /**
   * To save updated investment transaction data
   * @param number i
   * @param any transaction
   */
  saveTransaction(index: number, transaction: any) {
    document.getElementById('txnError_' + index).innerHTML = '';
    transaction.transactionDataLoading = true;
    // to remove special charactes from data object coming from DOM
    if (typeof this.editTransactionObj.updatedTransDate === 'object' && this.editTransactionObj.updatedTransDate.formatted) {
      this.editTransactionObj['updatedTransDate'] =
        this.commonHelperService.serviceDateFormat(this.editTransactionObj.updatedTransDate.formatted);
    } else {
      this.editTransactionObj['updatedTransDate'] =
        this.commonHelperService.prepareServiceDate(this.editTransactionObj['updatedTransDate']);
    }
    this.editTransactionObj = this.commonHelperService.sanitizeDataObject(this.editTransactionObj);

    let updatedTxnDetails = {};
    updatedTxnDetails[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    updatedTxnDetails[CommonConstant.FLOW] = 'pimoney';
    updatedTxnDetails[CommonConstant.TAG] = this.editTransactionObj[CommonConstant.TAG];
    const txnDetails = {}
    txnDetails[CommonConstant.PLAIN_ID] = this.editTransactionObj.id;
    // TODO
    // convert all dates to milliseconds
    txnDetails[PreviewConstant.TRANS_DATE] = this.editTransactionObj.updatedTransDate;
    txnDetails[PreviewConstant.MERCHANT_KEY] = this.editTransactionObj.updatedMerchantName;
    txnDetails[PreviewConstant.CATEGORY_KEY] = this.editTransactionObj.updatedCategory;
    txnDetails[PreviewConstant.SUBCATEGORY_KEY] = this.editTransactionObj.updatedSubcategory;
    txnDetails[CommonConstant.AMOUNT] = this.editTransactionObj.updatedAmount;

    updatedTxnDetails[PreviewConstant.TRANSACTION_FIELDS] = txnDetails;
    updatedTxnDetails = JSON.stringify(updatedTxnDetails);

    this.commonService.updateAccounts(updatedTxnDetails).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          // hiding loader and editable fields
          transaction.transactionDataLoading = false;
          transaction.editTxn = false;
          // refresh preview screen
          this.transactions[index] = res.data;
          this.getExpenseCategoryData();
        } else {
          // hiding loader and editable fields
          transaction.transactionDataLoading = false;
          document.getElementById('txnError_' + index).innerHTML = '';
        }
      },
      error => {
        transaction.transactionDataLoading = false;
        document.getElementById('txnError_' + index).innerHTML = 'Something went wrong..Please try again';
      }
    )
  }

  /**
   * To cancel investment updated transaction
   * @param number index
   * @param any transaction
   */
  cancelTransaction(index: number, transaction: any) {
    // transaction.investmentDataLoading = false;
    // document.getElementById('txnError_' + parentIndex + '_' + index).innerHTML = '';

    transaction.transactionDataLoading = false;
    transaction.editTxn = false;

    // Adding disabled attribute to delete, split and edit button
    $('.delete-txn-btn').attr('disabled', 'disabled');
    $('.delete-txn-btn').children().attr('src', '/assets/img/transaction/delete1.svg');
    $('.split-txn-btn').attr('disabled', 'disabled');
    $('.split-txn-btn').children().attr('src', '/assets/img/transaction/split1.svg');
    $('.edit-txn-btn').attr('disabled', 'disabled');
    $('.edit-txn-btn').children().attr('src', '/assets/img/transaction/edit_multiple1.svg');

    // Removing class from editable fields
    $('.edit_no').parent().parent().removeClass('edit-mode').removeClass('edit-multiple');
    $('.editbox').hide();
  }

  /**
   * Inline edit
   */
  inlineEditTransaction() {
    // Inline edit for transaction table

    // It will return false when clicking on editable box
    /* $(document).off('mouseup', '.editbox, .delete-txn-btn, .split-txn-btn, .edit-txn-btn, .splittxn, .editmultitxn, .ui-autocomplete')
      .on('mouseup', '.editbox, .delete-txn-btn, .split-txn-btn, .edit-txn-btn, .splittxn, .editmultitxn, .ui-autocomplete', function () {
        return false;
      }); */

    // on click document, editable fields will be hidden
    $(document).on('mouseup', function () {
      // $('.editbox').hide();
      // $('.text').show();

      // To check split or edit tarnsaction popup is visible or not
      if ($('.editmultitxn').is(':visible') || $('.splittxn').is(':visible')) {

      } else {
        /* $('.delete-txn-btn').attr('disabled', 'disabled');
        $('.delete-txn-btn').children().attr('src', '/assets/img/transaction/delete1.svg');
        $('.split-txn-btn').attr('disabled', 'disabled');
        $('.split-txn-btn').children().attr('src', '/assets/img/transaction/split1.svg');
        $('.edit-txn-btn').attr('disabled', 'disabled');
        $('.edit-txn-btn').children().attr('src', '/assets/img/transaction/edit_multiple1.svg'); */
        // $('.record-row').removeClass('edit-mode').removeClass('edit-multiple');
      }
    });

    // Hiding side graph when user select range to show no of transactions
    $(document).off('change', '#selectRange').on('change', '#selectRange', function () {
      $('#category_chart_div').hide();
    });
    // Hiding side graph when user select any filter
    $(document).off('change', '.sideGraphClear').on('change', '.sideGraphClear', function () {
      $('#category_chart_div').hide();
    });
    // Hiding side graph clicking on pagination items
    $(document).off('click', '.pagination li a').on('click', '.pagination li a', function () {
      $('#category_chart_div').hide();
    });

    this.dropdownsplit();

    $(document).on('focus', '.date', function () {
      // alert('focused');
      const date = new Date();
      $(this).datepicker({
        dateFormat: 'dd-mm-yy',
        changeMonth: true,
        changeYear: true,
        maxDate: new Date(),
      });
    });
  }

  /**
   * To cancel edit transaction
   * @param any event
   */
  cancelEditTransaction = (event: any) => {
    const id = event.currentTarget.id;
    $('#editmultitxn_' + id).hide();
  }

  /**
   * To show split transaction section
   */
  showTransactionSplit = (event, transaction) => {
    this.splitTxnObject = {};
    if (Object.keys(transaction).length > 0) {
      this.splitTxnObject = transaction;
    }
    const id = event.currentTarget.id.split('_')[1];
    $('#splittxn_' + id).show();

    if ($('#editmultitxn_' + id).is(':visible')) {
      $('#editmultitxn_' + id).hide();
    }
  }

  /**
   * To cancel split transaction
   * @param any event
   */
  cancelSplitTransaction = (event: any) => {
    const id = event.currentTarget.id;
    $('#splittxn_' + id).hide();
  }

  /**
   * Split transaction category and subcategory pupulate
   */
  getCategorySubcategorysplit = function (mainindex, trans_id, category, subcategory) {
    $('#split_category_' + trans_id + '_' + mainindex).val(category).trigger('change');
    $('#split_subcategory_' + trans_id + '_' + mainindex).val(subcategory).trigger('change');
  }

  /**
   * To split transaction
   */
  splitTransactionDetails(txnId) {
    this.splitTxnDataLoading = true;

    let splitedTxnData = {};
    const splitedTxnFormData = [];

    // Creating request for languages
    this.splitTransactionList.lists.forEach((key, value) => {
      const inputFieldsData = {};
      inputFieldsData[TransactionConstant.CATEGORY_KEY] = key.category;
      inputFieldsData[TransactionConstant.SUBCATEGORY_KEY] = key.subcategory;
      inputFieldsData[TransactionConstant.AMOUNT_KEY] = key.amount;
      inputFieldsData[TransactionConstant.MERCHANT_KEY] = key.merchantName;
      if (key.transactionDate) {
        const transactionDate = moment(key.transactionDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        inputFieldsData[TransactionConstant.TRANSACTION_DATE_KEY] = transactionDate;
      }

      splitedTxnFormData.push(inputFieldsData);
    })

    // creating json structure for split transaction request data
    splitedTxnData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    splitedTxnData[TransactionConstant.TRANSACTION_KEY] = {};
    splitedTxnData[TransactionConstant.TRANSACTION_KEY][TransactionConstant.TRANSACTION_ID] = txnId;
    splitedTxnData[TransactionConstant.TRANSACTION_KEY][TransactionConstant.REMAINING_AMOUNT_KEY] = this.remainingAmount;
    splitedTxnData[TransactionConstant.TRANSACTION_KEY][TransactionConstant.SPLIT_TRANSACTIONS_KEY] = splitedTxnFormData;

    splitedTxnData = JSON.stringify(splitedTxnData);

    // Calling service to split transaction
    this.transactionService.splitTransaction(splitedTxnData).subscribe(
      (response) => {
        // to refesh transaction and category expense graph
        // callAfterEachOperation();
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Categegory, subcategory change during edit transaction
   * @param any transaction
   * @param string category
   * @param string subcategory
   * @param string cat_image
   */
  getCategorySubcategoryInline = (transaction: any, category: string, subcategory: string, cat_image: string) => {

    /* $('#subcategory_' + trans_id).text(subcategory);
    $('#category_' + trans_id).val(category);
    $('#subcategory_inputbox_' + trans_id).val(subcategory).trigger('change'); */
    this.editTransactionObj.updatedCategory = category;
    this.editTransactionObj.updatedSubcategory = subcategory;
    transaction.categoryImageUrl = cat_image;

    // IMAGE_URL(main controller constant)
    // const img = IMAGE_URL + '' + cat_image;
    /* const img = '/assets/' + cat_image;
    $('#image_' + transaction.id).attr('src', img); */
  };

  /**
   * To Validate amount
   * @param any mainTxnAmount
   * @param string id
   */
  validateAmount = (mainTxnAmount: any, id: string) => {
    let total = 0;
    mainTxnAmount = this.removeSpecialCharacter(mainTxnAmount);
    let isSplited = false;
    if (this.splitTransactionList.lists.length > 0) {
      this.splitTransactionList.lists.forEach((item) => {
        if (item.amount) {
          total = total + parseFloat(item.amount);
          this.remainingAmount = mainTxnAmount - total;
          isSplited = true;
        }
      })
    } else {
      this.remainingAmount = mainTxnAmount;
    }

    if (!isSplited) {
      this.remainingAmount = mainTxnAmount;
    }
    if (total <= mainTxnAmount) {
      $('.splitsubmit').removeAttr('disabled');
      setTimeout(() => {
        const val = this.remainingAmount;
        (<HTMLInputElement>document.getElementById('txn_amount_' + id)).value = String(val);
      }, 50)
      document.getElementById('spliterrormsg').innerHTML = '';
    } else {
      $('.splitsubmit').attr('disabled', 'disabled');
      document.getElementById('spliterrormsg').innerHTML =
        '<span style="color: #cf4808">Input amount is greater than Available amount</span>';
    }

  }

  /**
   * Transaction category grah
   * @param string txn_id
   * @param string category
   * @param string tag
   */
  drawTransactionCategoryGraph(txn_id: string, category: string, tag: string) {
    const that = this;
    const chart_container = document.getElementById('chart_div_content');
    if (chart_container == null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="chart_div"></canvas>';

    // Calling service to get transaction category chart data based on transaction id
    this.transactionService.getTransactionCategoryGraphData(txn_id, tag).subscribe(
      (response) => {
        const txnCategoryLabel = [];
        const txnCategoryData = [];

        response.graphData.forEach((element) => {
          txnCategoryLabel.push(element.label);
          txnCategoryData.push(element.value);
        })

        const txn_category_bar_ctx = (<HTMLCanvasElement>document.getElementById('chart_div'));
        // txn_category_bar_ctx.canvas.width = 200;
        txn_category_bar_ctx.getContext('2d').canvas.height = 250;
        // txn_category_bar_ctx.getContext("2d").canvas.style.backgroundColor = '#f0f0f0';
        const txn_category_bar_chart = new Chart(txn_category_bar_ctx, {
          type: 'bar',
          data: {
            labels: txnCategoryLabel,
            datasets: [
              {
                label: 'Spent',
                data: txnCategoryData,
                backgroundColor: '#ba3f3f',
              }
            ]
          },
          options: {
            animation: {
              duration: 10,
            },
            tooltips: {
              mode: 'label',
              callbacks: {
                label: function (tooltipItem, data) {
                  // tslint:disable-next-line:max-line-length
                  return data.datasets[tooltipItem.datasetIndex].label + ': ' + that.commonHelperService.numberWithCommas(tooltipItem.yLabel);
                }
              }
            },
            scales: {
              xAxes: [{
                barPercentage: 0.3,
                gridLines: { display: false },
              }]
            }, // scales
            legend: { display: false },
            title: {
              display: true,
              text: category
            },
          } // options
        }
        );

      txn_category_bar_ctx.onclick = (evt) => {
        const activePoints = txn_category_bar_chart.getElementsAtEvent(evt);

        if (activePoints.length > 0) {
          // get the internal index of slice in pie txn_category_bar_chart
          setTimeout(() => {
            const clickedElementindex = activePoints[0]['_index'];
            const shortCurrMonth = txn_category_bar_chart.data.labels[clickedElementindex];
            this.filterTransactionByDateRange(shortCurrMonth);

            this.category = category;
            this.Filter['category'].push(category);
          })

        }
      };
    })
  }

  /**
   * Pass date to filter
   */
  passDatetoFilter = function (transaction) {

    this.formatteddate = moment(transaction.transactionDate).format('YYYY-MM-DD');

    if (this.formatteddate > this.startOfMonth && this.formatteddate < this.endOfMonth) {
      return this.formatteddate;
    }
  }

  /**
   * For Side Graph Filter - transaction date onclick
   * @param any data
   */
  filterTransactionByDateRange = (data: any) => {

    // Month range
    const startOfMonth = moment().month(data).startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().month(data).endOf('month').format('YYYY-MM-DD');
    this.startOfMonth = startOfMonth;
    this.endOfMonth = startOfMonth;
  };

  /**
   * To add new row to splitTransactionList.lists list
   */
  newSplitRow() {
    this.splitTransactionList.lists.push({
      transactionDate: '',
      merchantName: '',
      category: '',
      subcategory: '',
      amount: ''
    });
  }

  /**
   * To remove one row from splitTransactionList.lists list
   * @param number index
   */
  removeSplitRow(index: number) {
    this.splitTransactionList.lists.splice(index, 1);
  }

  /**
   * Activate category and subcategory dropdown on split transaction
   */
  dropdownsplit = () => {
    setTimeout(() => {
      $('.mainmenu3').smartmenus({
        showOnClick: true,
        subMenusSubOffsetX: 1,
        subMenusSubOffsetY: -8
      });
    }, 100);
  }

  /**
   * To load dropdown
   */
  loadDropdown = (txnId) => {
    setTimeout(() => {
      $('#main-menu_' + txnId).smartmenus({
        showOnClick: true,
        subMenusSubOffsetX: 1,
        subMenusSubOffsetY: -8
      });
    }, 200);
  }

  /**
   * Categegory, subcategory change during edit transaction
   * @param string trans_id
   * @param string category
   * @param string subcategory
   * @param string cat_image
   */
  getCategorySubcategoryEdit = (trans_id: string, category: string, subcategory: string, cat_image: string) => {

    $('#category2_' + trans_id).val(category).trigger('change');
    $('#subcategory2_' + trans_id).val(subcategory).trigger('change');

    // IMAGE_URL(main controller constant)
    // var img = IMAGE_URL + '' + cat_image;
    const img = '/assets/' + cat_image;
    $('#image1_' + trans_id).attr('src', img);
  }

  /**
   * To set formatted data to form control txn date
   * @param IMyDateModel event
   */
  onTxnDateChanged(event: IMyDateModel) {
    // tslint:disable-next-line:max-line-length
    // console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    if (event.formatted) {
      /* this.policyInfoForm.patchValue({
        effective_date: event.formatted
      }) */
      const a = moment(event.epoc).format('DD-MM-YYYY');
    }
  }

  /**
   * Update Multiple transaction
   * @param any transaction
   */
  updateMultipleTxn(transaction: any) {

    this.editMulTxnDataLoading = true;
    const transactionDate = moment(transaction.transactionDate, 'YYYY-MM-DD').format('YYYY-MM-DD');

    let transactionData = {};
    transactionData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    transactionData[TransactionConstant.MERCHANT_KEY] = transaction.changeMerchantName;
    transactionData[TransactionConstant.CATEGORY_KEY] = transaction.changeCategory;
    transactionData[TransactionConstant.SUBCATEGORY_KEY] = transaction.changeSubCategory;
    transactionData[TransactionConstant.AMOUNT_KEY] = transaction.amount;
    transactionData[TransactionConstant.TRANSACTION_DATE_KEY] = transactionDate;
    transactionData[TransactionConstant.UPDATE_ALL_FLAG_KEY] = $('input[name=updateAllFlag]:checked').val();
    transactionData[TransactionConstant.TRANSACTION_ID] = transaction.id;
    transactionData[TransactionConstant.NARRATION_KEY] = transaction.changeNarration;
    transactionData[TransactionConstant.TAGS_KEY] = transaction.changeTags;

    transactionData = JSON.stringify(transactionData);

    // Calling service to update multiple transaction
    this.transactionService.editTransaction(transactionData).subscribe(
      (response) => {
        // To refesh transaction and category expense graph
        // callAfterEachOperation();
      },
      error => {
        console.log(error);
      }
    )

  }

  /**
   * To open delete transaction modal
   */
  openDeleteTransactionModal() {
    this.delTransactionModalRef = this.modalService.show(this.deleteTransactionModal,
      Object.assign({}, this.modalConfig.config, { class: 'modal-md deleteTransconfModal' }));
  }

  /**
   * To close delete transaction modal
   */
  closeDeleteTransactionModal() {
    if (this.delTransactionModalRef) {
      this.delTransactionModalRef.hide();
      this.delTransactionModalRef = null;
    }
  }

  /**
   * To open delete transaciton modal
   * @param number index
   * @param any transaction
   */
  prepareDeleteTxn(index: number, transaction: any) {
    this.transactionObj = {};
    this.transactionObj[CommonConstant.PLAIN_ID] = transaction[CommonConstant.PLAIN_ID];
    this.transactionObj[CommonConstant.TAG] = transaction[CommonConstant.TAG];
    this.transactionObj['transactionIndex'] = Number(index);

    this.openDeleteTransactionModal();
  }

  /**
   * To delete Transaction
   */
  deleteTransaction() {
    this.delTxnDataLoading = true;
    let data = {};
    data[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    data[TransactionConstant.TRANSACTION_ID] = this.transactionObj[CommonConstant.PLAIN_ID];
    data[CommonConstant.TAG] = this.transactionObj[CommonConstant.TAG];
    data = JSON.stringify(data);

    // Calling service to delete transaction
    this.transactionService.deleteTransaction(data).subscribe(
      res => {
        this.delTxnDataLoading = true;
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.closeDeleteTransactionModal();
          // to refesh transaction and category expense graph
          /* callAfterEachOperation();
          $timeout(function () {
            $('.deleteTransconfModal').modal('hide');
          }, 100) */
          this.transactions.splice(this.transactionObj['transactionIndex'], 1);
        } else {
          console.log('Something wen wrong');
        }
      },
      error => {
        console.log(error);
      }
    )

  }


  /**
   * Add trasnaction
   */

  /**
   * To open add transaciton modal
   */
  prepareAddTransaction() {
    this.addTrans = {};
    this.addTrans.accountType = '';
    this.addTrans.countryCode = '';
    this.addTrans.institutionCode = '';
    this.addTrans.creditDebit = '';
    this.addTrans.currency = 'SGD';
    this.getCountries();
    this.getTransactionTypes();
    this.getAccountTypes();
    this.openAddTransactionModal();
  }

  /**
   * To open add transaction modal
   */
  openAddTransactionModal() {
    this.addTransactionModalRef = this.modalService.show(this.addTransactionModal,
      Object.assign({}, this.modalConfig.config, { class: 'modal-md' }));
  }

  /**
   * To close add transaction modal
   */
  closeAddTransactionModal() {
    if (this.addTransactionModalRef) {
      this.addTransactionModalRef.hide();
      this.addTransactionModalRef = null;
    }
  }

  /**
   * To load category, subcategory dropdown while adding transaction
   */
  loadAddAccountDropdown = () => {
    setTimeout(() => {
      $('.mainmenu2').smartmenus({
        showOnClick: true,
        subMenusSubOffsetX: 1,
        subMenusSubOffsetY: -8
      });
    }, 100);
  }

  /**
   * Category, Subcategory change during add transaction
   */
  getCategorySubcategoryAddTrans = (category: string, subcategory: string) => {
    /* $('#category1').val(category).trigger('change');
    $('#subcategory1').val(subcategory).trigger('change'); */
    this.addTrans.category = category;
    this.addTrans.subcategory = subcategory;
  };

  /**
   * To add transaction
   */
  addTransaction() {
    this.addTxnDataLoading = true;
    let userData = {};
    let transactionDate;
    if (typeof this.addTrans.transDate === 'object') {
        transactionDate = this.addTrans.transDate.formatted;
        transactionDate = this.commonHelperService.serviceDateFormat(transactionDate);
    }

    userData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    userData[CommonConstant.ACCOUNT_TYPE] = this.addTrans.accountType;
    userData[CommonConstant.INSTITUTION_CODE] = this.addTrans.institutionCode;
    userData[CommonConstant.CURRENCY] = this.addTrans.currency;
    userData[TransactionConstant.CREDIT_DEBIT_KEY] = this.addTrans.creditDebit;
    userData[TransactionConstant.CATEGORY_KEY] = this.addTrans.category;
    userData[TransactionConstant.SUBCATEGORY_KEY] = this.addTrans.subcategory;
    userData[TransactionConstant.AMOUNT_KEY] = this.addTrans.amount;
    if (typeof this.addTrans.merchantName === 'object') {
      userData[TransactionConstant.MERCHANT_KEY] = this.addTrans.merchantName['name'];
    } else if (this.addTrans.merchantName) {
      userData[TransactionConstant.MERCHANT_KEY] = this.addTrans.merchantName;
    } else {
      userData[TransactionConstant.MERCHANT_KEY] = '';
    }
    userData[TransactionConstant.TRANSACTION_DATE_KEY] = transactionDate;
    userData[CommonConstant.ACCOUNT_NUMBER] = 'Manually Added';

    userData = JSON.stringify(userData);

    this.transactionService.addTransaction(userData).subscribe(
      res => {
        this.addTxnDataLoading = false;
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.closeAddTransactionModal();
          // push new transaction object to transaction list
          this.transactions.push(res.data);
          this.getExpenseCategoryData();
        } else {
          this.addTxnDataLoading = false;
          this.notificationComponent.notificationMessage = res[CommonConstant.MESSAGE];
          this.notificationComponent.openComonNotificationModal();
        }
      },
      error => {
        this.addTxnDataLoading = false;
        this.notificationComponent.notificationMessage = 'Something went wrong..Please try again';
        this.notificationComponent.openComonNotificationModal();
      }
    )
  }
}
