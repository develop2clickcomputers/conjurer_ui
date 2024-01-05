import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../shared/common/modal.config';
import { ChartConfig } from '../shared/common/chart.config';
import { ChartHelperService } from '../helpers/chart/chart.helper';
import { Chart } from 'chart.js';

import { CommonConstant } from '../constants/common/common.constant';
import { PreviewConstant } from '../constants/preview/preview.constant';
import { TransactionConstant } from '../constants/transaction/transaction.constant';
import { BudgetConstant } from '../constants/budget/budget.constant';
import { CommonHttpAdapterService } from '../adapters/common-http-adapter.service';
import { CommonHelperService } from '../helpers/common/common.helper';
import { CommonService } from '../services/common/common.service';
import { AccountService } from '../account/account.service';
import { TransactionService } from '../transaction/transaction.service';
import { CommonNotificationComponent } from '../shared/notification.component';
import { BudgetService } from './budget.service';

/** jquery integration */
declare var $: any;
import * as moment from 'moment';

/**
 * Budget class component
 */
@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
  providers: [
    BudgetService, CommonHttpAdapterService, CommonHelperService,
    CommonService, AccountService, ChartHelperService, TransactionService,
    RxJSHelper
  ]
})
export class BudgetComponent implements OnInit, OnDestroy {

  delTxnDataLoading: boolean;

  /** Notification component class reference */
  @ViewChild('notificationComponent', {static: false}) notificationComponent: CommonNotificationComponent;

  /** Add budget modal */
  @ViewChild('addBudgetModal', {static: false}) addBudgetModal: TemplateRef<any>;

  /** Delete Transaction Modal */
  @ViewChild('deleteTransactionModal', {static: false}) deleteTransactionModal: TemplateRef<any>;

  public preferredCurrency: string;
  public budgetListData: any = {};
  public budgetAllocationData: any = {};
  public categorySubCategoryLists: any[] = [];
  public currencyListData: any[];
  public popularCurrencyList: any[];
  public yearList: any[];
  public editTransactionObj: any = {};
  public merchantList: any[] = [];

  headMonth: any;
  headYear: any;
  selectedMonth: any;
  selectedYear: any;
  headerGraphView = 'pie';

  notificationMessage: string;
  deleteBudgetDataLoading: boolean;
  editBudgetDataLoading: boolean;
  addBudgetDataLoading: boolean;

  public budgetObj: any = {};
  public budgetModalRef: BsModalRef;
  public totalBudgetSpentPercentage: number;
  totalBudgetSpentPercentageFlag: boolean;

  // initialised list for split txn
  splitTransactionList = {
    lists: []
  };

  public updateTxnObject: any = {};
  public splitTxnObject: any = {};
  editMulTxnDataLoading: boolean;
  remainingAmount: any;
  splitTxnDataLoading: boolean;
  public transactionObj: any = {};
  public delTransactionModalRef: BsModalRef;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
    disableSince: this.commonHelperService.getCurrentDate()
  };

  /**
   * Budget component class dependencies
   * @param Title titleService
   * @param BsModalService modalService
   * @param ModalConfig modalConfig
   * @param ChartConfig chartConfig
   * @param ChartHelperService chartHelperService
   * @param CommonHttpAdapterService commonHttpAdapterService
   * @param CommonHelperService commonHelperService
   * @param CommonService commonService
   * @param AccountService accountService
   * @param BudgetService budgetService
   * @param TransactionService transactionService
   * @param DomSanitizer _sanitizer
   * @param RxJSHelper rxjsHelper
   */
  constructor(
    private titleService: Title,
    private modalService: BsModalService,
    private modalConfig: ModalConfig,
    private chartConfig: ChartConfig,
    private chartHelperService: ChartHelperService,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private commonHelperService: CommonHelperService,
    private commonService: CommonService,
    private accountService: AccountService,
    private budgetService: BudgetService,
    private transactionService: TransactionService,
    private _sanitizer: DomSanitizer,
    private rxjsHelper: RxJSHelper
  ) {
    /** To set tile of the page */
    this.titleService.setTitle('Conjurer | Budgets');
  }

  /** @ignore */
  ngOnInit() {
    this.preferredCurrency = this.commonHelperService.getUserPreferredCurrency();
    this.getBudgetData();
    this.getCategoryWithSubcategory();
    this.getCurrencyList();
    this.getBudgetYearRange();
    this.getMerchantList();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();
    this.closeModals();
  }

  /**
   * To close all the modals whenever budget component destroys
   */
  closeModals() {
    this.closeBudgetModal();
    this.closeDeleteTransactionModal();
  }

  /**
   * To get all budgets
   */
  getBudgetData() {

    this.budgetService.getBudgets().subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.headerGraphView = 'pie';
          this.budgetListData = res[CommonConstant.DATA];
          if (this.budgetListData) {
            this.calculatePercentage(this.budgetListData.totalBudgetAmount, this.budgetListData.totalSpentAmount);
          }
          this.drwaBudgetAllocationPieChart();
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
   * To get all budgets by date, month, and year
   */
  getBudgetDataMonthYearWise(month, year) {

    this.budgetService.getBudgets(month, year).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.headerGraphView = 'pie';
          this.budgetListData = res[CommonConstant.DATA];
          if (this.budgetListData) {
            this.calculatePercentage(this.budgetListData.totalBudgetAmount, this.budgetListData.totalSpentAmount);
          }
          this.drwaBudgetAllocationPieChart();
        } else {
          console.log(res[CommonConstant.MESSAGE]);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  /** Convert to Integer */
  parseInt(val: any) {
    return parseInt(val, 10);
  }

  /**
   * Get category and subcategory
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
   * To get currencies
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
   * To get budget year range from budget service
   *
   * link [BudgetService]{@link BudgetService}
   */
  getBudgetYearRange() {
    this.yearList = this.budgetService.getYearRange();
    if (this.yearList.length > 0) {
      this.selectedYear = this.yearList[0];
    }

    // To highlight month icon for current month
    let month: any = moment().month();
    month = ('0' + (month + 1)).slice(-2);
    this.selectedMonth = month; // To highlight the current month
    this.headMonth = moment(this.selectedMonth, 'MM').format('MMM').toUpperCase();
    const year = moment().year();
    this.selectedYear = year; // To highlight current year
    this.headYear = this.selectedYear;
  }

  /**
   * To filter popular currency from currency list
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
   * To display formatted data in dropdown
   */
  autocompleListFormatter = (data: any) => {
    const html = `<span style='color:black'>${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * To draw circle
   * @param any budget
   */
  getBudgetPercentage(budget: any) {
    const perc = (100 * budget.spentAmount) / budget.amount;
    return perc;
  }

  /**
   * To draw budget allocation chart
   */
  drwaBudgetAllocationPieChart() {
    document.getElementById('budget-allocation-legend').innerHTML = '';
    const chart_container = document.getElementById('budget-chart-content');
    if (chart_container == null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="budget_allocation"></canvas>';

    let currency_symbol: string;

    if (this.budgetListData) {
      const curr = this.commonHelperService.getUserPreferredCurrency();
      currency_symbol = this.commonHelperService.toGetCurrencySymbol(curr);

      let totalBudget = this.budgetListData.totalBudgetAmount;
      totalBudget = this.parseInt(totalBudget);
      totalBudget = this.commonHelperService.numberWithCommas(totalBudget);

      const label = [];
      const data = [];
      const colorList: string[] = [];
      const total = this.budgetListData.budgets.length;

      this.budgetListData.budgets.forEach((element) => {
        label.push(element.category);
        data.push(parseFloat(element.convertedAmount));
        const categoryColor = this.chartConfig.getCategoryColorCode(element.category);
        colorList.push(categoryColor);
      });

      let defaultCenterLabel: string;
      if (label.length > 0 && data.length > 0) {
        defaultCenterLabel = 'Total Budget' + '<br />' + currency_symbol + '' + totalBudget
      } else {
        defaultCenterLabel = 'There are no budgets'
      }

      // drawing graph
      const config = {
        type: 'doughnut',
        data: {
          labels: label,
          datasets: [{
            data: data,
            backgroundColor: colorList,
          }]
        },
        options: {
          cutoutPercentage: this.chartConfig.chartConfiguration.cutoutPercentage, // to set size of dognut chart
          responsive: true,
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
          legend: {
            display: false,
            /*position: 'right',
            labels: {
                boxWidth: 20
            }*/
          },
          tooltips: {
            callbacks: {
              label: (tooltipItems, data1) => {
                const label1 = data1.labels;
                const sum = data1.datasets[0].data.reduce(add, 0);
                function add(a, b) {
                  return a + b;
                }

                // tslint:disable-next-line:max-line-length
                return label1[tooltipItems.index] + ', ' + this.chartHelperService.getTooltipValue(data1, tooltipItems, sum) + ' %';
              },

            }
          }
        }
      };

      const ctx = (<HTMLCanvasElement>document.getElementById('budget_allocation')).getContext('2d');
      const myChart = new Chart(ctx, config);
      // to generate legends
      document.getElementById('budget-allocation-legend').innerHTML = myChart.generateLegend();

    }

  }

  /**
   * To draw budget allocation Col2D Chart for Budget header section
   */
  budgetAllocationCol2DChart() {
    // $('#budget-allocation-legend').html();
    document.getElementById('budget-allocation-legend').innerHTML = '';
    const chart_container = document.getElementById('budget-chart-content');
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="budget_allocation"></canvas>';
    // to get currency symbol
    let currency_symbol;
    const curr = this.commonHelperService.getUserPreferredCurrency();
    currency_symbol = this.commonHelperService.toGetCurrencySymbol(curr);

    const label = [];
    const dataPack1 = [];
    const dataPack2 = [];

    this.budgetListData.budgets.forEach((budget) => {
      label.push(budget.category);
      dataPack1.push(parseFloat(budget.spentAmount));
      dataPack2.push(parseFloat(budget.remainingAmount));
    });


    // chart start
    const bar_ctx = document.getElementById('budget_allocation');
    const bar_chart = new Chart(bar_ctx, {
      type: 'bar',
      data: {
        labels: label,
        datasets: [
          {
            label: 'Spent Amount',
            data: dataPack1,
            backgroundColor: '#ff0000',
          },
          {
            label: 'Remaining Amount',
            data: dataPack2,
            backgroundColor: '#008000',
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 100,
        animation: {
          duration: 10,
        },
        tooltips: {
          mode: 'label',
          callbacks: {
            label: (tooltipItem, data) => {
              return data.datasets[tooltipItem.datasetIndex].label + ': ' + currency_symbol + ' ' +
                this.commonHelperService.numberWithCommas(tooltipItem.yLabel);
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: { display: false },
            ticks: {
              display: false,
              /*callback: function(value) {
                  var st = value.split(' ');
                  // for (var i = 0; i<st.length; i++){
                  //     return st[i];
                  // }
                  return '';
              }*/
            }
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              callback: (value) => this.commonHelperService.numberWithCommas(value),
            },
          }],
        }, // scales
        legend: {
          display: false,
        }
      } // options
    });

    this.budgetListData.budgets.forEach((value) => {
      $('#budget-allocation-legend').append('<ul id="category-list"></ul>');
      // tslint:disable-next-line:max-line-length
      $('#category-list').append('<li><span style="background-color: ' + this.chartConfig.getCategoryColorCode(value.category) + '"></span>' + value.category + '</li>');
    });
  }

  /**
   * Calculate percentage to draw budget spent chart
   * @param any totalAllocated
   * @param any totalSpent
   */
  calculatePercentage = (totalAllocated: any, totalSpent: any) =>  {
    this.totalBudgetSpentPercentage = (parseInt(totalSpent, 10) / parseInt(totalAllocated, 10)) * 100;
    if (isNaN(this.totalBudgetSpentPercentage)) {
      this.totalBudgetSpentPercentageFlag = true;
    } else {
      this.totalBudgetSpentPercentageFlag = false;
      const chartData = {};
      let data = [];
      let color;
      if (this.totalBudgetSpentPercentage >= 100) {
        data = [];
        data.push({ 'label': 'Spent', 'value': this.totalBudgetSpentPercentage });
        color = '#ff0000';

      } else if (this.totalBudgetSpentPercentage <= 75) {
        data = [];
        data.push({ 'label': 'Spent', 'value': this.totalBudgetSpentPercentage },
          { 'label': 'Spent', 'value': 100 - this.totalBudgetSpentPercentage });
        color = '#008000,#CCD1D1'; // Green

      } else if (this.totalBudgetSpentPercentage > 75 && this.totalBudgetSpentPercentage <= 95) {
        data = [];
        data.push({ 'label': 'Spent', 'value': this.totalBudgetSpentPercentage },
        { 'label': 'Spent', 'value': 100 - this.totalBudgetSpentPercentage });
        color = '#ffc200,#CCD1D1'; // orange

      } else if (this.totalBudgetSpentPercentage > 95 && this.totalBudgetSpentPercentage < 100) {
        data = [];
        data.push({ 'label': 'Spent', 'value': this.totalBudgetSpentPercentage },
        { 'label': 'Spent', 'value': 100 - this.totalBudgetSpentPercentage });
        color = '#ff0000,#CCD1D1'; // Red
      }
      setTimeout(() => {
        this.drawBudgetSpentChart(data, color);
      }, 200)
    }
  }

  /**
   * To draw budget spent chart
   * @param any[] chartData
   * @param string color
   */
  drawBudgetSpentChart(chartData: any[], color: string) {
    const chart_container = document.getElementById('budget-spent-chart-content');
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="budget_spent"></canvas>';

    const label = [],
      data = [];

    const colorArray = color.split(',');
    const chart_rendered = 'budget_spent';
    const defaultCenterLabel = this.commonHelperService.numberWithCommas(this.totalBudgetSpentPercentage) + '% of<br /> Budget spent';

    chartData.forEach((element) => {
      label.push(element.label);
      data.push(element.value);
    });

    setTimeout(() => {
      this.chartHelperService.commonStatusChart(label, data, colorArray, chart_rendered, defaultCenterLabel); // from common js file
    })
  }

  /**
   * To draw spent Vs Budget Column Chart in budget details section
   * @param any[] data
   * @param any budget
   * @param number budgetIndex
   */
  spentVsBudgetColumnChart(data: any[], budget: any, budgetIndex: number) {

    const chart_container = document.getElementById('spentVsBudget_' + budgetIndex + '_content');
    if (chart_container == null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="spentVsBudget_' + budgetIndex + '"></canvas>';

    // to get currency symbol
    let currency_symbol: string;
    const curr = budget.currency;
    currency_symbol = this.commonHelperService.toGetCurrencySymbol(curr);

    const label = [];
    const dataPack1 = [];
    const dataPack2 = [];
    data.forEach(element => {
      const formattedDate = moment(element.date).format('MMM');
      label.push(formattedDate);
      dataPack1.push(parseFloat(element.budgetAmount));
      dataPack2.push(parseFloat(element.spentAmount));
    });

    const spent_vs_budget_bar_ctx = (<HTMLCanvasElement>document.getElementById('spentVsBudget_' + budgetIndex));
    spent_vs_budget_bar_ctx.getContext('2d').canvas.height = 200;
    const spent_vs_budget_bar_chart = new Chart(spent_vs_budget_bar_ctx, {
      type: 'bar',
      data: {
        labels: label,
        datasets: [
          {
            label: 'Budget',
            data: dataPack1,
            backgroundColor: '#008000',
          },
          {
            label: 'Spent',
            data: dataPack2,
            backgroundColor: '#ff0000',
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
            label: (tooltipItem, data1) => {
              return data1.datasets[tooltipItem.datasetIndex].label + ': ' + currency_symbol + ' ' +
                this.commonHelperService.numberWithCommas(tooltipItem.yLabel);
            }
          }
        },
        scales: {
          xAxes: [{
            // categorySpacing: 0,
            barPercentage: 0.8,
            gridLines: { display: false },
          }],
          yAxes: [{
            ticks: {
              callback: (value) => this.commonHelperService.numberWithCommas(value),
            },
          }],
        }, // scales
        legend: { display: true },
        title: {
          display: true,
          text: 'Spent vs. Budget Over Last 3 Months (' + budget.currency + ')',
        },
      } // options
    }
    );

  }

  /**
   * To get budget category graph
   */
  budgetCategoryGraph() {
    let category: string;
    if (this.budgetObj.category) {
      category = this.budgetObj.category;
    }

    let categoryGraphData = {};
    categoryGraphData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    categoryGraphData[TransactionConstant.CATEGORY_KEY] = category;

    categoryGraphData = JSON.stringify(categoryGraphData);

    // Calling budgetCategoryGraph service
    this.budgetService.budgetCategoryGraph(categoryGraphData).subscribe(
      response => {
        if (response[CommonConstant.ERROR_CODE] === 0) {
          this.drawBudgetCategoryGraph(response[CommonConstant.DATA], category);
        } else {
          console.log(response[CommonConstant.MESSAGE]);
        }
      },
      error => {
        console.log('Something went wrong');
      }
    )
  }

  /**
   * To draw budget category graph
   * @param any graphData
   * @param any category
   */
  drawBudgetCategoryGraph(graphData: any, category: any) {
    const chart_container = document.getElementById('budget_category_graph_content');
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="budget_category_graph"></canvas>';

    // to get currency symbol
    const currency = this.commonHelperService.getUserPreferredCurrency();

    // reset error field
    $('#addBudgetErrMsg').html('');
    let graphLabel = [];
    let dataPack1 = [];
    graphData.forEach(element => {
      const requiredMonth = moment(element.date).format('MMM'),
            requiredYear = moment(element.date).format('YY');
      /* const requiredMonth = moment().month(monthDigit - 1).format('MMM'),
            requiredYear = moment().year(yearDigit).format('YY'); */

      const newMonthYear = requiredMonth + '-' + requiredYear;
      graphLabel.push(newMonthYear);
      dataPack1.push(element.spentAmount);
    });

    graphLabel = graphLabel.reverse();
    dataPack1 = dataPack1.reverse();

    const budget_category_bar_ctx = (<HTMLCanvasElement>document.getElementById('budget_category_graph'));
    // budget_category_bar_ctx.canvas.width = 200;
    budget_category_bar_ctx.getContext('2d').canvas.height = 350;
    budget_category_bar_ctx.getContext('2d').canvas.style.backgroundColor = '#f0f0f0';
    const budget_category_bar_chart = new Chart(budget_category_bar_ctx, {
      type: 'bar',
      data: {
        labels: graphLabel,
        datasets: [
          {
            label: 'Spent',
            data: dataPack1,
            backgroundColor: '#008000',
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
            label: (tooltipItem, data1) => {
              return data1.datasets[tooltipItem.datasetIndex].label + ': ' +
                this.commonHelperService.numberWithCommas(tooltipItem.yLabel);
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
          text: category + ' (' + currency + ')'
        },
      } // options
    }
    );

    if (graphData.averageSpentAmount) {
      $('#average').text('Average Spend Over Last 3 Months was ' + graphData.averageSpentAmount)
        .parent().css({ background: '#f0f0f0', width: '100%' });
    } else {
      $('#budget_category_graph').text('No Spend Over Last 3 Months');
      $('#average').text('').parent().css({ background: '#FFFFFF' });
    }
  }

  /**
   * Month yearwise dropdown
   */
  monthYearWiseBudget = () => {

    // Calling services
    if (this.selectedMonth && this.selectedYear) {
      // To change current status month year
      this.headMonth = moment(this.selectedMonth, 'MM').format('MMM').toUpperCase();
      this.headYear = this.selectedYear;

      this.getBudgetDataMonthYearWise(this.selectedMonth, this.selectedYear);
    }
  }

  /**
   * To change chart type on change dropdown
   */
  heroGraphViewChange = () => {
    const month = this.selectedMonth;
    const year = this.selectedYear;
    if (this.headerGraphView === 'pie') {
      // Calling services to get budget allocation data based on month and year
      this.drwaBudgetAllocationPieChart();
    } else if (this.headerGraphView === 'bar') {
      // Calling service to get spent vs remaining chart data based on month and year
      this.budgetAllocationCol2DChart();
    }
  }

  /**
   * To draw spent vs budget chart in budget details section
   */
  showSpentVsCategoryChart = (budget, index) => {
      let data = {};
      data[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
      data[BudgetConstant.BUDGET_ID] = budget.id;

      data = JSON.stringify(data);

      // Calling service to get data
      this.budgetService.getSpentVsBudgetGraphData(data).subscribe(
        response => {
          if (response[CommonConstant.ERROR_CODE] === 0) {
            this.spentVsBudgetColumnChart(response[CommonConstant.DATA], budget, index);
          } else {
            console.log(response[CommonConstant.MESSAGE]);
          }
        },
        error => {
          console.log(error);
        }
      );

  }

  /**
   * To open budget modal for add budget, edit budget and delete budget
   * @param TemplateRef template
   */
  openBudgetModal(template: TemplateRef<any>, type) {
    let modalClass;
    if (type === 'addBudget') {
      modalClass = 'modal-md';
    } else if (type === 'editBudget') {
      modalClass = 'modal-md';
    } else if (type === 'delBudget') {
      modalClass = 'modal-md deleteBudgetModal'
    }
    this.budgetModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, {class: modalClass}));
  }

  /**
   * To close budget modal
   */
  closeBudgetModal() {
    if (this.budgetModalRef) {
      this.budgetModalRef.hide();
      this.budgetModalRef = null;
    }
    this.budgetObj = {};
    this.addBudgetDataLoading = false;
  }

  /**
   * Add Budget Integration
   */

  /**
   * To open add budget modal
   * @param TemplateRef template
   */
  prepareAddBudget(template: TemplateRef<any>) {
    const type = 'addBudget';
    this.budgetObj.category = '';
    this.budgetObj.currency = CommonConstant.DEFAULT_CURRENCY;
    this.budgetObj.budgetOption = 'This Month';
    this.openBudgetModal(template, type);
  }

  /**
   * To add budget
   */
  addBudget() {

    if (!this.budgetObj.category) {
      this.notificationComponent.openNotificationModal('Please select category');
      return;
    }

    if (!this.budgetObj.currency) {
      this.notificationComponent.openNotificationModal('Please select currency');
      return;
    }

    if (!this.budgetObj.amount) {
      this.notificationComponent.openNotificationModal('Amount can not be zero or empty');
      return;
    }

    const budgetAmount = Number(this.budgetObj.amount);
    if (!budgetAmount) {
      this.notificationComponent.openNotificationModal('Amount can not be zero or empty');
      return;
    }

    let budgetOption: boolean;
    if (this.budgetObj.budgetOption === 'This Month') {
      budgetOption = true;
    } else if (this.budgetObj.budgetOption === 'Every Month') {
      budgetOption = false;
    }

    let budgetData: any = {};
    budgetData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    budgetData[TransactionConstant.CATEGORY_KEY] = this.budgetObj.category;
    budgetData[TransactionConstant.CURRENCY_KEY] = this.budgetObj.currency;
    budgetData[TransactionConstant.AMOUNT_KEY] = this.budgetObj.amount;
    budgetData[BudgetConstant.BUDGET_OPTION] = budgetOption;

    budgetData = JSON.stringify(budgetData);
    this.addBudgetDataLoading = true;
    this.budgetService.addBudget(budgetData).subscribe(
      response => {
        this.addBudgetDataLoading = false;
        if (response[CommonConstant.ERROR_CODE] === 0) {
          this.closeBudgetModal();
          this.getBudgetData();
        } else {
          this.notificationComponent.openNotificationModal(response[CommonConstant.MESSAGE]);
        }
      },
      error => {
        this.addBudgetDataLoading = false;
        this.notificationComponent.openNotificationModal('Something went wrong..Please try again');
      }
    )
  }

  /**
   * Edit budget Integration
   */

  /**
   * To open edit budget modal
   * @param TemplateRef template
   * @param any budget
   */
  prepareEditBudget(template: TemplateRef<any>, budget: any): void {
    const type = 'editBudget';
    this.budgetObj = {};
    this.budgetObj['id'] = budget['id'];
    this.budgetObj['category'] = budget['category'];
    this.budgetObj['amount'] = budget['amount'];
    this.budgetObj['budgetOption'] = 'This Month';
    this.openBudgetModal(template, type);
  }

  /**
   * To edit existing budget
   */
  editBudget() {
    if (!this.budgetObj.category) {
      this.notificationComponent.openNotificationModal('Please select category');
      return;
    }

    if (!this.budgetObj.amount) {
      this.notificationComponent.openNotificationModal('Amount can not be zero or empty');
      return;
    }

    const budgetAmount = Number(this.budgetObj.amount);
    if (!budgetAmount) {
      this.notificationComponent.openNotificationModal('Amount can not be zero or empty');
      return;
    }

    let budgetOption: boolean;
    if (this.budgetObj.budgetOption === 'This Month') {
      budgetOption = true;
    } else if (this.budgetObj.budgetOption === 'Every Month') {
      budgetOption = false;
    }

    let budgetData: any =  {};
    budgetData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    budgetData[BudgetConstant.BUDGET_ID] = this.budgetObj.id;
    budgetData[TransactionConstant.CATEGORY_KEY] = this.budgetObj.category;
    budgetData[TransactionConstant.AMOUNT_KEY] = this.budgetObj.amount;
    budgetData[BudgetConstant.BUDGET_OPTION] = budgetOption;

    budgetData = JSON.stringify(budgetData);
    this.editBudgetDataLoading = true;
    this.budgetService.editBudget(budgetData).subscribe(
      response => {
        this.editBudgetDataLoading = false;
        if (response[CommonConstant.ERROR_CODE] === 0) {
          this.closeBudgetModal();
          this.getBudgetData();
        } else {
          this.notificationComponent.openNotificationModal(response[CommonConstant.MESSAGE]);
        }
      },
      error => {
        this.editBudgetDataLoading = false;
        this.notificationComponent.openNotificationModal('Something went wrong..Please try again');
      }
    )
  }


  /**
   * Delete Budget Integration
   */

  /**
   * To open delete budget modal
   * @param TemplateRef template
   * @param any budget
   */
  prepareDeleteBudget(template: TemplateRef<any>, budget: any) {
    const type = 'delBudget';
    this.budgetObj = {};
    this.budgetObj['id'] = budget['id'];
    this.budgetObj['budgetOption'] = 'This Month';
    this.openBudgetModal(template, type);
  }

  /**
   * To delete existing modal
   */
  deleteBudget() {
    let budgetOption: boolean;
    if (this.budgetObj.budgetOption === 'This Month') {
      budgetOption = true;
    } else if (this.budgetObj.budgetOption === 'Every Month') {
      budgetOption = false;
    }

    let budgetData: any = {};
    budgetData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    budgetData[BudgetConstant.BUDGET_ID] = this.budgetObj.id;
    budgetData[BudgetConstant.BUDGET_OPTION] = budgetOption;

    budgetData = JSON.stringify(budgetData);

    this.deleteBudgetDataLoading = true;
    this.budgetService.deleteBudget(budgetData).subscribe(
      response => {
        this.deleteBudgetDataLoading = false;
        if (response[CommonConstant.ERROR_CODE] === 0) {
          this.closeBudgetModal();
          this.getBudgetData();
        } else {
          this.notificationComponent.openNotificationModal(response[CommonConstant.MESSAGE]);
        }
      },
      error => {
        this.deleteBudgetDataLoading = false;
        this.notificationComponent.openNotificationModal('Something went wrong..Please try again');
      }
    )
  }

  /**
   * To show edit multiple transaction
   * @param any event
   * @param any transaction
   */
  showTransactionEdit = (event: any, transaction: any) => {
    this.updateTxnObject = {};
    if (Object.keys(transaction).length > 0) {
      this.updateTxnObject = transaction;
    }
    const id = event.currentTarget.id.split('_')[1];
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
   * Budget transaction Integration
   */

  /**
   * To inline edit for transaction
   * @param number index
   * @param number txnIndex
   * @param any transaction
   * @param any event
   */
  editTransaction(index: number, txnIndex: number, transaction: any, event: any): void {

    if (!transaction.editTxn) {
      this.editTransactionObj = {};
      this.editTransactionObj = transaction;
      this.editTransactionObj['updatedTransDate'] =
        this.commonHelperService.displayDateFormatMyDatePicker(this.editTransactionObj.transDate);

      this.editTransactionObj['updatedMerchantName'] = this.editTransactionObj.merchantName;
      this.editTransactionObj['updatedCategory'] = this.editTransactionObj.category;
      this.editTransactionObj['updatedSubcategory'] = this.editTransactionObj.subcategory;
      this.editTransactionObj['updatedAmount'] = this.editTransactionObj.amount;

      this.budgetListData.budgets.forEach(element => {
        element.transactions.forEach(txn => {
          txn.editTxn = false;
        });
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
   * @param number index
   * @param number txnIndex
   * @param any transaction
   */
  saveTransaction(index: number, txnIndex: number, transaction: any) {
    document.getElementById('txnError_' + index + '_' + txnIndex).innerHTML = '';
    transaction.transactionDataLoading = true;
    // to remove special charactes from data object coming from DOM
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
          this.budgetListData.budgets[index].transactions[txnIndex] = res.data;
        } else {
          // hiding loader and editable fields
          transaction.transactionDataLoading = false;
          document.getElementById('txnError_' + index + '_' + txnIndex).innerHTML = '';
          console.log('Something went worng');
        }
      },
      error => {
        transaction.transactionDataLoading = false;
        document.getElementById('txnError_' + index + '_' + txnIndex).innerHTML = 'Something went wrong..Please try again';
      }
    )
  }

  /**
   * To cancel investment updated transaction
   * @param number index
   * @param number txnIndex
   * @param any transaction
   */
  cancelTransaction(index: number, txnIndex: number, transaction: any) {
    // transaction.investmentDataLoading = false;
    transaction.editTxn = false;
    document.getElementById('txnError_' + index + '_' + txnIndex).innerHTML = '';

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
   * To show split transaction section
   * @param any event
   * @param any transaction
   */
  showTransactionSplit = (event: any, transaction: any) => {
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
   * To cancel split transation
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
   * @param string txnId
   */
  splitTransactionDetails(txnId: string) {
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
        console.log(response);
        // callAfterEachOperation();
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * To get category, subcategory on clicking on subcategory
   * @param any transaction
   * @param any category
   * @param any subcategory
   * @param any cat_img
   */
  getCategorySubcategoryInline = (transaction: any, category: any, subcategory: any, cat_image: any) => {
    transaction.category = category;
    transaction.subcategory = subcategory;
    transaction.categoryImageUrl = cat_image;
  };

  /**
   * To remove comma from number
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
   * To validate amount
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
   * @param string txnId
   */
  loadDropdown = (txnId: string) => {
    setTimeout(() => {
      $('#main-menu_' + txnId).smartmenus({
        showOnClick: true,
        subMenusSubOffsetX: 1,
        subMenusSubOffsetY: -8
      });
    }, 200);
  }

  /**
   * Categegory, subcategory change during edit budget transaction
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
    console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    if (event.formatted) {
      /* this.policyInfoForm.patchValue({
        effective_date: event.formatted
      }) */
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
   * To open delete transaction modal
   * @param number index
   * @param number txnIndex
   * @param any transaction
   */
  prepareDeleteTxn(index: number, txnIndex: number, transaction: any): void {
    this.transactionObj = {};
    this.transactionObj[CommonConstant.PLAIN_ID] = transaction[CommonConstant.PLAIN_ID];
    this.transactionObj[CommonConstant.TAG] = transaction[CommonConstant.TAG];
    this.transactionObj['index'] = Number(index);
    this.transactionObj['txnIndex'] = Number(txnIndex);

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
          // tslint:disable-next-line:max-line-length
          this.budgetListData.budgets[this.transactionObj['txnIndex']].transactions.splice(this.transactionObj['transactionIndex'], 1);
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
   * Scroll to budgets section when click on "see all budget button" in header section
   * @param string id
   */
  scrollTo = (id: string) => {
    window.scrollTo(0, 270);
  };

}
