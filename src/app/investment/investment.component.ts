import { Component, OnInit, TemplateRef, ViewChild, OnDestroy, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

import { CommonConstant } from '../constants/common/common.constant';
import { PreviewConstant } from '../constants/preview/preview.constant';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../shared/common/modal.config';
import { ChartConfig } from '../shared/common/chart.config';
import { ChartHelperService } from '../helpers/chart/chart.helper';
import { Chart } from 'chart.js';

import { CommonHttpAdapterService } from '../adapters/common-http-adapter.service';
import { PreviewService } from '../preview/preview.service';
import { InvestmentService } from './investment.service';
import { CommonHelperService } from '../helpers/common/common.helper';

import * as d3 from 'd3';
import * as topojson from 'topojson';
declare var $: any;
declare var c3: any;
// pivot table integration

// import * as Papa from 'papaparse/papaparse.min.js';
import { parse, unparse } from 'papaparse';
import * as XLSX from 'xlsx';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

/**
 * Investment component class
 */
@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.css'],
  providers: [
    InvestmentService, CommonHttpAdapterService, PreviewService,
    CommonHelperService, ChartHelperService, RxJSHelper
  ],
  encapsulation: ViewEncapsulation.None
})
export class InvestmentComponent implements OnInit, OnDestroy, AfterViewInit {

  /** @ignore */
  @ViewChild('holdingAssetModal', {static: false}) holdingAssetModal: TemplateRef<any>;

  /** @ignore */
  @ViewChild('holdingAssetByCategoryModal', {static: false}) holdingAssetByCategoryModal: TemplateRef<any>;

  /** @ignore */
  @ViewChild('deleteAssetTransactionModal', {static: false}) deleteAssetTxnModal: TemplateRef<any>;

  public investments: any = [];
  public investmentByAccount: any = [];
  public investmentTransactions: any = [];
  public currencyListData: any = [];
  public transactionObj: any = {};
  public transCodeData: Array<any> = [];
  public remaingHoldingAssets: any = {};
  public xmlFileDataByInstitution: any[] = [];

  public holdingAssetModalRef: BsModalRef;
  public holdingAssetByCategoryModalRef: BsModalRef;
  public deleteAssetTxnModalRef: BsModalRef;
  public pagesize = 10;
  public currentPage: number[] = []; // pagination under for loop

  public investmentTotalAmount;
  public investmentHeaderGraphData;
  public investmentFilteredHeaderGraphData: any = {};
  public investmentCurrency;
  public investmentPerformance: any;

  public investmentView = 'view1';

  investmentError = false;
  investmentPageLoad = false;
  view1 = false;
  view2 = true;
  delAssetTxnDataLoading = false;
  remainingHoldingAssetDataLoading = false;
  investmentHeaderDataLoading = false;
  investmentHeaderChartLoading = true;
  investmentViewValue = 'assetCategory';
  investmentViewType = 'asset';

  // analytics
  private analyticsData: any;
  private analyticsData1: any;
  anlyticsInputDataType = 'holdings';
  private holdingsData: any[] = [];
  private worldMapData: any[] = [];
  portfolioGraphType = 'assetClass';
  allocationGraphType = 'assetAllocation';

  // allocation matrix bubble chart
  allocationMatrixCategoryGroupOne = 'currency';
  allocationMatrixCategoryGroupTwo = 'assetClass';

  /**
   * Investment component class dependencies
   * @param Title titleService
   * @param InvestmentService investmentService
   * @param CommonHttpAdapterService commonHttpAdapterService
   * @param PreviewService previewService
   * @param CommonHelperService commonHelperService
   * @param BsModalService modalService
   * @param ModalConfig modalConfig
   * @param ChartConfig chartConfig
   * @param ChartHelperService chartHelperService
   * @param RxJSHelper rxjsHelper
   * @param Ng4LoadingSpinnerService loaderService
   */
  constructor(
    private titleService: Title,
    private investmentService: InvestmentService,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private previewService: PreviewService,
    private commonHelperService: CommonHelperService,
    private modalService: BsModalService,
    private modalConfig: ModalConfig,
    private chartConfig: ChartConfig,
    private chartHelperService: ChartHelperService,
    private rxjsHelper: RxJSHelper,
    // private papa: PapaParseService,
    private loaderService: Ng4LoadingSpinnerService
  ) {
    this.titleService.setTitle('Conjurer | Investments');
  }

  /** @ignore */
  ngOnInit() {
    this.getInvestments();
    this.getHeaderChartData();
    this.getInvestmentTransactions();
    this.getCurrencyList();
    this.getTransCode();
    this.getInvestmentPerformance();
  }

  /** @ignore */
  ngAfterViewInit() {
    this.loadAnatyticsData();

    // this.loadPivotTable();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();

    this.closeModals();
  }

  /**
   * To close modal when component destroys
   */
  closeModals() {
    if (this.holdingAssetByCategoryModalRef) {
      this.holdingAssetByCategoryModalRef.hide();
      this.holdingAssetByCategoryModalRef = null;
    }

    if (this.holdingAssetModalRef) {
      this.holdingAssetModalRef.hide();
      this.holdingAssetModalRef = null;
    }

    if (this.deleteAssetTxnModalRef) {
      this.deleteAssetTxnModalRef.hide();
      this.deleteAssetTxnModalRef = null;
    }
  }

  /**
   * To change investment view
   * @param string investmentView
   */
  changeInvestmentView(investmentView: string) {
    if (investmentView === 'view1') {
      this.view1 = false;
      this.view2 = true;
    } else {
      this.view1 = true;
      this.view2 = false;
    }
  }

  /**
   * To get investment data
   */
  getInvestments() {
    this.investmentService.getInvestments().subscribe(
      res => {
        this.investmentPageLoad = true;
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.investments = res.investments;
          this.showInvestmentByAccount();
          this.formatInvestmentData();
        } else {
          console.log('Something went wrong');
        }
      },
      error => {
        this.investmentError = true;
        console.log('Something went wrong');
      }
    )
  }

  /**
   * To format investment data to show it in the template
   */
  formatInvestmentData() {
    let arr: any[] = [];
    this.investments.forEach((invst) => {
      const instName = invst['institutionName'];
      invst['investmentHoldingAssetData'].forEach((element) => {
        for (let index = 0; index < element['investmentHoldingAssetByCategoryData'].length; index++) {
          // add institution to holding objects
          const holding = element['investmentHoldingAssetByCategoryData'][index];
          holding['institutionName'] = instName;
        }
        Array.prototype.push.apply(arr, element['investmentHoldingAssetByCategoryData']);
      });
    });
    arr = arr.filter((element) => {
      return element.holdingAssetCategory !== 'Loan';
    });

    this.worldMapData = arr;
    this.holdingsData = arr;

    setTimeout(() => {
      this.onPortfolioGraphTypeChange();
    }, 300);

    setTimeout(() => {
      this.onDataFormatTypeChange();
      // this.drawWorldMapChart();
    }, 400);
  }

  /**
   * To get header chart data
   */
  getHeaderChartData() {
    this.investmentHeaderChartLoading = true;
    this.investmentService.getInvestmentHeaderGraph().subscribe(
      res => {
        this.investmentHeaderChartLoading = false;
        this.investmentHeaderGraphData = res;
        this.investmentTotalAmount = this.investmentHeaderGraphData['totalAmount'];
        this.investmentCurrency = this.investmentHeaderGraphData['currency'];

        // this.changeInvestmentHeaderGraph();
        this.changeInvestmentTypeGraph();
      },
      error => {
        this.investmentHeaderChartLoading = false;
      }
    )
  }

  /**
   * To get investment performance data
   */
  getInvestmentPerformance() {
    this.investmentService.investmentPerformanceHeader().subscribe(
      res => {
        this.investmentPerformance = res[CommonConstant.RESULT];
        // sort performance data
        this.investmentPerformance = this.investmentPerformance.sort((a, b) => a['value'] - b['value']);
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * Change header graph on change dropdown in header section
   */
  changeInvestmentHeaderGraph = () => {
    this.investmentHeaderDataLoading = true;
    // Calling service to change the chart data
    this.investmentService.getInvestmentHeaderGraph(this.investmentViewValue).subscribe(
      (res) => {
        this.investmentHeaderGraphData = res;
        this.investmentHeaderDataLoading = false;
        if (this.investmentHeaderGraphData) {
          this.investmentFilteredHeaderGraphData = this.investmentHeaderGraphData;
          // this.investmentViewPieChart();  // To draw header doughnut2d chart
          if (this.investmentViewValue !== 'institutionName') {
            this.changeInvestmentTypeGraph();
          } else {
            setTimeout(() => {
              this.investmentViewPieChart();
            }, 300);
          }
        }
      }, error => {
        this.investmentHeaderDataLoading = false;
      })
  }

  /**
   * To change graph type on changing type from dropdown
   */
  changeInvestmentTypeGraph(): void {
    this.investmentFilteredHeaderGraphData = {};
    this.investmentFilteredHeaderGraphData['totalAmount'] = this.investmentHeaderGraphData.totalAmount;
    this.investmentFilteredHeaderGraphData['currency'] = this.investmentHeaderGraphData.currency;
    if (this.investmentViewType === 'asset') {
      const investmentHeaderGraphData = this.investmentHeaderGraphData['chartData'].filter((invst) => {
        return invst.label !== 'Loan';
      });
      this.investmentFilteredHeaderGraphData['chartData'] = investmentHeaderGraphData;

      setTimeout(() => {
        this.investmentViewPieChart();
      }, 300);
    } else if (this.investmentViewType === 'liability') {
      const investmentHeaderGraphData = this.investmentHeaderGraphData['chartData'].filter((invst) => {
        return invst.label === 'Loan';
      });
      this.investmentFilteredHeaderGraphData['chartData'] = investmentHeaderGraphData;

      setTimeout(() => {
        this.investmentViewPieChart();
      }, 300);
    } else if (this.investmentViewType === 'barChart') {
      // draw bar chart
      this.investmentViewBarChart();
    }
  }

  /**
   * To show investment by account
   */
  showInvestmentByAccount() {
    if (this.investments) {
      let investAcc: any = {};
      const investments: any = [];
      this.investments.forEach(investment => {
        investAcc = {};
        investAcc[CommonConstant.ACCOUNT_NUMBER] = investment.accountNumber,
          investAcc[CommonConstant.INSTITUTION_NAME] = investment.institutionName,
          investAcc[CommonConstant.CURRENCY] = investment.currency,
          investAcc[CommonConstant.PLAIN_ID] = investment.id,
          investAcc[CommonConstant.ACCOUNT_NUMBER] = investment.accountNumber;
        investAcc[PreviewConstant.HOLDING_ASSET_LIST] = [];

        investment.investmentHoldingAssetData.forEach(investmentHoldingAssetData => {
          investmentHoldingAssetData.investmentHoldingAssetByCategoryData.forEach(holdingAsset => {
            investAcc[PreviewConstant.HOLDING_ASSET_LIST].push(holdingAsset);
          });
        });
        investments.push(investAcc);
      });

      this.investmentByAccount = investments;
    }
  }

  /**
   * To get investment transactions
   */
  getInvestmentTransactions() {
    this.investmentService.getInvestmentTransaction().subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.investmentTransactions = res.transactions;

          this.arrangeInvestmentTransaction();
        }
      },
      error => {
        console.log(error);
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
      if (list[i].institutionName === obj.institutionName && list[i].accountNumber === obj.accountNumber) {
        return i;
      }
    }
    return false;
  }

  /**
   * To format investment transaction data to show it in the template
   */
  arrangeInvestmentTransaction() {
    const xmlFilesDataByInstitutionArray: any[] = [];
    let xmlFilesDataByInstitutionObject: Object = {};
    this.investmentTransactions.forEach(transaction => {
      // arrange data by institution name
      xmlFilesDataByInstitutionObject = {}
      const instIndex = this.checkInstitutionValue(transaction, xmlFilesDataByInstitutionArray);
      if (instIndex === 0 || instIndex > 0) {
        xmlFilesDataByInstitutionArray[instIndex].transactions.push(transaction);
      } else {
        xmlFilesDataByInstitutionObject['institutionName'] = transaction.institutionName;
        xmlFilesDataByInstitutionObject['accountNumber'] = transaction.accountNumber;
        xmlFilesDataByInstitutionObject['transactions'] = [];
        xmlFilesDataByInstitutionObject['transactions'].push(transaction);
      }
      if (Object.keys(xmlFilesDataByInstitutionObject).length > 0) {
        xmlFilesDataByInstitutionArray.push(xmlFilesDataByInstitutionObject);
      }
    });
    this.xmlFileDataByInstitution = xmlFilesDataByInstitutionArray;
  }

  /**
   * To get all the currencies
   */
  getCurrencyList() {
    this.previewService.getCurrenyList().subscribe(
      res => {
        this.currencyListData = res.currencyList;
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * To get transaction code(transCode)
   */
  getTransCode() {
    this.previewService.getTransCode().subscribe(
      res => {
        this.transCodeData = res['txnCodeList'];
      },
      error => {
        console.log('Something went wrong');
      }
    )
  }

  /**
   * To draw investment header chart
   */
  investmentViewPieChart() {
    if (this.investmentFilteredHeaderGraphData) {
      const chart_container = document.getElementById('invest-chart-container');
      if (chart_container === null) {
        return;
      }
      chart_container.innerHTML = '';
      chart_container.innerHTML += '<canvas id="investment_header_view"></canvas>';

      const chart_data = this.investmentFilteredHeaderGraphData;
      // tslint:disable-next-line:radix
      this.investmentTotalAmount = parseInt(this.investmentFilteredHeaderGraphData.totalAmount);
      this.investmentTotalAmount = this.commonHelperService.numberWithCommas(this.investmentTotalAmount);
      this.investmentCurrency = this.investmentFilteredHeaderGraphData.currency;

      const currency_symbol = this.commonHelperService.toGetCurrencySymbol(this.investmentCurrency);
      const label = [], data = [];
      const total = chart_data.chartData.length;
      chart_data.chartData.forEach((element) => {
        label.push(element.label);
        data.push(parseFloat(element.value));
      })

      let defaultCenterLabel;
      if (label.length > 0 && data.length > 0) {
        defaultCenterLabel = 'Total Portfolio<br />' + currency_symbol + '' + this.investmentTotalAmount;
      } else {
        defaultCenterLabel = 'You have not added any accounts';
      }

      const config = {
        type: 'doughnut',
        data: {
          labels: label,
          datasets: [{
            data: data,
            backgroundColor: this.chartConfig.poolColors(total),
            // hoverBackgroundColor: label
          }]
        },
        options: {
          cutoutPercentage: this.chartConfig.chartConfiguration.cutoutPercentage, // to set size of dognut chart
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 10,
            onComplete: function () {
              // console.log('animation completed');
            }
          },
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
              fontFamily: this.chartConfig.chartConfiguration.fontFamily
              ,
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
              label: (tooltipItems, data1: any) => {
                const label1 = data1.labels;
                const sum = data1.datasets[0].data.reduce(add, 0);
                function add(a, b) {
                  return a + b;
                }

                return label1[tooltipItems.index] + ', ' + this.chartHelperService.getTooltipValue(data1, tooltipItems, sum) + ' %';
              }
            }
          }
        }
      };


      const ctx = (<HTMLCanvasElement>document.getElementById('investment_header_view')).getContext('2d');
      const myChart = new Chart(ctx, config);
      // to generate legends
      document.getElementById('investment-legend').innerHTML = '';
      document.getElementById('investment-legend').innerHTML = myChart.generateLegend();

    }

  }

  /**
   * To draw spent Vs Budget Column Chart in budget details section
   */
  investmentViewBarChart() {

    const chart_container = document.getElementById('invest-chart-container');
    if (chart_container === null) {
      return;
    }
    chart_container.innerHTML = '';
    chart_container.innerHTML += '<canvas id="investment_header_view"></canvas>';

    // to get currency symbol
    let currency_symbol;
    const curr = this.investmentHeaderGraphData.currency;
    currency_symbol = this.commonHelperService.toGetCurrencySymbol(curr);

    const total = this.investmentHeaderGraphData['chartData'].length;
    const label = [];
    const dataPack1 = [];
    this.investmentHeaderGraphData['chartData'].forEach(element => {
      label.push(element.label);
      if (element.label === 'Loan') {
        dataPack1.push(parseFloat('-' + element.value));
      } else {
        dataPack1.push(parseFloat(element.value));
      }
    });

    const investment_bar_ctx = (<HTMLCanvasElement>document.getElementById('investment_header_view'));
    investment_bar_ctx.getContext('2d').canvas.height = 135;
    const investment_bar_chart = new Chart(investment_bar_ctx, {
      type: 'bar',
      data: {
        labels: label,
        datasets: [
          {
            label: 'Categories',
            data: dataPack1,
            backgroundColor: this.chartConfig.poolColors(total)
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
                this.commonHelperService.numberFormat(tooltipItem.yLabel);
            }
          }
        },
        scales: {
          xAxes: [{
            // categorySpacing: 0,
            barPercentage: 0.8,
            gridLines: { display: false },
            display: false
          }],
          yAxes: [{
            ticks: {
              callback: (value) => this.commonHelperService.numberFormat(value),
            },
          }],
        }, // scales
        legend: { display: false },
        /* title: {
          display: true,
          text: 'Spent vs. Budget Over Last 3 Months (' + budget.currency + ')',
        }, */
      } // options
    }
    );

    // to generate legends
    const colorList = this.chartConfig.poolColors(total);
    $('#investment-legend').html('');
    this.investmentHeaderGraphData.chartData.forEach((value, key) => {
      $('#investment-legend').append('<ul id="category-list"></ul>');
      // tslint:disable-next-line:max-line-length
      $('#category-list').append('<li><span style="background-color: ' + colorList[key] + '"></span>' + value.label + '</li>');
    });

  }

  /**
   * To inline edit for asset
   */
  editAssetByAccount(i: number, asset: any) {
    this.investments.forEach(element => {
      element.investmentHoldingAssetData.forEach(assetVal => {
        assetVal.investmentHoldingAssetByCategoryData.forEach(assetCat => {
          assetCat.editAccountAsset = false;
        });
      });
    });

    asset.editAccountAsset = true;
  }

  /**
   * To inline edit holding assets by account arrangement
   * @param number parentIndex
   * @param number index
   * @param any asset
   */
  saveAssetsByAccount(accountIndex: number, assetIndex: number, asset: any) {

    // console.log(accountIndex, assetIndex, asset);
    document.getElementById('assetError_' + accountIndex + '_' + assetIndex).innerHTML = '';
    asset = this.commonHelperService.sanitizeDataObject(asset);
    asset.investmentDataLoading = true;
    if (this.holdingAssetModalRef) {
      this.remainingHoldingAssetDataLoading = true;
    }
    let updatedHoldingAssetDetails: Object = {}
    updatedHoldingAssetDetails[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    updatedHoldingAssetDetails[CommonConstant.FLOW] = 'pimoney';

    const investmentAccountDetails: Object = {};
    investmentAccountDetails[CommonConstant.PLAIN_ID] = asset.id;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_CATEGORY] = asset.holdingAssetCategory;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_COUPON] = asset.holdingAssetCoupon;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_QUANTITY] = asset.holdingAssetQuantity;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_CURRENT_VALUE] = asset.holdingAssetCurrentValue;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_AVERAGE_UNIT_COST] = asset.holdingAssetAverageUnitCost;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_INDICATIVE_PRICE] = asset.holdingAssetIndicativePrice;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_MATURITY_DATE] = asset.holdingAssetMaturityDate;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_LASF_FX_RATE] = asset.holdingAssetLastFxRate;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_FX_ACCURED_INTEREST] = asset.holdingAssetFxAccruedInterest;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_FX_MARKET_VALUE] = asset.holdingAssetFxMarketValue;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_UNREALIZED_PL] = asset.holdingAssetUnrealizedProfitLoss;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_INDICATIVE_PRICE_DATE] = asset.holdingAssetIndicativePriceDate;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_STRIKE_PRICE] = asset.holdingAssetStrikePrice;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_ISIN] = asset.holdingAssetISIN;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_START_DATE] = asset.holdingAssetStartDate;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_SUBCATEGORY] = asset.holdingAssetSubCategory;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_COST] = asset.holdingAssetCost;

    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_ACCOUNT_NUMBER] = asset.holdingAssetAccountNumber;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_SUB_ACCOUNT_NUMBER] = asset.holdingAssetSubAccountNumber;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_YIELD] = asset.holdingAssetYield;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_ACCRUED_INTEREST] = asset.holdingAssetAccruedInterest;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_LAST_FX_RATE] = asset.holdingAssetLastFxRate;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_UNREALIZED_PROFITLOSS_CURRENCY] = asset.holdingAssetUnrealizedProfitLossCurrency;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_TRANS_CODE] = asset.transCode;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_COMMISSION] = asset.commission;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_OTHER_FEES] = asset.otherFees;

    updatedHoldingAssetDetails[PreviewConstant.ASSET_FIELDS] = investmentAccountDetails;
    updatedHoldingAssetDetails = JSON.stringify(updatedHoldingAssetDetails);

    this.previewService.updateInvestmentsData(updatedHoldingAssetDetails).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          // hiding loader and editable fields
          asset.investmentDataLoading = false;
          asset.editAsset = false;
          if (this.holdingAssetModalRef) {
            this.remainingHoldingAssetDataLoading = false;
            this.cancelHoldingAssetsDetails(asset);
          }
          // to refresh preview screen
          // tslint:disable-next-line:max-line-length
          this.investmentByAccount[accountIndex].holdingAssets[assetIndex] = res.data;
        } else {
          asset.investmentDataLoading = false;
          // tslint:disable-next-line:max-line-length
          document.getElementById('assetError_' + accountIndex + '_' + assetIndex).innerHTML = res[CommonConstant.MESSAGE];
        }
      },
      error => {
        asset.investmentDataLoading = false;
        // tslint:disable-next-line:max-line-length
        document.getElementById('assetError_' + accountIndex + '_' + assetIndex).innerHTML = 'Something went wrong..Please try again';
      }
    )
  }

  /**
   * To close editable mode of asset by account
   */
  cancelAssetByAccount(accountIndex: number, assetIndex: number, asset: any) {
    asset.editAccountAsset = false;
    asset.investmentDataLoading = false;
    // tslint:disable-next-line:max-line-length
    document.getElementById('assetError_' + accountIndex + '_' + assetIndex).innerHTML = '';
  }

  /**
   * To inline edit for asset
   */
  editAssetByAccountAsset(i: number, asset: any) {
    this.investments.forEach(element => {
      element.investmentHoldingAssetData.forEach(assetVal => {
        assetVal.investmentHoldingAssetByCategoryData.forEach(assetCat => {
          assetCat.editAsset = false;
        });
      });
    });

    asset.editAsset = true;
  }

  /**
   * To inline edit holding assets by account arrangement
   * @param any accountIndex
   * @param ant categoryIndex
   * @param ant assetIndex
   * @param asset
   */
  saveAssetsByAccountAssetCategory(accountIndex: number, categoryIndex: number, assetIndex: number, asset: any) {

    document.getElementById('assetError_' + accountIndex + '_' + categoryIndex + '_' + assetIndex).innerHTML = '';
    asset = this.commonHelperService.sanitizeDataObject(asset);
    if (this.holdingAssetByCategoryModalRef) {
      this.remainingHoldingAssetDataLoading = true;
    }
    asset.investmentDataLoading = true;
    let updatedHoldingAssetDetails: Object = {}
    updatedHoldingAssetDetails[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    updatedHoldingAssetDetails[CommonConstant.FLOW] = 'pimoney';

    const investmentAccountDetails: Object = {};
    investmentAccountDetails[CommonConstant.PLAIN_ID] = asset.id;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_CATEGORY] = asset.holdingAssetCategory;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_COUPON] = asset.holdingAssetCoupon;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_QUANTITY] = asset.holdingAssetQuantity;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_CURRENT_VALUE] = asset.holdingAssetCurrentValue;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_AVERAGE_UNIT_COST] = asset.holdingAssetAverageUnitCost;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_INDICATIVE_PRICE] = asset.holdingAssetIndicativePrice;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_MATURITY_DATE] = asset.holdingAssetMaturityDate;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_LASF_FX_RATE] = asset.holdingAssetLastFxRate;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_FX_ACCURED_INTEREST] = asset.holdingAssetFxAccruedInterest;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_FX_MARKET_VALUE] = asset.holdingAssetFxMarketValue;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_UNREALIZED_PL] = asset.holdingAssetUnrealizedProfitLoss;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_INDICATIVE_PRICE_DATE] = asset.holdingAssetIndicativePriceDate;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_STRIKE_PRICE] = asset.holdingAssetStrikePrice;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_ISIN] = asset.holdingAssetISIN;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_START_DATE] = asset.holdingAssetStartDate;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_SUBCATEGORY] = asset.holdingAssetSubCategory;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_COST] = asset.holdingAssetCost;

    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_ACCOUNT_NUMBER] = asset.holdingAssetAccountNumber;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_SUB_ACCOUNT_NUMBER] = asset.holdingAssetSubAccountNumber;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_YIELD] = asset.holdingAssetYield;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_ACCRUED_INTEREST] = asset.holdingAssetAccruedInterest;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_LAST_FX_RATE] = asset.holdingAssetLastFxRate;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_UNREALIZED_PROFITLOSS_CURRENCY] = asset.holdingAssetUnrealizedProfitLossCurrency;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_TRANS_CODE] = asset.transCode;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_COMMISSION] = asset.commission;
    investmentAccountDetails[PreviewConstant.HOLDING_ASSET_OTHER_FEES] = asset.otherFees;

    updatedHoldingAssetDetails[PreviewConstant.ASSET_FIELDS] = investmentAccountDetails;
    updatedHoldingAssetDetails = JSON.stringify(updatedHoldingAssetDetails);

    this.previewService.updateInvestmentsData(updatedHoldingAssetDetails).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          // hiding loader and editable fields
          asset.investmentDataLoading = false;
          asset.editAsset = false;

          if (this.holdingAssetByCategoryModalRef) {
            this.remainingHoldingAssetDataLoading = false;
            this.cancelHoldingAssetsByCategoryDetails(asset);
          }
          // to refresh preview screen
          // tslint:disable-next-line:max-line-length
          this.investments[accountIndex].investmentHoldingAssetData[categoryIndex].investmentHoldingAssetByCategoryData[assetIndex] = res.data;
        } else {
          asset.investmentDataLoading = false;
          // tslint:disable-next-line:max-line-length
          document.getElementById('assetError_' + accountIndex + '_' + categoryIndex + '_' + assetIndex).innerHTML = res[CommonConstant.MESSAGE];
        }
      },
      error => {
        asset.investmentDataLoading = false;
        // tslint:disable-next-line:max-line-length
        document.getElementById('assetError_' + accountIndex + '_' + categoryIndex + '_' + assetIndex).innerHTML = 'Something went wrong..Please try again';
      }
    )
  }

  /**
   * To cancel inline edit
   * @param any accountIndex
   * @param ant categoryIndex
   * @param ant assetIndex
   * @param asset
   */
  cancelAssets(accountIndex: number, categoryIndex: number, assetIndex: number, asset: any) {
    asset.editAsset = false;
    asset.investmentDataLoading = false;
    // tslint:disable-next-line:max-line-length
    document.getElementById('assetError_' + accountIndex + '_' + categoryIndex + '_' + assetIndex).innerHTML = '';
  }

  /**
   * To edit remaining fields that are not in the main table
   * @param number investmentIndex
   * @param number categoryIndex
   * @param number assetIndex
   * @param any asset
   */
  showRemainingHoldingAssetFieldsByCategory(investmentIndex: number, categoryIndex: number, assetIndex: number, asset: any) {

    this.remaingHoldingAssets = {};
    // tslint:disable-next-line:max-line-length
    this.remaingHoldingAssets = this.investments[investmentIndex].investmentHoldingAssetData[categoryIndex].investmentHoldingAssetByCategoryData[assetIndex];
    // set index
    this.remaingHoldingAssets['investmentIndex'] = investmentIndex;
    this.remaingHoldingAssets['categoryIndex'] = categoryIndex;
    this.remaingHoldingAssets['assetIndex'] = assetIndex;
    this.openRemainingAssetModalByCategory(this.holdingAssetByCategoryModal);
  }

  /**
   * To open password input modal
   * @param TemplateRef template
   */
  openRemainingAssetModalByCategory(template: TemplateRef<any>) {
    this.holdingAssetByCategoryModalRef =
      this.modalService.show(template, Object.assign({}, this.modalConfig.config, { class: 'modal-md' }));
  }

  /**
   * To cancel holding asset by category edit
   * @param any asset
   */
  cancelHoldingAssetsByCategoryDetails(asset: any) {
    if (this.holdingAssetByCategoryModalRef) {
      this.holdingAssetByCategoryModalRef.hide();
      this.holdingAssetByCategoryModalRef = null;
    }
    asset.investmentDataLoading = false;
  }

  /**
   * To edit remaining fields that are not in the main table
   * @param number investmentIndex
   * @param number assetIndex
   * @param any asset
   */
  showRemainingHoldingAssetFields(investmentIndex: number, assetIndex: number, asset: any) {

    this.remaingHoldingAssets = {};
    // tslint:disable-next-line:max-line-length
    this.remaingHoldingAssets = this.investmentByAccount[investmentIndex].holdingAssets[assetIndex];
    // set index
    this.remaingHoldingAssets['investmentIndex'] = investmentIndex;
    this.remaingHoldingAssets['assetIndex'] = assetIndex;
    this.openRemainingAssetModal(this.holdingAssetModal);
  }

  /**
   * To open password input modal
   * @param TemplateRef template
   */
  openRemainingAssetModal(template: TemplateRef<any>) {
    this.holdingAssetModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, { class: 'modal-md' }));
  }

  /**
   * To cancel holding asset modal
   * @param any asset
   */
  cancelHoldingAssetsDetails(asset: any) {
    if (this.holdingAssetModalRef) {
      this.holdingAssetModalRef.hide();
      this.holdingAssetModalRef = null;
    }
    asset.investmentDataLoading = false;
  }

  /**
   * To make editable transaction row
   * @param number i
   * @param any txn
   */
  editTxn(i: number, txn: any) {
    this.investmentTransactions.forEach(element => {
      element.editTxn = false;
    });
    txn.editTxn = true;
  }

  /**
   * To save updated transaction
   * @param number index
   * @param any transaction
   */
  saveTxn(index: number, transaction: any) {
    document.getElementById('txnError_' + index).innerHTML = '';
    transaction = this.commonHelperService.sanitizeDataObject(transaction);
    transaction.txnDataLoading = true;

    let updatedTxnDetails = {};
    updatedTxnDetails[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    updatedTxnDetails[CommonConstant.FLOW] = 'pimoney';
    updatedTxnDetails[CommonConstant.TAG] = transaction[CommonConstant.TAG];

    const investmentTxnDetails = {}
    investmentTxnDetails[CommonConstant.PLAIN_ID] = transaction.id;
    // convert all dates to milliseconds
    investmentTxnDetails[PreviewConstant.TRANSACTION_DATE] = transaction.transactionDate;
    investmentTxnDetails[PreviewConstant.ASSET_CATEGORY] = transaction.assetCategory;
    investmentTxnDetails[PreviewConstant.ASSET_QUANTITY] = transaction.assetQuantity;
    investmentTxnDetails[PreviewConstant.ASSET_UNIT_COST] = transaction.assetUnitCost;
    investmentTxnDetails[CommonConstant.CURRENCY] = transaction.currency;
    investmentTxnDetails[CommonConstant.AMOUNT] = transaction.amount;

    updatedTxnDetails[PreviewConstant.TRANSACTION_FIELDS] = investmentTxnDetails;
    updatedTxnDetails = JSON.stringify(updatedTxnDetails);

    // calling edit investment transaction service
    this.previewService.updateInvestmentsData(updatedTxnDetails).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          // hiding loader and editable fields
          transaction.txnDataLoading = false;
          transaction.editTxn = false;
          // refresh preview screen
          this.investmentTransactions[index] = res.data;
        } else {
          // hiding loader and editable fields
          transaction.txnDataLoading = false;
          document.getElementById('txnError_' + index).innerHTML = res[CommonConstant.MESSAGE];
        }
      },
      error => {
        transaction.txnDataLoading = false;
        document.getElementById('txnError_' + index).innerHTML = 'Something went wrong..Please try again';
      }
    )
  }

  /**
   * To cancel updated transaction and hide editable row
   * @param number index
   * @param any transaction
   */
  cancelTxn(index: number, transaction: any) {
    transaction.editTxn = false;
    transaction.txnDataLoading = false;
    document.getElementById('txnError_' + index).innerHTML = '';
  }

  /**
   * To open delete AssetTxn modal
   * @param TemplateRef template
   */
  openDeleteAssetTxnModal(template: TemplateRef<any>) {
    // tslint:disable-next-line:max-line-length
    this.deleteAssetTxnModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, { class: 'modal-md deleteTransconfModal' }));
  }

  /**
   * To close asset delete transaction modal
   */
  cancelDeleteAssetTxnDetails() {
    if (this.deleteAssetTxnModalRef) {
      this.deleteAssetTxnModalRef.hide();
      this.deleteAssetTxnModalRef = null;
    }
    this.delAssetTxnDataLoading = false;
  }

  /**
   * To set transaction object to transactionObj
   * @param any transaction
   */
  prepareAssetTxnDelete(transaction: any) {
    if (transaction) {
      this.transactionObj = transaction;
      this.openDeleteAssetTxnModal(this.deleteAssetTxnModal);
    }
  }

  /**
   * To delete holding asset transactions
   */
  deleteAssetTxn() {
    if (Object.keys(this.transactionObj).length > 0) {
      this.delAssetTxnDataLoading = true;
      const txnId = this.transactionObj.id;
      this.investmentService.deletHoldingAssetTransaction(txnId).subscribe(
        res => {
          this.delAssetTxnDataLoading = false;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            this.getInvestmentTransactions();
            this.cancelDeleteAssetTxnDetails();
          } else {
            document.getElementById('delAsserTxnError').innerHTML = res[CommonConstant.MESSAGE];
          }
        },
        error => {
          document.getElementById('delAsserTxnError').innerHTML = 'Something went wrong..Please try again';
        }
      )
    }
  }

  /**
   * Analytics tab implenetation
   */
  loadAnatyticsData() {
    // this.analyticsData = analyticsData;
    // this.drawWorldMapChart();
    // this.analyticsData1 = analyticsData1;
    // this.analyticsData1 = analyticsDataUbs;
  }

  /**
   * To draw world map chart
   */
  drawWorldMapChart() {
    // ,[[-427,1787,-372,1788]]
    const currencySymbol = this.commonHelperService.getCurrencySymbol(this.investmentCurrency);
    const config = {
      'data0': 'holdingAssetCurrency', 'data1': 'convertedValue',
      'label0': 'label 0', 'label1': 'label 1', 'color0': '#99ccff', 'color1': '#0050A1',
      'width': 1120, 'height': 900
    };

    const width = config.width,
      height = config.height;
    const svg = d3.select('#canvas-svg')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const projection = d3.geoMercator()
      .scale((width + 1) / 2 / Math.PI)
      .translate([width / 2, height / 2])
      .precision(.1);

    const path: any = d3.geoPath()
      .projection(projection);

    const graticule = d3.geoGraticule();
    const MAP_KEY = config.data0;
    const MAP_VALUE = config.data1;

    function valueFormat(d) {
      return d.toFixed(2).replace(/./g, function (c, i, a) {
        return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
      });
    }

    const valueHash = {};
    const dataList = this.worldMapData;
    dataList.forEach((d) => {
      // d[MAP_VALUE] = d[MAP_VALUE].replace(/,/g, '');
      const corrsCountry = this.commonHelperService.getCountryCode(d[MAP_KEY]);
      // valueHash[d[MAP_KEY]] = +d[MAP_VALUE];
      if (corrsCountry) {
        if (valueHash[corrsCountry]) {
          valueHash[corrsCountry] += +d[MAP_VALUE];
        } else {
          valueHash[corrsCountry] = +d[MAP_VALUE];
        }
      }
    });
    let revenueSum = 0;
    for (const key in valueHash) {
      if (valueHash.hasOwnProperty(key)) {
        const element = valueHash[key];
        revenueSum = revenueSum + parseFloat(element);
      }
    }

    function calculatePercentage(val, factor: number) {
      if (val) {
        factor = 200;
        val = Math.sqrt(val);
        return Math.round(factor * (val * 100) / revenueSum);
      }
      return 0;
    }


    // graph dra
    d3.json('/assets/json_files/world_by_iso_topo-e3d32348133833e5e7fea4b128ef5f92.json').then((world: any) => {
      const countries = topojson.feature(world, world.objects.worldByIso).features;

      svg.selectAll('.country')
        .data(countries)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', path)
        .on('mouseover', function (d: any) {
          d3.select(this).classed('selected', true);

          let html = '';

          html += '<div class="tooltip_kv">';
          html += '<span class="tooltip_key">';
          html += d.properties.name;
          html += '</span><br />';
          html += '<span class="tooltip_value">';
          html += 'Total Current Value : ' + currencySymbol + ' ' + (valueHash[d.id] ? valueFormat(valueHash[d.id]) : '0');
          html += '';
          html += '</span>';
          html += '</div>';

          $('#tooltip-container').html(html);
          $(this).attr('fill-opacity', '0.8');
          $('#tooltip-container').show();

          // const coordinates = d3.mouse(this);
          const coordinates = d3.mouse.bind(this);
          const map_width = $('.country')[0].getBoundingClientRect().width;

          if (d3.event.pageX < map_width / 2) {
            d3.select('#tooltip-container')
              .style('top', (d3.event.layerY + 15) + 'px')
              .style('left', (d3.event.layerX + 15) + 'px');
          } else {
            const tooltip_width = $('#tooltip-container').width();
            d3.select('#tooltip-container')
              .style('top', (d3.event.layerY + 15) + 'px')
              .style('left', (d3.event.layerX - tooltip_width - 30) + 'px');
          }
        })
        .on('mouseout', function (d) {
          d3.select(this).classed('selected', false);

          $(this).attr('fill-opacity', '1.0');
          $('#tooltip-container').hide();
        });

      // State label
      /* svg.append('text')
        .attr('class', 'state-label')
        .attr('x', width * 0.35)
        .attr('y', height * 0.4)
        .text('Louisiana'); */

      svg.selectAll('.revenue-circle')
        .data(countries)
        .enter().append('circle')
        .attr('class', 'revenue-circle')
        .each(function (d: any) {
          if (valueHash.hasOwnProperty(d.id)) {
            d3.select(this)
              // .attr('r', (valueHash[d.properties.name] ? parseFloat(valueHash[d.properties.name]) : 0) * scalefactor)
              .attr('r', calculatePercentage(valueHash[d.id] ? parseFloat(valueHash[d.id]) : 0, 10))
              .attr('transform', function (d1: any) {
                const centroid = path.centroid(d1);
                if (d1.id === 'USA') {
                  centroid[0] = centroid[0] + 40;
                  centroid[1] = centroid[1] + 40;
                }
                return 'translate(' + centroid + ')';
              })
              .attr('fill', 'red')
              .attr('stroke', 'black')
              .attr('stroke-width', 2);
          }
        })
        .on('mouseover', function (d: any) {
          d3.select(this).style('fill', '#FC0');

          d3.select(this).classed('selected', true).transition().duration(200)
            .attr('r', calculatePercentage(valueHash[d.id] ? parseFloat(valueHash[d.id]) : 0, 10.5));

          let html = '';

          html += '<div class="tooltip_kv">';
          html += '<span class="tooltip_key">';
          html += d.properties.name;
          html += '</span><br />';
          html += '<span class="tooltip_value">';
          html += 'Total Current Value : ' + currencySymbol + ' ' + (valueHash[d.id] ? valueFormat(valueHash[d.id]) : '');
          html += '';
          html += '</span>';
          html += '</div>';

          $('#tooltip-container').html(html);
          $(this).attr('fill-opacity', '0.8');
          $('#tooltip-container').show();

          // const coordinates = d3.mouse(this);
          const coordinates = d3.mouse.bind(this);
          const map_width = $('.country')[0].getBoundingClientRect().width;

          if (d3.event.pageX < map_width / 2) {
            d3.select('#tooltip-container')
              .style('top', (d3.event.layerY + 15) + 'px')
              .style('left', (d3.event.layerX + 15) + 'px');
          } else {
            const tooltip_width = $('#tooltip-container').width();
            d3.select('#tooltip-container')
              .style('top', (d3.event.layerY + 15) + 'px')
              .style('left', (d3.event.layerX - tooltip_width - 30) + 'px');
          }
        })
        .on('mouseout', function (d: any) {
          d3.select(this).style('fill', 'steelblue');

          d3.select(this).classed('selected', false).transition().duration(200)
            .attr('r', calculatePercentage(valueHash[d.id] ? parseFloat(valueHash[d.id]) : 0, 10));

          $(this).attr('fill-opacity', '1.0');
          $('#tooltip-container').hide();
        })
        .on('click', (d: any) => {
          // console.log(d);
        })

        // legends
      const legend_cont = d3.select('#graphContainer')
        .append('div')
        .attr('class', 'legendContainer');

      // create unordered list
      const legend = d3.select('.legendContainer')
        .append('ul')
        .attr('class', 'legend');

        // currency symbol

      // add list item for every category
      const legend_items = legend.selectAll('li')
        .data(countries)
        .enter()
        .append('li')
        .html((d: any, i) => {
          if (valueHash.hasOwnProperty(d.id)) {
            return '<span>' + d.properties.name + '</span>&nbsp;&nbsp;<span style="float: right">' +
              this.commonHelperService.getCurrencySymbol(this.investmentCurrency) + ' ' + valueFormat(valueHash[d.id]) + '</span>';
          } else {
            return null;
          }
        });
    },
      error => {
        console.log(error);
      });
  }

  /**
   * To calculate percentag
   * @param any val
   * @param any sum
   */
  calculatePercentage(val: any, sum: any) {
    if (val) {
      const percent = (val * 100) / sum;
      // percent = percent.toFixed(2);
      return percent.toFixed(2);
    }
    return 0;
  }

  /**
   * Asset allocation Pi Chart
   */
  onPortfolioGraphTypeChange(): void {
    let category = '', value = '';
    const type = this.portfolioGraphType;
    switch (type) {
      case 'assetClass':
        category = 'holdingAssetCategory';
        value = 'convertedValue';
        break;
      case 'custodian':
        category = 'institutionName';
        value = 'convertedValue';
        break;
      case 'currency':
        category = 'holdingAssetCurrency';
        value = 'convertedValue';
        break;
      default:
        category = 'holdingAssetCategory';
        value = 'convertedValue';
        break;
    }
    setTimeout(() => {
      this.drawGraphCategoryWisePiChart(category, value);
    });
  }

  /**
   * To draw pichart for asset allocation
   * @param string category
   * @param any value
   */
  drawGraphCategoryWisePiChart(category: string, value: any): void {
    // const currencySymbol = this.commonHelperService.getCurrencySymbol(this.investmentCurrency);
    const currencySymbol = this.investmentCurrency;
    // prepare data from investment data
    const data = {};
    const sites: any[] = [];
    this.holdingsData.forEach(element => {
      if (sites.indexOf(element[category]) === -1) {
        sites.push(element[category]);
      }
      if (data[element[category]]) {
        data[element[category]] += +element[value];
      } else {
        data[element[category]] = +element[value];
      }
    });

    const total = sites.length;
    const chart = c3.generate({
      bindto: '#allocation-pichart',
      size: {
        width: 500
      },
      data: {
        type: 'donut',
        json: [data],
        keys: {
            value: sites,
        },
      },
      color: {
        pattern: this.chartConfig.poolColors(total)
      },
      legend: {
        show: false
      }
    });

    // custom legend
    function toggle(id) {
      chart.toggle(id);
    }

    function valueFormat(d) {
      return d.toFixed(2).replace(/./g, function (c, i, a) {
        return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
      });
    }

    $('.allocation-pichart-legend-container').show();
    d3.select('.allocation-pichart-legend-container').html('');

    d3.select('.allocation-pichart-legend-container').insert('div', '.chart').attr('class', 'legend').selectAll('span')
      .data(sites)
      .enter().append('span')
      .attr('class', 'main-item')
      .attr('data-id', function (id) { return id; })
      .html((id) => `<span>${id}</span><br /><span>${currencySymbol}</span>&nbsp;&nbsp;<span>${valueFormat(data[id])}</span>`)
      .each(function (id) {
        // d3.select(this).style('background-color', chart.color(id));
        d3.select(this).style('border-left', `2px solid ${chart.color(id)}`);
      })
      .on('mouseover', function (id) {
        chart.focus(id);
      })
      .on('mouseout', function (id) {
        chart.revert();
      })
      .on('click', function (id) {
        $(this).toggleClass('c3-legend-item-hidden');
        chart.toggle(id);
      });
  }

  /**
   * To change graph type for analytics
   */
  onChangeGraphType(): void {
    const type = this.allocationGraphType;
    switch (type) {
      case 'assetAllocation':
        this.onPortfolioGraphTypeChange();
        break;
      case 'allocationMatrix':
        this.onAllocationMatrixSelctionChange();
        break;
      default:
        break;
    }
  }

  /**
   * To draw allocation matrix chart
   * @param string cat
   */
  getCategory(cat: string): string {
    let category = '';
    const type = cat;
    switch (type) {
      case 'assetClass':
        category = 'holdingAssetCategory';
        break;
      case 'custodian':
        category = 'institutionName';
        break;
      case 'currency':
        category = 'holdingAssetCurrency';
        break;
      default:
        category = 'holdingAssetCategory';
        break;
    }
    return category;
  }

  /**
   * On allocation matrix selection change
   */
  onAllocationMatrixSelctionChange(): void {
    const selectionOne = this.getCategory(this.allocationMatrixCategoryGroupOne);
    const selectionTwo = this.getCategory(this.allocationMatrixCategoryGroupTwo);
    // console.log('Vertical Axis : ' + selectionOne, 'Horizontal Axis : ' + selectionTwo);
    this.loaderService.show();
    setTimeout(() => {
      this.drawAllocationMatrixChart(selectionOne, selectionTwo);
    });
  }

  /**
   * To draw allocation matrix chart
   * @param any selectionOne
   * @param any selectionTwo
   * @param any valueToCalculate
   */
  drawAllocationMatrixChart(selectionOne: any, selectionTwo: any, valueToCalculate?: any): void {
    const numberAbbr = (val) => this.commonHelperService.abbreviateNumber(val);
    if (!valueToCalculate) {
      valueToCalculate = 'convertedValue';
    }

    const orgDataList: any[] = [];
    // copy object without reference of object in the list
    this.holdingsData.forEach(element => {
      const ele = Object.assign({}, element);
      orgDataList.push(ele);
    });

    // get category list
    let categoryList: any[] = [];
    const categoryWiseData: any[] = [];
    let dataObj: any = [];
    categoryList = this.commonHelperService.removeDuplicates(orgDataList, selectionTwo);
    categoryList = categoryList.map((ele) => ele[selectionTwo]);

    // get category list data
    let accValue = 0;
    for (let i = 0; i < categoryList.length; i++) {
      const element = categoryList[i];
      const categoryListData = orgDataList.filter((cat) => cat[selectionTwo] === element);
      // to sum category value
      let categoryTotalSum = 0;
      if (categoryListData.length === 1) {
        categoryTotalSum = +categoryListData[0][valueToCalculate];
      } else {
        categoryTotalSum = categoryListData.reduce((acc, currValue) => {
          if (acc[valueToCalculate]) {
            accValue = +acc[valueToCalculate];
          } else {
            accValue = +acc;
          }
          return accValue + (+currValue[valueToCalculate]);
        });
      }

      for (let j = 0; j < categoryListData.length; j++) {
        const currencyObj = categoryListData[j];
        dataObj = {};
        dataObj[selectionTwo] = element;
        dataObj['categorySum'] = categoryTotalSum;
        const duplicateIndex = this.commonHelperService
            .checkForDuplicateFieldsValue(currencyObj, categoryWiseData, selectionTwo, selectionOne);
        if (duplicateIndex === 0 || duplicateIndex > 0) {
          categoryWiseData[duplicateIndex]['currSum'] += +currencyObj[valueToCalculate];
        } else {
          dataObj['currSum'] = +currencyObj[valueToCalculate];
          dataObj[selectionOne] = currencyObj[selectionOne];
          categoryWiseData.push(dataObj);
        }

      }
    }
    const selectionOneValueHash = {};
    categoryWiseData.forEach((d) => {
      // d[MAP_VALUE] = d[MAP_VALUE].replace(/,/g, '');
      const corrsCountry = d[selectionOne];
      // selectionOneValueHash[d[MAP_KEY]] = +d[MAP_VALUE];
      if (corrsCountry) {
        if (selectionOneValueHash[corrsCountry]) {
          selectionOneValueHash[corrsCountry] += +d['currSum'];
        } else {
          selectionOneValueHash[corrsCountry] = +d['currSum'];
        }
      }
    });

    const getCategoryValue = (val) => {
      const list = categoryWiseData.filter((element) => {
        return element[selectionTwo] === val;
      })
      if (list.length > 0) {
        return numberAbbr(list[0]['categorySum']);
      }
      return '';
    };

    const getCurrencyValue = (val) => {
      return numberAbbr(selectionOneValueHash[val]);
    };
    // to calculate dynamic height
    const calculateDynamicHeight = (): number => {
      let height = 550;
      const objLength = Object.keys(selectionOneValueHash).length;
      if (objLength > 5) {
        const remainingKeys = objLength - 5;
        height = height + 80 * remainingKeys;
      }
      return height;
    };

    const xDomain = categoryWiseData.reduce(function (p, c) {
      if (p.indexOf(c[selectionTwo]) < 0) { p.push(c[selectionTwo]) };
      return p;
    }, []);

    const yDomain = categoryWiseData.reduce(function (p, c) {
      if (p.indexOf(c[selectionOne]) < 0) { p.push(c[selectionOne]) };
      return p;
    }, []);

    const width = 1200,
      // height = 80 * yDomain.length,
      height = calculateDynamicHeight(),
      extraContainerHeight = 60,
      margin = { top: 150, right: 20, bottom: 20, left: 225 },
      size = {
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom,
        margin: margin
      };

    const xScale: any = d3.scalePoint()
      // .rangePoints([0, size.width], 1)
      .rangeRound([0, size.width])
      .domain(xDomain)
      .padding(0.6)

    const yScale: any = d3.scalePoint()
      .rangeRound([0, size.height])
      .domain(yDomain)
      .padding(0.9)

    const xAxis = d3.axisTop(xScale)
      .scale(xScale)
      .tickPadding(15)
      .tickSize(-(size.height)) // -(size.height + 6) // to increase line length
      .tickFormat(function(d) {
        return d + ` (${getCategoryValue(d)})`;
      });

    const yAxis = d3.axisLeft(yScale)
      .scale(yScale)
      .tickPadding(15)
      .tickSize(-(size.width)) // -(size.height + 6) // to increase line length
      .tickFormat(function(d) {
        return d + ` (${getCurrencyValue(d)})`;
      });

    // d3.select('#allocation-pichart > *').remove();
    d3.select('#allocation-pichart').html('');
    d3.select('.allocation-pichart-legend-container').html('');
    $('.allocation-pichart-legend-container').hide();

    setTimeout(() => {
      this.loaderService.hide(); // hiding loader
      // adding dynamic width to the graph container
      document.getElementById('allocation-pichart').style.maxHeight = calculateDynamicHeight() + extraContainerHeight + 'px';

      const chart = d3.select('#allocation-pichart').append('svg') // .chart
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + size.margin.left + ',' + (size.margin.top) / 2 + ')');

      const x = chart.append('g')
        .call(xAxis)
        .selectAll('.tick text')
        .call(wrapXAxis, xScale.bandwidth());

      x.selectAll('path')
        .style('fill', 'none')
        .style('stroke', '#000')
        .style('shape-rendering', 'crispEdges')

      x.selectAll('line')
        .attr('transform', 'translate(0,-6)')
        .style('fill', 'none')
        .style('stroke', '#000')
        .style('shape-rendering', 'crispEdges')
        .style('opacity', 0.2);

      x.selectAll('text')
        .style('font', '10px sans-serif')
        .style('text-anchor', 'start')
        .attr('dx', '1em')
        .attr('dy', '0.5em')
        .attr('transform', 'rotate(-35)')

      const y = chart.append('g')
        .call(yAxis)
        .selectAll('.tick text')
        .call(wrapYAxis, yScale.bandwidth()
        );

      y.selectAll('path')
        .style('fill', 'none')
        .style('stroke', '#000')
        .style('shape-rendering', 'crispEdges');

      y.selectAll('line')
        .attr('transform', 'translate(-6,0)')
        .style('fill', 'none')
        .style('stroke', '#000')
        .style('shape-rendering', 'crispEdges')
        .style('opacity', 0.2);

      y.selectAll('text')
        .style('font', '10px sans-serif')
        .style('text-anchor', 'end')
        .attr('dx', '-1em')
        .attr('dy', '0.9em');

      const bubble = chart.append('g')
        .selectAll('g')
        .data(categoryWiseData)
        .enter().append('g')
        .attr('transform', function (d: any) {
          return 'translate(' + xScale(d[selectionTwo]) + ',' + yScale(d[selectionOne]) + ')';
        });

      bubble.append('circle')
        .attr('r', function (d) {
          if (!d.currSum) {
            return 0; // to hide circle // 1 * 2
          }
          return Math.log(d.currSum) * 2;
        })
        // .attr('r', 4)
        .style('fill', '#337ab7');

      bubble.append('text')
        .attr('dx', function (d) { return -10 })
        .attr('dy', function (d) { return 5 })
        .text(function (d) {
          if (d.currSum) {
            return numberAbbr(d.currSum)
          }
        });

      // to wrap text
      // tslint:disable-next-line:no-shadowed-variable
      function wrapXAxis(text, width) {
        text.each(function () {
          // tslint:disable-next-line:no-shadowed-variable
          const text = d3.select(this);
          const words = text.text().split(/\s(?=[^\s]+$)/).reverse(); // // for white space /\s+/
          let word, line = [], lineNumber = 0;
          // tslint:disable-next-line:no-shadowed-variable
          const y = text.attr('y'), dy = parseFloat(text.attr('dy')), lineHeight = 0.7 // ems;
          while (word = words.pop()) {
            if (word) {
              let tspan: any = text.text(null).append('tspan').attr('x', 0).attr('y', '-25').attr('dy', dy + 'em');
              line.push(word);
              tspan.text(line.join(' '));
              if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(' '));
                line = [word];
                tspan = text.append('tspan').attr('x', 0).attr('y', '-25').attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
              }
            }
          }
        });
      }

      // tslint:disable-next-line:no-shadowed-variable
      function wrapYAxis(text, width) {
        text.each(function () {
          // tslint:disable-next-line:no-shadowed-variable
          const text = d3.select(this);
          const words = text.text().split(/\s(?=[^\s]+$)/).reverse(); // // for white space /\s+/
          let word, line = [], lineNumber = 0;
          // tslint:disable-next-line:no-shadowed-variable
          const y = text.attr('y'), dy = parseFloat(text.attr('dy')), lineHeight = 0.4 // ems;
          while (word = words.pop()) {
            if (word) {
              let tspan: any = text.text(null).append('tspan').attr('x', '-7').attr('y', y).attr('dy', dy + 'em');
              line.push(word);
              tspan.text(line.join(' '));
              if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(' '));
                line = [word];
                tspan = text.append('tspan').attr('x', '-7').attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
              }
            }
          }
        });
      }
    }, 200);
  }

  /**
   * Pivot table integration
   */
  loadPivotTable() {
    const dateFormat = $.pivotUtilities.derivers.dateFormat;
    const sortAs = $.pivotUtilities.sortAs;
    const tpl = $.pivotUtilities.aggregatorTemplates;
    const fmt = $.pivotUtilities.numberFormat({ suffix: ' °C' });

    parse('/assets/csv_files/monthreal_2014.csv', {
      download: true,
      skipEmptyLines: true,
      complete: function (parsed) {
        setTimeout(() => {
          $('#output').pivotUI(parsed.data, {
            hiddenAttributes: ['Date', 'Max Temp (C)', 'Mean Temp (C)',
              'Min Temp (C)', 'Total Rain (mm)', 'Total Snow (cm)'],

            derivedAttributes: {
              'month name': dateFormat('Date', '%n', true),
              'day name': dateFormat('Date', '%w', true)
            },

            rows: ['day name'],
            cols: ['month name'],

            sorters: {
              'month name': sortAs(['Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']),
              'day name': sortAs(['Mon', 'Tue', 'Wed', 'Thu', 'Fri',
                'Sat', 'Sun'])
            },

            aggregators: {
              'Mean Temperature':
                function () { return tpl.average(fmt)(['Mean Temp (C)']) },
              'Max Temperature':
                function () { return tpl.max(fmt)(['Max Temp (C)']) },
              'Min Temperature':
                function () { return tpl.min(fmt)(['Min Temp (C)']) }
            },

            renderers: $.extend(
              $.pivotUtilities.renderers,
              $.pivotUtilities.c3_renderers,
              $.pivotUtilities.export_renderers
            ),

            rendererName: 'Heatmap',

            rendererOptions: {
              heatmap: {
                colorScaleGenerator: function (values) {
                  return d3.scaleLinear<string, number>()
                    .domain([-35, 0, 35])
                    .range(['#77F', '#FFF', '#F77'])
                }
              }
            }
          });
        }, 300);
      }
    });
  }

  /**
   * On date format change for analytics
   */
  onDataFormatTypeChange() {
    if (this.anlyticsInputDataType === 'holdings') {
      document.getElementById('fileUploaderFunctionality').style.display = 'none';
      this.analyticsData1 = this.holdingsData;
    } else if (this.anlyticsInputDataType === 'transactions') {
      document.getElementById('fileUploaderFunctionality').style.display = 'none';
      this.analyticsData1 = this.investmentTransactions;
    } else if (this.anlyticsInputDataType === 'local') {
      document.getElementById('fileUploaderFunctionality').style.display = 'block';
      this.analyticsData1 = [];
      this.loadCustomPivotTable1();
    }
    // hiding and showing pivot table based on choice
    if (this.analyticsData1.length > 0) {
      document.getElementById('output').style.display = 'block';
      this.loadCustomPivotTable();
    } else {
      if (this.anlyticsInputDataType !== 'local') {
        document.getElementById('output').innerHTML = 'There are no data to draw table';
      } else {
        document.getElementById('output').innerHTML = '';
      }
    }
  }

  /**
   * To get render option
   */
  getRenderOptions(): Object {
    const renderOption = {
      c3: {
        size: { width: 720 }
      }
    };
    return renderOption;
  }

  /**
   * To load pvt table
   */
  loadCustomPivotTable() {
    const renderers = $.extend(
      $.pivotUtilities.renderers,
      $.pivotUtilities.c3_renderers,
      $.pivotUtilities.d3_renderers,
      $.pivotUtilities.export_renderers
    );
    const dataList: any[] = [];
    // copy object without reference of object in the list
    this.analyticsData1.forEach(element => {
      const ele = Object.assign({}, element);
      dataList.push(ele);
    });
    // dataList = this.analyticsData1;
    // dataList = dataList['investments'];
    let i = 0;
    while (i < dataList.length) {
      const obj = dataList[i];
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const element = obj[key];
          if (typeof element === 'object') {
            delete obj[key];
          }
          if (key === 'id' || key === 'confirmed' || key === 'status') {
            delete obj[key];
          }
        }
      }
      i++;
    }
    setTimeout(() => {
      $('#output').pivotUI(dataList, {
        renderers: renderers,
        rendererOptions: this.getRenderOptions(),
        unusedAttrsVertical: true
      }, true);
    }, 300);
  }

  /**
   * for local files
   */
  loadCustomPivotTable1() {
    const renderers = $.extend(
      $.pivotUtilities.renderers,
      $.pivotUtilities.c3_renderers,
      $.pivotUtilities.d3_renderers,
      $.pivotUtilities.export_renderers
    );
    // let dataList = this.analyticsData1;
    const parseAndPivot = function (f: File) {
      if (f) {
        $('#output').html('<p align=\'center\' style=\'color:grey;\'>(processing...)</p>')
        if (f.type.indexOf('json') !== -1) {
          const fr = new FileReader();
          fr.onloadend = (e) => {
            const result: any = fr.result;
            let dataList = JSON.parse(result);
            if (dataList.hasOwnProperty('data')) {
              dataList = dataList['data'];
            }
            // dataList = dataList['investments'];
            let i = 0;
            while (i < dataList.length) {
              const obj = dataList[i];
              for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                  const element = obj[key];
                  if (typeof element === 'object') {
                    delete obj[key];
                  }
                  if (key === 'id' || key === 'confirmed' || key === 'status') {
                    delete obj[key];
                  }
                }
              }
              i++;
            }
            setTimeout(() => {
              $('#output').pivotUI(dataList, {
                renderers: renderers,
                rendererOptions: { c3: { size: { width: 720 } } },
                unusedAttrsVertical: true
              }, true);
            }, 300);
          }
          fr.readAsText(f);
        } else if (f.type.indexOf('vnd.openxmlformats')) { //  || f.type.indexOf('vnd.ms-excel')
          if (f) {
            const reader: FileReader = new FileReader();

            reader.onloadend = (e) => {

              const maxFileSize = 400000;
              const fileSize: number = f.size / 1024;
              const fileName: string = f.name;
              const fileType: string = f.type;
              const fileExtension: string = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
              // tslint:disable-next-line:max-line-length
              if (fileSize < maxFileSize) {
                const data = reader.result;
                const workbook = XLSX.read(data, {
                  type: 'binary'
                });
                workbook.SheetNames.forEach(function(sheetName) {
                  // Here is your object
                  const XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                  const json_object = JSON.stringify(XL_row_object);
                  const dataList = JSON.parse(json_object);
                  setTimeout(() => {
                    $('#output').pivotUI(dataList, {
                      renderers: renderers,
                      rendererOptions: { c3: { size: { width: 720 } } },
                      unusedAttrsVertical: true
                    }, true);
                  }, 300);
                })
              } else {
                /* this.courseResourceButton = true;
                this.fileSizeExceeds = true; */
                // console.log('File size exceeds the maximum allowable size of 15MB');
              }
            };

            reader.onerror = function(ex) {
              console.log(ex);
            };

            reader.readAsBinaryString(f);
          }
        } else {
          parse(f, {
            skipEmptyLines: true,
            error: function (e) { alert(e) },
            complete: function (parsed) {
              $('#output').pivotUI(parsed.data, {
                renderers: renderers,
                rendererOptions: { c3: { size: { width: 720 } } },
                unusedAttrsVertical: true
              }, true);
            }
          });
       }
      }

      // clear input file value
      $('#csv').val('');
    };

    $('#csv').bind('change', function (event) {
      parseAndPivot(event.target.files[0]);
    });

    /* $('#textarea').bind('input change', function () {
      parseAndPivot($('#textarea').val());
    }); */

    /* const dragging = function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.originalEvent.dataTransfer.dropEffect = 'copy';
      $('body').removeClass('whiteborder').addClass('greyborder');
    };

    const endDrag = function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.originalEvent.dataTransfer.dropEffect = 'copy';
      $('body').removeClass('greyborder').addClass('whiteborder');
    };

    const dropped = function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      $('body').removeClass('greyborder').addClass('whiteborder');
      console.log(evt.originalEvent.dataTransfer.files[0]);
      parseAndPivot(evt.originalEvent.dataTransfer.files[0]);
    };

    $('html')
      .on('dragover', dragging)
      .on('dragend', endDrag)
      .on('dragexit', endDrag)
      .on('dragleave', endDrag)
      .on('drop', dropped); */
  }
}
