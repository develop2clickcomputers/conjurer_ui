import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../shared/common/modal.config';

import { CommonConstant } from '../constants/common/common.constant';
import { PreviewConstant } from '../constants/preview/preview.constant';

import { CommonHttpAdapterService } from '../adapters/common-http-adapter.service';
import { AccountHelper } from '../helpers/account/account.helper';
import { statementPreviewData } from './review.interface';
import { ReviewService } from './review.service';
import { CommonHelperService } from '../helpers/common/common.helper';
import { CommonService } from '../services/common/common.service';

/** Jquery integration */
declare var $: any;

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
  providers: [
    ReviewService, CommonHttpAdapterService,
    CommonHelperService, CommonService, RxJSHelper
  ]
})
export class ReviewComponent implements OnInit, OnDestroy {

  /** Holding asset modal reference */
  @ViewChild('holdingAssetModal') holdingAssetModal: TemplateRef<any>;

  bankDataLoading: boolean;
  creditcardDataLoading: boolean;

  public statementPreviewData: any = {};
  public currencyListData: any[] = [];
  private fileRepoId: string;
  public transCodeData: Array<any> = [];
  public remaingHoldingAssets: any = {};
  public categorySubCategoryLists: any[] = [];
  public merchantList: any[] = [];

  public holdingAssetModalRef: BsModalRef;
  public editTransactionObj: any = {};
  investmentDataLoading = false;
  remainingHoldingAssetDataLoading = false;
  startDate: any;

  reviewPageLoad = false;
  reviewRepoError = false;
  statementPreviewDataLoader = true;

  bankShow = false;
  cardShow = false;
  investmentShow = false;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
    disableSince: this.commonHelperService.getCurrentDate()
  };

  // for loan
  loanDataLoading = false;

  /** @ignore */
  constructor(
    private reviewService: ReviewService,
    private commonHttpAdapterService: CommonHttpAdapterService,
    private commonHelperService: CommonHelperService,
    private accountHelper: AccountHelper,
    private router: Router,
    private modalService: BsModalService,
    private modalConfig: ModalConfig,
    private commonService: CommonService,
    private _sanitizer: DomSanitizer,
    private rxjsHelper: RxJSHelper
  ) { }

  /** @ignore */
  ngOnInit() {
    // to get preview details
    this.getStatementPreviewDetails();
    this.getCurrencyList(); // to get curreny list
    this.getFileRepoId();
    this.getTransCode();
    this.getMerchantList();
    this.getCategoryWithSubcategory();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();
  }

  /** To get file repo id */
  getFileRepoId() {
    const statementData = this.accountHelper.getUploadStatementData();
    if (statementData && statementData[CommonConstant.FILE_REPO_ID]) {
      this.fileRepoId = statementData[CommonConstant.FILE_REPO_ID];
    }
  }

  /**To get statement preview details */
  getStatementPreviewDetails() {
    this.reviewService.getStatementData().subscribe(
      res => {
        this.reviewPageLoad = true;
        this.reviewRepoError = false;
        this.statementPreviewData = res;
        if (res['investments'].length === 0 && res['banks'].length === 0 && res['cards'].length === 0
        && res['loans'].length === 0 && res['fixedDeposits'].length === 0) {
          this.router.navigateByUrl('/repo/xmlfile');
        }
        this.statementPreviewDataLoader = false;
        // to check confirmed accounts
        this.toCheckConfirmAccounts(res);
        /* if (this.statementPreviewData.banks.length > 0) {
          this.bankShow = true;
        } else if (this.statementPreviewData.cards.length > 0) {
          this.cardShow = true;
        } else if (this.statementPreviewData.investments.length > 0) {
          this.investmentShow = true;
        } */
      },
      error => {
        this.reviewRepoError = true;
        this.statementPreviewDataLoader = false;
      }
    )
  }

  /** To get category and subcategory */
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

  /** To get curreny list */
  getCurrencyList() {
    this.reviewService.getCurrenyList().subscribe(
      res => {
        this.reviewPageLoad = true;
        this.currencyListData = res['currencyList'];
      },
      error => {
        console.log(error);
      }
    )
  }

  /** To gets merchants */
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

  /** Format data to show it into dropdown */
  autocompleListFormatter = (data: any) => {
    const html = `<span style='color:black'>${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * To remove comma from a number
   * @param num
   */
  removeSpecialCharacter(num) {
    if (num) {
      num = this.commonHelperService.removeSpecialCharacters(num);
      return num;
    }
    return num;
  }

  /**To get transaction code(transCode) */
  getTransCode() {
    this.reviewService.getTransCode().subscribe(
      res => {
        this.transCodeData = res['txnCodeList'];
      },
      error => {
        console.log('Something went wrong');
      }
    )
  }

  /** To check confirmed accounts */
  toCheckConfirmAccounts(res: any) {
    res.investments.forEach(element => {
      if (element.confirmed) {
        element.isInvestmentAccountSelected = true;
      }

      // to check assets
      element['assets'].forEach(asset => {
        if (asset.confirmed) {
          asset.selected = true;
        }
      });
      element.isAllInvestmentAssetsSelected = element.assets.every(asset => {
        return asset.selected;
      })
      // to check txn
      element['transactions'].forEach(txn => {
        if (txn.confirmed) {
          txn.selected = true;
        }
      });
      // to check main check box for txn
      element.isAllInvestmentTxnSelected = element.transactions.every(txn =>  {  // it will return true if all txns selected
        return txn.selected;
      })
      // to check scx
      element['scxList'].forEach(scx => {
        if (scx.confirmed) {
          scx.selected = true;
        }
      });
      element.isAllInvestmentScxSelected = element.scxList.every(scx =>  {  // it will return true if all scx selected
        return scx.selected;
      })

    });

    // for cards
    res.cards.forEach(element => {
      if (element.confirmed) {
        element.isCreditcardAccountSelected = true;
      }

      // to check txn
      element['transactions'].forEach(txn => {
        if (txn.confirmed) {
          txn.selected = true;
        }
      });

      element.isAllCreditcardTxnSelected = element.transactions.every(txn =>  {  // it will return true if all txns selected
        return txn.selected;
      })

    })

    // for banks
    res.banks.forEach(element => {
      if (element.confirmed) {
        element.isBankAccountSelected = true;
      }

      // to check txn
      element['transactions'].forEach(txn => {
        if (txn.confirmed) {
          txn.selected = true;
        }
      });

      element.isAllBankTxnSelected = element.transactions.every(txn =>  {  // it will return true if all txns selected
        return txn.selected;
      })

    })

    // for loans
    res.loans.forEach(element => {
      if (element.confirmed) {
        element.isLoanAccountSelected = true;
      }

      // to check txn
      element['transactions'].forEach(txn => {
        if (txn.confirmed) {
          txn.selected = true;
        }
      });

      element.isAllLoanTxnSelected = element.transactions.every(txn =>  {  // it will return true if all txns selected
        return txn.selected;
      })

    })
  }

  /**Inline edit for account row */   // currently not using
  investmentRow(index: number, investment: any) {
    investment.editInvest = !investment.editInvest;
  }

  /**To inline edit for asset */
  editAsset(i, asset) {
    this.statementPreviewData.investments.forEach(element => {
      element.assets.forEach(assetVal => {
        assetVal.editAsset = false;
      });
    });

    asset.editAsset = true;
  }

  /**
   * To save updated investment assets
   * @param index
   * @param asset
   */
  saveAssets(parentIndex: number, index: number, asset) {
    document.getElementById('assetError_' + parentIndex + '_' + index).innerHTML = '';

    // to remove special characters from data object coming from DOM
    asset = this.commonHelperService.sanitizeDataObject(asset);

    asset.investmentDataLoading = true;
    // to show loader
    if (this.holdingAssetModalRef) {
      this.remainingHoldingAssetDataLoading = true;
    }

    let updatedHoldingAssetDetails: Object = {}
    updatedHoldingAssetDetails[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    updatedHoldingAssetDetails[CommonConstant.FILE_REPO_ID] = this.fileRepoId;
    updatedHoldingAssetDetails[CommonConstant.FLOW] = 'gx';
    updatedHoldingAssetDetails[CommonConstant.TAG] = asset[CommonConstant.TAG];

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

    this.reviewService.updateInvestmentsData(updatedHoldingAssetDetails).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          // hiding loader and editable fields
          asset.investmentDataLoading = false;
          asset.editAsset = false;
          // to hide the modal
          if (this.holdingAssetModalRef) {
            this.remainingHoldingAssetDataLoading = false;
            this.cancelHoldingAssetsDetails(asset);
          }
          // to refresh preview screen
          this.statementPreviewData.investments[parentIndex].assets[index] = res.data;
        } else {
          asset.investmentDataLoading = false;
          document.getElementById('assetError_' + parentIndex + '_' + index).innerHTML = res[CommonConstant.MESSAGE];
        }
      },
      error => {
        asset.investmentDataLoading = false;
        document.getElementById('assetError_' + parentIndex + '_' + index).innerHTML = 'Something went wrong..Please try again';
      }
    )
  }

  /**To cancel updated investment holding assets */
  cancelAssets(parentIndex, index, asset) {
    asset.investmentDataLoading = false;
    asset.editAsset = false;
    document.getElementById('assetError_' + parentIndex + '_' + index).innerHTML = '';
  }

  /**
   * To edit remaining fields that are not in the main table
   * @param investmentIndex
   * @param assetIndex
   * @param asset
   */
  showRemainingHoldingAssetFields(investmentIndex: number, assetIndex: number, asset) {

    this.remaingHoldingAssets = {};
    // tslint:disable-next-line:max-line-length
    this.remaingHoldingAssets = this.statementPreviewData.investments[investmentIndex].assets[assetIndex];
    // set index
    this.remaingHoldingAssets['investmentIndex'] = investmentIndex;
    this.remaingHoldingAssets['assetIndex'] = assetIndex;
    this.openPasswordModal(this.holdingAssetModal);
  }

  /**
   * To open password input modal
   * @param template
   */
  openPasswordModal(template: TemplateRef<any>) {
    this.holdingAssetModalRef = this.modalService.show(template, Object.assign({}, this.modalConfig.config, {class: 'modal-md'}));
  }

  /**
   * To hide popup and cancel updated assets
   * @param asset
   */
  cancelHoldingAssetsDetails(asset) {
    this.holdingAssetModalRef.hide();
    this.holdingAssetModalRef = null;
    asset.investmentDataLoading = false;
  }

  /**To inline edit for transaction */
  editTransaction(i, transaction) {
    this.statementPreviewData.investments.forEach(element => {
      element.transactions.forEach(txn => {
        txn.editTxn = false;
      });
    });

    transaction.editTxn = true;
  }

  /**
   * To save updated investment transaction data
   * @param i
   * @param transaction
   */
  saveTransaction(parentIndex: number, index: number, transaction) {
    document.getElementById('txnError_' + parentIndex + '_' + index).innerHTML = '';
    transaction.investmentDataLoading = true;
    // to remove special charactes from data object coming from DOM
    transaction = this.commonHelperService.sanitizeDataObject(transaction);

    let updatedTxnDetails = {};
    updatedTxnDetails[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    updatedTxnDetails[CommonConstant.FILE_REPO_ID] = this.fileRepoId;
    updatedTxnDetails[CommonConstant.FLOW] = 'gx';
    updatedTxnDetails[CommonConstant.TAG] = transaction[CommonConstant.TAG];
    const investmentTxnDetails = {}
    investmentTxnDetails[CommonConstant.PLAIN_ID] = transaction.id;
    // TODO
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
    this.reviewService.updateInvestmentsData(updatedTxnDetails).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          // hiding loader and editable fields
          transaction.investmentDataLoading = false;
          transaction.editTxn = false;
          // refresh preview screen
          this.statementPreviewData.investments[parentIndex].transactions[index] = res.data;
        } else {
          // hiding loader and editable fields
          transaction.investmentDataLoading = false;
          document.getElementById('txnError_' + parentIndex + '_' + index).innerHTML = res[CommonConstant.MESSAGE];
        }
      },
      error => {
        transaction.investmentDataLoading = false;
        document.getElementById('txnError_' + parentIndex + '_' + index).innerHTML = 'Something went wrong..Please try again';
      }
    )
  }

  /**
   * To cancel investment updated transaction
   * @param index
   * @param transaction
   */
  cancelTransaction(parentIndex, index, transaction) {
    transaction.investmentDataLoading = false;
    transaction.editTxn = false;
    document.getElementById('txnError_' + parentIndex + '_' + index).innerHTML = 'Something went wrong..Please try again';
  }

  /**To inline edit for asset */
  editScx(i, scx) {
    this.statementPreviewData.investments.forEach(element => {
      element.scxList.forEach(scxVal => {
        scxVal.editScx = false;
      });
    });

    scx.editScx = true;
  }

  /** To save scx */
  saveScx(parentIndex: number, index: number, scx) {
    document.getElementById('scxError_' + parentIndex + '_' + index).innerHTML = '';
    scx.investmentDataLoading = true;
    // to remove special charactes from data object coming from DOM
    scx = this.commonHelperService.sanitizeDataObject(scx);

    let updatedScxDetails: Object = {};
    updatedScxDetails[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    updatedScxDetails[CommonConstant.FILE_REPO_ID] = this.fileRepoId;
    updatedScxDetails[CommonConstant.FLOW] = 'gx';
    updatedScxDetails[CommonConstant.TAG] = scx[CommonConstant.TAG];

    const investmentScxDetails: Object = {};
    investmentScxDetails[CommonConstant.PLAIN_ID] = scx.id;
    investmentScxDetails[PreviewConstant.SECURITY_ID] = scx.securityId;
    investmentScxDetails[PreviewConstant.DESCRIPTION] = scx.description;
    investmentScxDetails[PreviewConstant.ISSUER] = scx.issuer;
    investmentScxDetails[PreviewConstant.START_DATE] = scx.startDate;
    investmentScxDetails[PreviewConstant.MATURITY_DATE] = scx.maturityDate;
    investmentScxDetails[PreviewConstant.SECURITY_TYPE] = scx.securityType;
    investmentScxDetails[PreviewConstant.COUPON] = scx.coupon;

    updatedScxDetails[PreviewConstant.SECURITY_MASTER_FIELDS] = investmentScxDetails;
    updatedScxDetails = JSON.stringify(updatedScxDetails);

    // calling save security master service
    this.reviewService.updateInvestmentsData(updatedScxDetails).subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          // hiding loader and editable fields
          scx.investmentDataLoading = false;
          scx.editScx = false;
          // refresh preview screen
          this.statementPreviewData.investments[parentIndex].scxList[index] = res.data;
        } else {
          scx.investmentDataLoading = false;
          document.getElementById('scxError_' + parentIndex + '_' + index).innerHTML = res[CommonConstant.MESSAGE];
        }
      },
      error => {
        scx.investmentDataLoading = false;
        document.getElementById('scxError_' + parentIndex + '_' + index).innerHTML = 'Something went wrong..Please try again';
      }
    )
  }

  /**
   * To cancel scx update
   * @param index
   * @param scx
   */
  cancelScx(parentIndex, index, scx) {
    scx.investmentDataLoading = false;
    scx.editScx = false;
    document.getElementById('scxError_' + parentIndex + '_' + index).innerHTML = '';
  }

  /** To toggle all account transaction */
  toggleAllInvestmentAccountTxn(investment) {

    if (investment.isInvestmentAccountSelected) {
        investment.isAllInvestmentTxnSelected = true;
        investment.isAllInvestmentAssetsSelected = true;
        investment.isAllInvestmentScxSelected = true;
    } else {
        investment.isAllInvestmentTxnSelected = false;
        investment.isAllInvestmentAssetsSelected = false;
        investment.isAllInvestmentScxSelected = false;
    }

    investment.assets.forEach(element => {
      element.selected = investment.isInvestmentAccountSelected
    });

    investment.transactions.forEach(element => {
      element.selected = investment.isInvestmentAccountSelected;
    })

    investment.scxList.forEach(element => {
      element.selected = investment.isInvestmentAccountSelected;
    });
  }

  /** To toggle all investment assets */
  toggleAllInvestmeAssets(investment) {

    if (investment.isAllInvestmentAssetsSelected) {
        investment.isInvestmentAccountSelected = true;
        if (investment.isInvestmentAccountSelected) {
            /* document.getElementById("confirmInvestmentAccountSubmit").disabled = false;
            document.getElementById("rejectInvestmentAccountSubmit").disabled = false; */
        }
    }

    investment.assets.forEach(element => {
      element.selected = investment.isAllInvestmentAssetsSelected;
    });
  }

  /** To toggle one investment asset */
  optionToggledInvestmentAssets(investment) {
    investment.isInvestmentAccountSelected = true;
    if (investment.isInvestmentAccountSelected) {
      /* document.getElementById('confirmInvestmentAccountSubmit').disabled = false;
      document.getElementById('rejectInvestmentAccountSubmit').disabled = false; */
    }

    /* investmentData.isAllInvestmentAssetsSelected = investmentData.assets.every(function (asset) {
                return asset.selected;
            }) */
    investment.isAllInvestmentAssetsSelected = investment.assets.every(element => {
      return element.selected;
    })
  }

  /** To toggle all investment transaction */
  toggleAllInvestmentTxn(investment) {
    if (investment.isAllInvestmentTxnSelected) {
      investment.isInvestmentAccountSelected = true;
      if (investment.isInvestmentAccountSelected) {
        /* document.getElementById("confirmInvestmentAccountSubmit").disabled = false;
        document.getElementById("rejectInvestmentAccountSubmit").disabled = false; */
      }
    }

    investment.transactions.forEach(element => {
      element.selected = investment.isAllInvestmentTxnSelected;
    });
  }

  /** To toggle one investment transaction */
  optionToggledInvestmentTxn(investment) {
    investment.isInvestmentAccountSelected = true;
    if (investment.isInvestmentAccountSelected) {
      /* document.getElementById('confirmInvestmentAccountSubmit').disabled = false;
      document.getElementById('rejectInvestmentAccountSubmit').disabled = false; */
    }
    investment.isAllInvestmentTxnSelected = investment.transactions.every(element =>  {  // it will return true if all txns selected
      return element.selected;
    })
  }

  /** To toggle all investment scx */
  toggleAllInvestmentScx(investment) {
    if (investment.isAllInvestmentScxSelected) {
      investment.isInvestmentAccountSelected = true;
      if (investment.isInvestmentAccountSelected) {
        /* document.getElementById("confirmInvestmentAccountSubmit").disabled = false;
        document.getElementById("rejectInvestmentAccountSubmit").disabled = false; */
      }
    }

    investment.scxList.forEach(element => {
      element.selected = investment.isAllInvestmentScxSelected;
    });
  }

  /** To toggle one investment scx */
  optionToggledInvestmentScx(investment) {
    investment.isInvestmentAccountSelected = true;
    if (investment.isInvestmentAccountSelected) {
      /* document.getElementById('confirmInvestmentAccountSubmit').disabled = false;
      document.getElementById('rejectInvestmentAccountSubmit').disabled = false; */
    }
    investment.isAllInvestmentScxSelected = investment.scxList.every(element =>  {  // it will return true if all txns selected
      return element.selected;
    })
  }

  /**To generate request to confirm and reject */
  makeRequestForInvestmentConfirmReject() {
    let confirmAccountsData = {};
    const accountList = [];
    const transactionList = [];
    const assetList = [];
    const scxList = [];

    confirmAccountsData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    confirmAccountsData[CommonConstant.FILE_REPO_ID] = this.fileRepoId;
    confirmAccountsData[CommonConstant.FLOW] = 'gx';

    this.statementPreviewData.investments.forEach(investment => {
      if (investment.isInvestmentAccountSelected) {
        const accountData = {};
        accountData[PreviewConstant.ACCOUNT_TYPE] = CommonConstant.INVESTMENT_ACCOUNT_TYPE;
        accountData[PreviewConstant.ID] = investment.id;

        // TO get transaction data form investment data
        // tslint:disable-next-line:no-shadowed-variable
        const transactionList = [];
        investment.transactions.forEach(transaction => {
          if (transaction.selected) {  // If selected
            const txnData = {};
            txnData[PreviewConstant.ID] = transaction.id;
            transactionList.push(txnData);
          }
        });
        if (transactionList.length > 0) {  // If list contents are there
          accountData[PreviewConstant.TRANSACTIONS_KEY] = transactionList;
        } else {
          accountData[PreviewConstant.TRANSACTIONS_KEY] = [];
        }

        // TO get asset list from investment data
        // tslint:disable-next-line:no-shadowed-variable
        const assetList = [];
        investment.assets.forEach(asset => {
          if (asset.selected) {
            const assetData = {};
            assetData[PreviewConstant.ID] = asset.id;
            assetList.push(assetData);
          }
        });
        if (assetList.length > 0) { // if asset list contents are there
          accountData[PreviewConstant.ASSETS_KEY] = assetList;
        } else {
          accountData[PreviewConstant.ASSETS_KEY] = [];
        }

        // To get scx list from investment data
        // tslint:disable-next-line:no-shadowed-variable
        const scxList = [];
        investment.scxList.forEach(scx => {
          if (scx.selected) {
            const scxData: Object = {}
            scxData[PreviewConstant.ID] = scx.id;
            scxList.push(scxData);
          }
        });
        if (scxList.length > 0) {
          accountData[PreviewConstant.SCXS_KEY] = scxList;
        } else {
          accountData[PreviewConstant.SCXS_KEY] = [];
        }
        accountList.push(accountData);
      }
    });
    confirmAccountsData[PreviewConstant.ACCOUNTS_KEY] = accountList;
    confirmAccountsData = JSON.stringify(confirmAccountsData);

    return confirmAccountsData;
  }

  /**To confirm investment account */
  confirmInvestmentAccounts() {
    this.investmentDataLoading = true;
    const confirmInvestmentAccountsData = this.makeRequestForInvestmentConfirmReject();

    if (confirmInvestmentAccountsData) {
      // to confirm investment accounts
      this.reviewService.confirmAccountStatementData(confirmInvestmentAccountsData).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // refresh preview page
            this.reviewService.getStatementData().subscribe(
              data => {
                this.investmentDataLoading = false;
                this.statementPreviewData = data;
                // to check confirmed accounts
                this.toCheckConfirmAccounts(data);
                this.router.navigateByUrl('/repo/xmlfile');
              },
              error => {
                this.investmentDataLoading = false;
              }
            )
          } else {
            this.investmentDataLoading = false;
          }
        },
        error => {
          this.investmentDataLoading = false;
        }
      )
    }

  }

  /**To reject investment accounts */
  rejectInvestmentAccounts() {
    this.investmentDataLoading = true;
    const rejectInvestmentAccountsData = this.makeRequestForInvestmentConfirmReject();

    if (rejectInvestmentAccountsData) {
      this.reviewService.rejectAccountStatementData(rejectInvestmentAccountsData).subscribe(
        res => {
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // refresh preview page content
            this.reviewService.getStatementData().subscribe(
              data => {
                this.investmentDataLoading = false;
                this.statementPreviewData = data;
                // to check confirmed accounts
                this.toCheckConfirmAccounts(data);
                this.router.navigateByUrl('/repo/xmlfile');
              },
              error => {
                this.investmentDataLoading = false;
              }
            )
          } else {
            this.investmentDataLoading = false;
          }
        }
      )
    }
  }

  /**
   * Creditcard Integration
   */

  /** checked all transactions if main txn checkbox is checked */
  toggleAllCreditcardTxn = (creditcard) => {

    if (creditcard.isAllCreditcardTxnSelected) {
      creditcard.isCreditcardAccountSelected = true;
      if (creditcard.isCreditcardAccountSelected) {
        /* document.getElementById('confirmCreditcardAccountSubmit').disabled = false;
        document.getElementById('rejectCreditcardAccountSubmit').disabled = false; */
      }
    }

    creditcard.transactions.forEach((transaction) => {
      transaction.selected = creditcard.isAllCreditcardTxnSelected;
    });
  }

  /** Check all creditcard transactions if account is checked */
  toggleAllCreditcardAccountTxn = (creditcard) => {

    if (creditcard.isCreditcardAccountSelected) {
      creditcard.isAllCreditcardTxnSelected = true;
    } else {
      creditcard.isAllCreditcardTxnSelected = false;
    }

    creditcard.transactions.forEach((transaction) => {
      transaction.selected = creditcard.isCreditcardAccountSelected;
    });
  }

  /** To check creditcard account and main txn checkbox if anyone of the txns checkbox is checked */
  optionToggledCreditcardTxn = (creditcard) => {
    creditcard.isCreditcardAccountSelected = true;
    if (creditcard.isCreditcardAccountSelected) {
      /* document.getElementById('confirmCreditcardAccountSubmit').disabled = false;
      document.getElementById('rejectCreditcardAccountSubmit').disabled = false; */
    }
    // it will return true if all txns selected
    creditcard.isAllCreditcardTxnSelected = creditcard.transactions.every((transaction) => {
      return transaction.selected;
    })
  }

  /** To create list of bank accounts and corresponding transaction in json format */
  makeRequestForCreditcardConfirmReject() {
    let confirmAccountsData = {};
    const accountList = [];
    let transactionList = [];
    confirmAccountsData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    confirmAccountsData[CommonConstant.FILE_REPO_ID] = this.fileRepoId;
    confirmAccountsData[CommonConstant.FLOW] = 'gx';
    // looping through this.statementPreviewData.cards details
    this.statementPreviewData.cards.forEach((bankData) => {
      if (bankData.isCreditcardAccountSelected) {
        const accountData = {};
        accountData[PreviewConstant.ACCOUNT_TYPE] = CommonConstant.CREDITCARD_ACCOUNT_TYPE;
        accountData[PreviewConstant.ID] = bankData.id;
        transactionList = [];
        bankData.transactions.forEach((transaction) => {
          if (transaction.selected) {  // If selected
            const txnData = {};
            txnData[PreviewConstant.ID] = transaction.id;
            transactionList.push(txnData);
          }
        })
        if (transactionList.length > 0) {  // If list contents are there
          accountData[PreviewConstant.TRANSACTIONS_KEY] = transactionList;
        } else {
          accountData[PreviewConstant.TRANSACTIONS_KEY] = [];
        }
        accountList.push(accountData);
      }
    })
    confirmAccountsData[PreviewConstant.ACCOUNTS_KEY] = accountList;
    confirmAccountsData = JSON.stringify(confirmAccountsData);

    return confirmAccountsData;
  }

  /** To confirm creditcard account */
  confirmCreditCardAccounts() {
    document.getElementById('creditcardError').innerHTML = '';
    this.creditcardDataLoading = true;

    const confirmCreditcardAccountsData = this.makeRequestForCreditcardConfirmReject();
    if (confirmCreditcardAccountsData) {
      this.reviewService.confirmAccountStatementData(confirmCreditcardAccountsData).subscribe(
        res => {
          this.creditcardDataLoading = false;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // refresh preview page
            this.reviewService.getStatementData().subscribe(
              data => {
                this.creditcardDataLoading = false;
                this.statementPreviewData = data;
                // to check confirmed accounts
                this.toCheckConfirmAccounts(data);

                this.router.navigateByUrl('overview');
              },
              error => {
                this.creditcardDataLoading = false;
              }
            )
          } else {
            this.creditcardDataLoading = false;
            document.getElementById('creditcardError').innerHTML = res[CommonConstant.MESSAGE];
          }
        },
        error => {
          this.creditcardDataLoading = false;
          document.getElementById('creditcardError').innerHTML = 'Something went wrong..Please try again';
        }
      )
    }
  }

  /** To reject creditcard account */
  rejectCreditCardAccounts() {
    document.getElementById('creditcardError').innerHTML = '';
    this.creditcardDataLoading = true;

    const confirmCreditcardAccountsData = this.makeRequestForCreditcardConfirmReject();
    if (confirmCreditcardAccountsData) {
      this.reviewService.rejectAccountStatementData(confirmCreditcardAccountsData).subscribe(
        res => {
          this.creditcardDataLoading = false;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // refresh preview page
            this.reviewService.getStatementData().subscribe(
              data => {
                this.creditcardDataLoading = false;
                this.statementPreviewData = data;
                // to check confirmed accounts
                this.toCheckConfirmAccounts(data);

                this.router.navigateByUrl('overview');
              },
              error => {
                this.creditcardDataLoading = false;
              }
            )
          } else {
            this.creditcardDataLoading = false;
            document.getElementById('creditcardError').innerHTML = res[CommonConstant.MESSAGE];
          }
        },
        error => {
          this.creditcardDataLoading = false;
          document.getElementById('creditcardError').innerHTML = 'Something went wrong..Please try again';
        }
      )
    }
  }

  /**
   * To select updated catgory from dropdown
   * @param transaction
   * @param category
   * @param subcategory
   * @param catImage
   */
  getCategorySubcategoryInlineCreditcard(transaction, category, subcategory, catImage) {
    this.editTransactionObj.updatedCategory = category;
    this.editTransactionObj.updatedSubcategory = subcategory;
    this.editTransactionObj.updatedCategoryImageUrl = catImage;
  }

  /**To inline edit for transaction */
  editCreditcardTransaction(i, transaction, event) {
    if (!transaction.editTransaction) {
      this.editTransactionObj = {};
      this.editTransactionObj = transaction;
      this.editTransactionObj['updatedTransDate'] =
        this.commonHelperService.displayDateFormatMyDatePicker(this.editTransactionObj.transDate);

      this.editTransactionObj['updatedMerchantName'] = this.editTransactionObj.merchantName;
      this.editTransactionObj['updatedCategory'] = this.editTransactionObj.category;
      this.editTransactionObj['updatedSubcategory'] = this.editTransactionObj.subcategory;
      this.editTransactionObj['updatedAmount'] = this.editTransactionObj.amount;
      this.editTransactionObj['updatedCategoryImageUrl'] = this.editTransactionObj.categoryImageUrl;

      this.statementPreviewData.cards.forEach(element => {
        element.transactions.forEach(txn => {
          txn.editTransaction = false;
        });
      });

      transaction.editTransaction = true;

      // $('#subcategory_input_' + transaction.id).show();
      this.loadDropdown(transaction.id);
    }

  }

  /** To load dropdown */
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
   * To save updated investment transaction data
   * @param i
   * @param transaction
   */
  saveCreditcardTransaction(index: number, childIndex: number, transaction) {
    document.getElementById('txnError_' + index + '_' + childIndex).innerHTML = '';
    transaction.transactionDataLoading = true;
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
          transaction.editTransaction = false;
          // refresh preview screen
          // this.transactions[index] = res.data;
          this.statementPreviewData.banks[index].transactions[childIndex] = res.data;
        } else {
          // hiding loader and editable fields
          transaction.transactionDataLoading = false;
          document.getElementById('txnError_' + index + '_' + childIndex).innerHTML = '';
        }
      },
      error => {
        transaction.transactionDataLoading = false;
        document.getElementById('txnError_' + index + '_' + childIndex).innerHTML = 'Something went wrong..Please try again';
      }
    )
  }

  /**
   * To cancel investment updated transaction
   * @param index
   * @param transaction
   */
  cancelCreditcardTransaction(parentIndex, index, transaction) {
    // transaction.investmentDataLoading = false;
    transaction.editTransaction = false;
    // document.getElementById('txnError_' + parentIndex + '_' + index).innerHTML = '';
  }

  /**
   * Bank Integration
   */

  /** Check all bank transactions if account is checked */
  toggleAllBankAccountTxn = (bankdata) => {

    if (bankdata.isBankAccountSelected) {
      bankdata.isAllBankTxnSelected = true;
    } else {
      bankdata.isAllBankTxnSelected = false;
    }

    bankdata.transactions.forEach((transaction) => {
      transaction.selected = bankdata.isBankAccountSelected;
    });
  }

  /** checked all transactions if main txn checkbox is checked */
  toggleAllBankTxn = (bankData) => {

    if (bankData.isAllBankTxnSelected) {
      bankData.isBankAccountSelected = true;
      if (bankData.isBankAccountSelected) {
        /* document.getElementById('confirmBankAccountSubmit').disabled = false;
        document.getElementById('rejectBankAccountSubmit').disabled = false; */
      }
    }

    bankData.transactions.forEach((transaction) => {
      transaction.selected = bankData.isAllBankTxnSelected;
    });
  }
  /** To check bank account and main txn checkbox if anyone of the txns checkbox is checked */
  optionToggledBankTxn = (bankData) => {
    bankData.isBankAccountSelected = true;
    if (bankData.isBankAccountSelected) {
      /* document.getElementById('confirmBankAccountSubmit').disabled = false;
      document.getElementById('rejectBankAccountSubmit').disabled = false; */
    }
    bankData.isAllBankTxnSelected = bankData.transactions.every((transaction) => {  // it will return true if all txns selected
      return transaction.selected;
    })
  }

  /** To create list of bank accounts and corresponding transaction in json format */
  makeRequestForBankConfirmReject() {
    let confirmAccountsData = {};
    const accountList = [];
    let transactionList = [];
    confirmAccountsData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    confirmAccountsData[CommonConstant.FILE_REPO_ID] = this.fileRepoId;
    confirmAccountsData[CommonConstant.FLOW] = 'gx';
    // looping through $scope.statementPreviewData.banks details
    this.statementPreviewData.banks.forEach((bankData) => {
      if (bankData.isBankAccountSelected) {
        const accountData = {};
        accountData[PreviewConstant.ACCOUNT_TYPE] = CommonConstant.BANK_ACCOUNT_TYPE;
        accountData[PreviewConstant.ID] = bankData.id;
        transactionList = [];
        bankData.transactions.forEach((transaction) => {
          if (transaction.selected) {  // If selected
            const txnData = {};
            txnData[PreviewConstant.ID] = transaction.id;
            transactionList.push(txnData);
          }
        })
        if (transactionList.length > 0) {  // If list contents are there
          accountData[PreviewConstant.TRANSACTIONS_KEY] = transactionList;
        } else {
          accountData[PreviewConstant.TRANSACTIONS_KEY] = [];
        }
        accountList.push(accountData);
      }
    })
    confirmAccountsData[PreviewConstant.ACCOUNTS_KEY] = accountList;
    confirmAccountsData = JSON.stringify(confirmAccountsData);

    return confirmAccountsData;
  }

  /** To confirm all bank accounts */
  confirmBankAccounts() {
    document.getElementById('bankError').innerHTML = '';
    this.bankDataLoading = true;

    const confirmCreditcardAccountsData = this.makeRequestForBankConfirmReject();

    if (confirmCreditcardAccountsData) {
      this.reviewService.confirmAccountStatementData(confirmCreditcardAccountsData).subscribe(
        res => {
          this.bankDataLoading = false;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // refresh preview page
            this.reviewService.getStatementData().subscribe(
              data => {
                this.bankDataLoading = false;
                this.statementPreviewData = data;
                // to check confirmed accounts
                this.toCheckConfirmAccounts(data);

                this.router.navigateByUrl('overview');
              },
              error => {
                this.bankDataLoading = false;
              }
            )
          } else {
            this.bankDataLoading = false;
            document.getElementById('bankError').innerHTML = res[CommonConstant.MESSAGE];
          }
        },
        error => {
          this.bankDataLoading = false;
          document.getElementById('bankError').innerHTML = 'Something went wrong..Please try again';
        }
      )
    }
  }

  /** To reject all bank accounts */
  rejectBankAccounts() {
    document.getElementById('bankError').innerHTML = '';
    this.bankDataLoading = true;

    const confirmCreditcardAccountsData = this.makeRequestForBankConfirmReject();

    if (confirmCreditcardAccountsData) {
      this.reviewService.rejectAccountStatementData(confirmCreditcardAccountsData).subscribe(
        res => {
          this.bankDataLoading = false;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // refresh preview page
            this.reviewService.getStatementData().subscribe(
              data => {
                this.bankDataLoading = false;
                this.statementPreviewData = data;
                // to check confirmed accounts
                this.toCheckConfirmAccounts(data);

                this.router.navigateByUrl('overview');
              },
              error => {
                this.bankDataLoading = false;
              }
            )
          } else {
            this.bankDataLoading = false;
            document.getElementById('bankError').innerHTML = res[CommonConstant.MESSAGE];
          }
        },
        error => {
          this.bankDataLoading = false;
          document.getElementById('bankError').innerHTML = 'Something went wrong..Please try again';
        }
      )
    }
  }

  /**
   * To select updated catgory from dropdown
   * @param transaction
   * @param category
   * @param subcategory
   * @param catImage
   */
  getCategorySubcategoryInlineBank(transaction, category, subcategory, catImage) {
    this.editTransactionObj.updatedCategory = category;
    this.editTransactionObj.updatedSubcategory = subcategory;
    this.editTransactionObj.updatedCategoryImageUrl = catImage;
  }

  /**To inline edit for transaction */
  editBankTransaction(i, transaction, event) {
    if (!transaction.editTxn) {
      this.editTransactionObj = {};
      this.editTransactionObj = transaction;
      this.editTransactionObj['updatedTransDate'] =
        this.commonHelperService.displayDateFormatMyDatePicker(this.editTransactionObj.transDate);

      this.editTransactionObj['updatedMerchantName'] = this.editTransactionObj.merchantName;
      this.editTransactionObj['updatedCategory'] = this.editTransactionObj.category;
      this.editTransactionObj['updatedSubcategory'] = this.editTransactionObj.subcategory;
      this.editTransactionObj['updatedAmount'] = this.editTransactionObj.amount;
      this.editTransactionObj['updatedCategoryImageUrl'] = this.editTransactionObj.categoryImageUrl;

      this.statementPreviewData.banks.forEach(element => {
        element.transactions.forEach(txn => {
          txn.editTxn = false;
        });
      });

      transaction.editTxn = true;

      // $('#subcategory_input_' + transaction.id).show();
      this.loadDropdown(transaction.id);

    }

  }

  /**
   * To save updated investment transaction data
   * @param i
   * @param transaction
   */
  saveBankTransaction(index: number, childIndex: number, transaction) {
    document.getElementById('txnError_' + index + '_' + childIndex).innerHTML = '';
    transaction.transactionDataLoading = true;
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
          // this.transactions[index] = res.data;
          this.statementPreviewData.banks[index].transactions[childIndex] = res.data;
        } else {
          // hiding loader and editable fields
          transaction.transactionDataLoading = false;
          document.getElementById('txnError_' + index + '_' + childIndex).innerHTML = '';
        }
      },
      error => {
        transaction.transactionDataLoading = false;
        document.getElementById('txnError_' + index + '_' + childIndex).innerHTML = 'Something went wrong..Please try again';
      }
    )
  }

  /**
   * To cancel investment updated transaction
   * @param index
   * @param transaction
   */
  cancelBankTransaction(parentIndex, index, transaction) {
    // transaction.investmentDataLoading = false;
    transaction.editTxn = false;
    // document.getElementById('txnError_' + parentIndex + '_' + index).innerHTML = '';
  }

  /**
   * Loan Integration
   */

  /** Check all bank transactions if account is checked */
  toggleAllLoanAccountTxn = (loanData) => {

    if (loanData.isLoanAccountSelected) {
      loanData.isAllBankTxnSelected = true;
    } else {
      loanData.isAllBankTxnSelected = false;
    }

    loanData.transactions.forEach((transaction) => {
      transaction.selected = loanData.isLoanAccountSelected;
    });
  }

  /** checked all transactions if main txn checkbox is checked */
  toggleAllLoanTxn = (loanData) => {

    if (loanData.isAllLoanTxnSelected) {
      loanData.isLoanAccountSelected = true;
      if (loanData.isLoanAccountSelected) {
        /* document.getElementById('confirmBankAccountSubmit').disabled = false;
        document.getElementById('rejectBankAccountSubmit').disabled = false; */
      }
    }

    loanData.transactions.forEach((transaction) => {
      transaction.selected = loanData.isAllLoanTxnSelected;
    });
  }
  /** To check bank account and main txn checkbox if anyone of the txns checkbox is checked */
  optionToggledLoanTxn = (loanData) => {
    loanData.isLoanAccountSelected = true;
    if (loanData.isLoanAccountSelected) {
      /* document.getElementById('confirmBankAccountSubmit').disabled = false;
      document.getElementById('rejectBankAccountSubmit').disabled = false; */
    }
    loanData.isAllLoanTxnSelected = loanData.transactions.every((transaction) => {  // it will return true if all txns selected
      return transaction.selected;
    })
  }

  /** To create list of bank accounts and corresponding transaction in json format */
  makeRequestForLoanConfirmReject() {
    let confirmAccountsData = {};
    const accountList = [];
    let transactionList = [];
    confirmAccountsData[CommonConstant.USER_ID] = this.commonHttpAdapterService.getCurrentUserId();
    confirmAccountsData[CommonConstant.FLOW] = 'pimoney';
    // looping through $scope.statementPreviewData.loans details
    this.statementPreviewData.loans.forEach((loanData) => {
      if (loanData.isLoanAccountSelected) {
        const accountData = {};
        accountData[PreviewConstant.ACCOUNT_TYPE] = CommonConstant.LOAN_ACCOUNT_TYPE;
        accountData[PreviewConstant.ID] = loanData.id;
        transactionList = [];
        loanData.transactions.forEach((transaction) => {
          if (transaction.selected) {  // If selected
            const txnData = {};
            txnData[PreviewConstant.ID] = transaction.id;
            transactionList.push(txnData);
          }
        })
        if (transactionList.length > 0) {  // If list contents are there
          accountData[PreviewConstant.TRANSACTIONS_KEY] = transactionList;
        } else {
          accountData[PreviewConstant.TRANSACTIONS_KEY] = [];
        }
        accountList.push(accountData);
      }
    })
    confirmAccountsData[PreviewConstant.ACCOUNTS_KEY] = accountList;
    confirmAccountsData = JSON.stringify(confirmAccountsData);

    return confirmAccountsData;
  }

  /** To confirm loan accounts */
  confirmLoanAccounts() {
    document.getElementById('loanError').innerHTML = '';
    this.loanDataLoading = true;

    const confirmLoanAccountsData = this.makeRequestForLoanConfirmReject();
    if (confirmLoanAccountsData) {
      this.reviewService.confirmAccountStatementData(confirmLoanAccountsData).subscribe(
        res => {
          this.loanDataLoading = false;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // refresh preview page
            this.reviewService.getStatementData().subscribe(
              data => {
                this.loanDataLoading = false;
                this.statementPreviewData = data;
                // to check confirmed accounts
                this.toCheckConfirmAccounts(data);

                this.router.navigateByUrl('overview');
              },
              error => {
                this.loanDataLoading = false;
              }
            )
          } else {
            this.loanDataLoading = false;
            document.getElementById('loanError').innerHTML = res[CommonConstant.MESSAGE];
          }
        },
        error => {
          this.loanDataLoading = false;
          document.getElementById('loanError').innerHTML = 'Something went wrong..Please try again';
        }
      )
    }
  }

  /** To reject loan accounts */
  rejectLoanAccounts() {
    document.getElementById('loanError').innerHTML = '';
    this.loanDataLoading = true;

    const confirmLoanAccountsData = this.makeRequestForLoanConfirmReject();

    if (confirmLoanAccountsData) {
      this.reviewService.rejectAccountStatementData(confirmLoanAccountsData).subscribe(
        res => {
          this.loanDataLoading = false;
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // refresh preview page
            this.reviewService.getStatementData().subscribe(
              data => {
                this.loanDataLoading = false;
                this.statementPreviewData = data;
                // to check confirmed accounts
                this.toCheckConfirmAccounts(data);

                this.router.navigateByUrl('overview');
              },
              error => {
                this.loanDataLoading = false;
              }
            )
          } else {
            this.loanDataLoading = false;
            document.getElementById('loanError').innerHTML = res[CommonConstant.MESSAGE];
          }
        },
        error => {
          this.loanDataLoading = false;
          document.getElementById('loanError').innerHTML = 'Something went wrong..Please try again';
        }
      )
    }
  }

  /**To inline edit for transaction */
  editLoanTransaction(i, transaction, event) {

    if (!transaction.editTxn) {
      this.editTransactionObj = {};
      this.editTransactionObj = transaction;
      this.editTransactionObj['updatedTransDate'] =
        this.commonHelperService.displayDateFormatMyDatePicker(this.editTransactionObj.transDate);

      this.editTransactionObj['updatedMerchantName'] = this.editTransactionObj.merchantName;
      this.editTransactionObj['updatedCategory'] = this.editTransactionObj.category;
      this.editTransactionObj['updatedSubcategory'] = this.editTransactionObj.subcategory;
      this.editTransactionObj['updatedAmount'] = this.editTransactionObj.amount;
      this.editTransactionObj['updatedCategoryImageUrl'] = this.editTransactionObj.categoryImageUrl;

      this.statementPreviewData.loans.forEach(element => {
        element.transactions.forEach(txn => {
          txn.editTxn = false;
        });
      });

      transaction.editTxn = true;

      // $('#subcategory_input_' + transaction.id).show();
      this.loadDropdown(transaction.id);

    }

  }

  /**
   * To save updated investment transaction data
   * @param i
   * @param transaction
   */
  saveLoanTransaction(index: number, childIndex: number, transaction) {
    document.getElementById('txnError_' + index + '_' + childIndex).innerHTML = '';
    transaction.transactionDataLoading = true;
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
          // this.transactions[index] = res.data;
          this.statementPreviewData.loans[index].transactions[childIndex] = res.data;
        } else {
          // hiding loader and editable fields
          transaction.transactionDataLoading = false;
          document.getElementById('txnError_' + index + '_' + childIndex).innerHTML = '';
        }
      },
      error => {
        transaction.transactionDataLoading = false;
        document.getElementById('txnError_' + index + '_' + childIndex).innerHTML = 'Something went wrong..Please try again';
      }
    )
  }

  /**
   * To cancel investment updated transaction
   * @param index
   * @param transaction
   */
  cancelLoanTransaction(parentIndex, index, transaction) {
    // transaction.investmentDataLoading = false;
    transaction.editTxn = false;
    // document.getElementById('txnError_' + parentIndex + '_' + index).innerHTML = '';
  }

}
