import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonConstant } from '../../constants/common/common.constant';
import { CarrierConstant } from '../../constants/carrier/carrier.constant';
import * as moment from 'moment';

/**
 * Carrier Helper Service Class
 */
@Injectable()
export class CarrierHelper {

   private _carrierData: any = {};
   private _policyInfoData: any = {};
   private _newcarrierData: any = {};

   /** @ignore */
   constructor(
      private _fb: FormBuilder
   ) { }

   /**
    * To get stored carrier data object
    */
   public getCarrierData(): any {
      let carrierData = sessionStorage.getItem('carrierData');
      if (carrierData) {
         carrierData = JSON.parse(carrierData);
         return carrierData;
      }
      return {};
   }

   /**
    * To set carrier data object
    * @param any v
    */
   public setCarrierData(v: any) {
      if (Object.keys(v).length > 0) {
         this._carrierData = {};
         this._carrierData[CarrierConstant.CARRIER_ID] = v[CommonConstant.PLAIN_ID];
         this._carrierData[CommonConstant.NAME] = v[CommonConstant.NAME];
         this._carrierData[CommonConstant.IMAGE_ICON] = v[CommonConstant.IMAGE_ICON];

         this._carrierData = JSON.stringify(this._carrierData);
         sessionStorage.setItem('carrierData', this._carrierData);
      } else {
         this._carrierData = {};
         this._carrierData = JSON.stringify(this._carrierData);
         sessionStorage.setItem('carrierData', this._carrierData);
      }
   }

   /**
    * To get carrier ID
    */
   public getCarrierId() {
      let carrierData = sessionStorage.getItem('carrierData');
      if (carrierData) {
         carrierData = JSON.parse(carrierData);
         return carrierData['carrierId'];
      }
   }

   /**
    * To set policy info id
    * @param any v
    */
   setPolicyData(v: any) {
      if (Object.keys(v).length > 0) {
         this._policyInfoData = {};
         this._policyInfoData['policyInfoId'] = v[CommonConstant.PLAIN_ID];

         this._policyInfoData = JSON.stringify(this._policyInfoData);
         sessionStorage.setItem('policyData', this._policyInfoData);
      } else {
         this._policyInfoData = {};
         this._policyInfoData = JSON.stringify(this._policyInfoData);
         sessionStorage.setItem('policyData', this._policyInfoData);
      }
   }

   /**
   * To get policy info ID
   */
   public getPolicyInfoId() {
      let policyData = localStorage.getItem('planData');
      if (policyData) {
         policyData = JSON.parse(policyData);
         return policyData[CommonConstant.PLAIN_ID];
      }
   }

   /**
    * To get stored carrier data object
    */
   public getPlanData(): any {
      let planData = localStorage.getItem('planData');
      if (planData) {
         planData = JSON.parse(planData);
         return planData;
      }
      return {};
   }

   /**
    * To get stored carrier data
    */
   public getNewCarrierData(): any {
      return this._newcarrierData;
   }

   /**
    * To set carrier data
    * @param any v
    */
   public setNewCarrierData(v: any) {
      // console.log(v);
      this._newcarrierData = {};
      this._newcarrierData = v;
   }

   /**
    * To set plan flag
    * @param flag
    */
   public setPlanFlag(flag) {
      localStorage.setItem('planFlag', flag);
   }

   /**
    * To get plan flag
    */
   public getPlanFlag() {
      const planFlag = localStorage.getItem('planFlag');
      if (planFlag) {
         return planFlag;
      }
      return null;
   }

   /**
    * To remove plan flag from localstorage
    */
   public removePlanFlags() {
      localStorage.removeItem('planFlag');
   }

   /**
    * To check month and year
    * @param month
    * @param year
    * @param range
    */
   validateMonthYear(month, year, range?) {
      let reqDate;
      const monthsConst = 'months';
      const yearsConst = 'yrs';
      const monthConst = 'month';
      const yearConst = 'yr';
      if (!range) {
         if (year === 0) {
            reqDate = '0';
         } else if (year !== 0) {
            let decidingFactor = yearsConst;
            if (year === 1) {
               decidingFactor = yearConst;
            }
            reqDate = year + ' ' + decidingFactor;
         }
      } else {
         if (month === 0 && year === 0) {
            reqDate = '0';
         } else if (month === 0 && year !== 0) {
            let decidingFactor = yearsConst;
            if (year === 1) {
               decidingFactor = yearConst;
            }
            reqDate = year + ' ' + decidingFactor;
         } else if (month !== 0 && year === 0) {
            let decidingFactor = monthsConst;
            if (month === 1) {
               decidingFactor = monthConst;
            }
            reqDate = month + ' ' + decidingFactor;
         } else if (month !== 0 && year !== 0) {
            let yearDecidingFactor = yearsConst;
            if (year === 1) {
               yearDecidingFactor = yearConst;
            }
            let monthDecidingFactor = monthsConst;
            if (month === 1) {
               monthDecidingFactor = monthConst;
            }
            reqDate = year + ' ' + yearDecidingFactor + ' ' + month + ' ' + monthDecidingFactor;
         }
      }

      return reqDate;
   }

   /**
    * To format plan terms to show it into UI
    * @param element
    */
   getFormattedPlanTermObj(element) {
      // console.log(element);
      let planTermObject: any = {};
      let fromDate;
      let toDate;
      planTermObject = {};
      fromDate = '';
      toDate = '';
      if (!element.range) {
         fromDate = this.validateMonthYear(element.year, element.year, element.range);
         toDate = this.validateMonthYear(element.year, element.year, element.range);
         planTermObject['fromDate'] = fromDate;
         planTermObject['toDate'] = toDate;
      } else {
         if (element.fromDateYear === element.toDateYear && element.fromDateMonth !== element.toDateMonth) {
            fromDate = this.validateMonthYear(element.fromDateMonth, element.fromDateYear);
            toDate = this.validateMonthYear(element.toDateMonth, element.toDateYear);
            planTermObject['fromDate'] = fromDate;
            planTermObject['toDate'] = toDate;
         } else if (element.fromDateYear === element.toDateYear && element.fromDateMonth === element.toDateMonth) {
            fromDate = this.validateMonthYear(element.fromDateMonth, element.fromDateYear);
            toDate = this.validateMonthYear(element.toDateMonth, element.toDateYear);
            planTermObject['fromDate'] = fromDate;
            planTermObject['toDate'] = toDate;
         } else if (element.fromDateYear !== element.toDateYear && element.fromDateMonth !== element.toDateMonth
            || element.fromDateYear !== element.toDateYear && element.fromDateMonth === element.toDateMonth) {

            fromDate = this.validateMonthYear(element.fromDateMonth, element.fromDateYear);
            toDate = this.validateMonthYear(element.toDateMonth, element.toDateYear);
            planTermObject['fromDate'] = fromDate;
            planTermObject['toDate'] = toDate;
         }
      }
      planTermObject[CommonConstant.PLAIN_ID] = element[CommonConstant.PLAIN_ID];
      planTermObject[CarrierConstant.RANGE] = element[CarrierConstant.RANGE];
      planTermObject[CarrierConstant.YEAR] = element[CarrierConstant.YEAR];
      planTermObject['fromMonth'] = element['fromMonth'];
      planTermObject['fromYear'] = element['fromYear'];
      planTermObject['toMonth'] = element['toMonth'];
      planTermObject['toYear'] = element['toYear'];
      planTermObject['commissionTermMonth'] = element['commissionTermMonth'];
      planTermObject['commissionTermYear'] = element['commissionTermYear'];

      return planTermObject;
   }

   /**
    * To format plan terms to show it into UI
    * @param element
    */
   getFormattedPlanTerms(element) {
      // console.log(element);
      let planTermObject: any = {};
      let fromDate;
      let toDate;
      planTermObject = {};
      fromDate = '';
      toDate = '';
      if (!element.range) {
         fromDate = this.validateMonthYear(element.year, element.year, element.range);
         toDate = this.validateMonthYear(element.year, element.year, element.range);
         planTermObject['fromDate'] = fromDate;
         planTermObject['toDate'] = toDate;
      } else {
         if (element.fromDateYear === element.toDateYear && element.fromDateMonth !== element.toDateMonth) {
            fromDate = this.validateMonthYear(element.fromDateMonth, element.fromDateYear);
            toDate = this.validateMonthYear(element.toDateMonth, element.toDateYear);
            planTermObject['fromDate'] = fromDate;
            planTermObject['toDate'] = toDate;
         } else if (element.fromDateYear === element.toDateYear && element.fromDateMonth === element.toDateMonth) {
            fromDate = this.validateMonthYear(element.fromDateMonth, element.fromDateYear);
            toDate = this.validateMonthYear(element.toDateMonth, element.toDateYear);
            planTermObject['fromDate'] = fromDate;
            planTermObject['toDate'] = toDate;
         } else if (element.fromDateYear !== element.toDateYear && element.fromDateMonth !== element.toDateMonth
            || element.fromDateYear !== element.toDateYear && element.fromDateMonth === element.toDateMonth) {

            fromDate = this.validateMonthYear(element.fromDateMonth, element.fromDateYear);
            toDate = this.validateMonthYear(element.toDateMonth, element.toDateYear);
            planTermObject['fromDate'] = fromDate;
            planTermObject['toDate'] = toDate;
         }
      }
      planTermObject['id'] = element['id'];
      let formattedRes;
      if (Object.keys(planTermObject).length > 0) {
         if (planTermObject['toDate']) {
            if (planTermObject['fromDate'] === planTermObject['toDate']) {
               formattedRes = planTermObject['fromDate'];
            } else {
               formattedRes = planTermObject['fromDate'] + ' - ' + planTermObject['toDate'];
            }
         } else {
            formattedRes = planTermObject['fromDate'];
         }
         return formattedRes;
      } else {
         return '';
      }
   }

   /**
  * To format plan terms to show it into UI
  * @param any[] resData
  */
   getFormattedPlanTermList(resData: any[]) {
      let planTermObject: any = {};
      let fromDate;
      let toDate;
      const planTermList = [];
      resData.forEach(element => {
         planTermObject = {};
         fromDate = '';
         toDate = '';
         if (!element.range) {
            fromDate = this.validateMonthYear(element.year, element.year, element.range);
            toDate = this.validateMonthYear(element.year, element.year, element.range);
            planTermObject['fromDate'] = fromDate;
            planTermObject['toDate'] = toDate;
         } else {
            if (element.fromDateYear === element.toDateYear && element.fromDateMonth !== element.toDateMonth) {
               fromDate = this.validateMonthYear(element.fromDateMonth, element.fromDateYear);
               toDate = this.validateMonthYear(element.toDateMonth, element.toDateYear);
               planTermObject['fromDate'] = fromDate;
               planTermObject['toDate'] = toDate;
            } else if (element.fromDateYear === element.toDateYear && element.fromDateMonth === element.toDateMonth) {
               fromDate = this.validateMonthYear(element.fromDateMonth, element.fromDateYear);
               toDate = this.validateMonthYear(element.toDateMonth, element.toDateYear);
               planTermObject['fromDate'] = fromDate;
               planTermObject['toDate'] = toDate;
            } else if (element.fromDateYear !== element.toDateYear && element.fromDateMonth !== element.toDateMonth
               || element.fromDateYear !== element.toDateYear && element.fromDateMonth === element.toDateMonth) {

               fromDate = this.validateMonthYear(element.fromDateMonth, element.fromDateYear);
               toDate = this.validateMonthYear(element.toDateMonth, element.toDateYear);
               planTermObject['fromDate'] = fromDate;
               planTermObject['toDate'] = toDate;
            }
         }
         planTermObject['id'] = element['id'];
         planTermList.push(planTermObject);
      });
      return planTermList;
   }

   /**
    * to get formatted commission terms
    * @param commTerm
    */
   getFormattedCommissionTerm(commTerm) {
      if (commTerm) {
         commTerm = Number(commTerm);
         const years = Math.floor(commTerm / 12);
         const months = commTerm % 12;
         if (years < 1) {
            return months + ' months';
         } else {
            if (months) {
               return years + ' years' + ' ' + months + ' months';
            } else {
               return years + ' years'
            }
         }
      }
   }

   /**
    * To get months from commission term
    * @param commTerm
    */
   getCommissionTermMonth(commTerm) {
      if (commTerm) {
         commTerm = Number(commTerm);
         const months = commTerm % 12;
         return months;
      }
   }

   /**
    * To get years from commission term
    * @param commTerm
    */
   getCommissionTermYear(commTerm) {
      if (commTerm) {
         commTerm = Number(commTerm);
         const years = Math.floor(commTerm / 12);
         return years;
      }
   }

   /**
    * To initialize plan Term
    * @param element
    */
   initPlanTerm(element?) {
      if (element) {
         if (typeof element === 'object') {
            let commissionTermMonth: number, commissionTermYear: number;
            if (element[CarrierConstant.COMMISSION_TERM]) {
               commissionTermMonth = this.getCommissionTermMonth(element[CarrierConstant.COMMISSION_TERM]);
               commissionTermYear = this.getCommissionTermYear(element[CarrierConstant.COMMISSION_TERM]);
            }
            return this._fb.group({
               planTerm: this._fb.group({
                  id: element[CommonConstant.PLAIN_ID],
                  range: element[CarrierConstant.RANGE],
                  year: element[CarrierConstant.YEAR],
                  fromMonth: element[CarrierConstant.FROM_DATE_MONTH],
                  fromYear: element[CarrierConstant.FROM_DATE_YEAR],
                  toMonth: element[CarrierConstant.TO_DATE_MONTH],
                  toYear: element[CarrierConstant.TO_DATE_YEAR],
                  commissionTermMonth: commissionTermMonth,
                  commissionTermYear: commissionTermYear,
                  newField: false
               })
            })
         }
      } else {
         return this._fb.group({
            planTerm: this._fb.group({
               id: [''],
               range: [false],
               year: [''],
               fromMonth: [''],
               fromYear: [''],
               toMonth: [''],
               toYear: [''],
               commissionTermMonth: [''],
               commissionTermYear: [''],
               newField: [true]
            })
         })
      }
   }

   /**
    * To initialize carrier rider
    * @param element
    */
   initCarrierRider(element?) {
      if (element) {
         if (typeof element === 'object') {
            return this._fb.group({
               id: element[CommonConstant.PLAIN_ID],
               rider: element[CarrierConstant.CARRIER_RIDER_ID],
               newField: false
            });
         }
      } else {
         return this._fb.group({
            id: [''],
            rider: [''],
            newField: [true]
         });
      }
   }

   /**
    * To intialize policy commission
    * @param commValue
    */
   initPolicyComm(commValue?) {
      if (commValue && typeof commValue === 'object') {
         return this._fb.group({
            id: commValue[CommonConstant.PLAIN_ID],
            planTerm: commValue[CommonConstant.PLAIN_ID],
            range: commValue[CarrierConstant.RANGE],
            year: commValue[CarrierConstant.YEAR],
            fromMonth: commValue[CarrierConstant.FROM_DATE_MONTH],
            fromYear: commValue[CarrierConstant.FROM_DATE_YEAR],
            toMonth: commValue[CarrierConstant.TO_DATE_MONTH],
            toYear: commValue[CarrierConstant.TO_DATE_YEAR],
            commissionRate: commValue[CarrierConstant.COMMISSION_RATE],
            commissionTerm: commValue[CarrierConstant.COMMISSION_TERM],
            commissionTermMonth: [''],
            commissionTermYear: [''],
            newField: false,
            rateList: this._fb.array([
               this.initializeRates()
            ]),
         })
      } else {
         return this._fb.group({
            id: [''],
            planTerm: [''],
            range: [''],
            year: [''],
            fromMonth: [''],
            fromYear: [''],
            toMonth: [''],
            toYear: [''],
            commissionTerm: [''],
            commissionTermMonth: [''],
            commissionTermYear: [''],
            newField: [true],
            rateList: this._fb.array([
               this.initializeRates()
            ]),
         })
      }
   }

   /**
    * To change date format for my date picker
    * @param value
    */
   public displayDateFormatMyDatePicker(value) {
      if (value != null && value !== '') {
         let month;
         let year;
         let date;
         month = moment(value).month();
         month = ('0' + (month + 1)).slice(-2);
         year = moment(value).year();
         date = moment(value).date();
         date = ('0' + (date)).slice(-2);
         const res = {
            date: {
               year: parseInt(year, 10),
               month: parseInt(month, 10),
               day: parseInt(date, 10)
            }
         }
         return res;
      }
      return value;
   }

   /**
    * To initialize rateList for policy commission form
    * @param commRate
    * @param subCommRate
    */
   initializeRates(commRate?, subCommRate?) {
      if (commRate && Object.keys(commRate).length > 0) {
         let effectiveDate = '', expiryDate = '';
         if (commRate[CarrierConstant.EFFECTIVE_DATE]) {
            effectiveDate = this.displayDateFormatMyDatePicker(commRate[CarrierConstant.EFFECTIVE_DATE]);
         }
         if (commRate[CarrierConstant.EFFECTIVE_DATE]) {
            expiryDate = this.displayDateFormatMyDatePicker(commRate[CarrierConstant.EXPIRAY_DATE]);
         }
         let subTermMonth = false, termMonth = false;
         if (subCommRate[CarrierConstant.FROM_DATE_MONTH]) {
            subTermMonth = true;
         }
         if (commRate[CarrierConstant.FROM_DATE_MONTH]) {
            termMonth = true;
         }

         let disabled = false;
         if (commRate[CommonConstant.POLICY_COUNT] > 0) {
            disabled = true;
         } else {
            disabled = false;
         }
         return this._fb.group({
            id: commRate[CommonConstant.PLAIN_ID],
            subTermMonth: [{ value: subTermMonth, disabled: disabled }],
            subTermRange: subCommRate[CarrierConstant.RANGE],
            subTermYear: subCommRate[CarrierConstant.YEAR],
            subTermFromMonth: [{ value: subCommRate[CarrierConstant.FROM_DATE_MONTH], disabled: disabled }],
            subTermFromYear: [{ value: subCommRate[CarrierConstant.FROM_DATE_YEAR], disabled: disabled }],
            subTermToMonth: [{ value: subCommRate[CarrierConstant.TO_DATE_MONTH], disabled: disabled }],
            subTermToYear: [{ value: subCommRate[CarrierConstant.TO_DATE_YEAR], disabled: disabled }],
            termMonth: [{ value: termMonth, disabled: disabled }],
            range: commRate[CarrierConstant.RANGE],
            year: commRate[CarrierConstant.YEAR],
            fromMonth: [{ value: commRate[CarrierConstant.FROM_DATE_MONTH], disabled: disabled }],
            fromYear: [{ value: commRate[CarrierConstant.FROM_DATE_YEAR], disabled: disabled }],
            toMonth: [{ value: commRate[CarrierConstant.TO_DATE_MONTH], disabled: disabled }],
            toYear: [{ value: commRate[CarrierConstant.TO_DATE_YEAR], disabled: disabled }],
            commissionRate: commRate[CarrierConstant.COMMISSION_RATE],
            effectiveDate: effectiveDate,
            maturityDate: expiryDate,
            remark: commRate[CarrierConstant.REMARK],
            status: commRate[CommonConstant.STATUS],
            policyCount: commRate[CommonConstant.POLICY_COUNT],
            newField: false
         });
      } else {
         return this._fb.group({
            id: [''],
            subTermMonth: [false],
            subTermRange: [false],
            subTermYear: [''],
            subTermFromMonth: [''],
            subTermFromYear: [''],
            subTermToMonth: [''],
            subTermToYear: [''],
            termMonth: [false],
            range: [false],
            year: [''],
            fromMonth: [''],
            fromYear: [''],
            toMonth: [''],
            toYear: [''],
            commissionRate: [''],
            effectiveDate: [''],
            maturityDate: [''],
            remark: [''],
            status: [false],
            policyCount: [0],
            newField: [true]
         });
      }
   }

   /**
    * To initialize rider commission
    * @param commValue
    * @param commKey
    */
   initRiderComm(commValue?, commKey?) {
      if (commValue && typeof commValue === 'object') {
         return this._fb.group({
            id: commValue[CommonConstant.PLAIN_ID],
            riderTerm: commValue[CommonConstant.PLAIN_ID],
            range: commValue[CarrierConstant.RANGE],
            year: commValue[CarrierConstant.YEAR],
            fromMonth: commValue[CarrierConstant.FROM_DATE_MONTH],
            fromYear: commValue[CarrierConstant.FROM_DATE_YEAR],
            toMonth: commValue[CarrierConstant.TO_DATE_MONTH],
            toYear: commValue[CarrierConstant.TO_DATE_YEAR],
            commissionRate: commValue[CarrierConstant.COMMISSION_RATE],
            // commissionTerm: commValue[CarrierConstant.COMMISSION_TERM],
            newField: false,
            rateList: this._fb.array([
               this.initializeRates()
            ]),
         })
      } else {
         return this._fb.group({
            id: [''],
            riderTerm: [''],
            range: [''],
            year: [''],
            fromMonth: [''],
            fromYear: [''],
            toMonth: [''],
            toYear: [''],
            commissionRate: [''],
            // commissionTerm: [''],
            newField: [true],
            rateList: this._fb.array([
               this.initializeRates()
            ]),
         })
      }
   }

   /**
    * To initialize a rider
    * @param riderValue
    */
   initRider(riderValue?) {
      if (riderValue) {
         let riderName = '';
         if (riderValue['name']) {
            riderName = riderValue['name'];
         }
         if (riderValue['rider']) {
            riderName = riderValue['rider'];
         }
         return this._fb.group({
            riderName: riderName,
            riderId: riderValue['id'],
            carrierRiderId: riderValue['carrierRiderId'],
            commissionList: this._fb.array([
               this.initRiderComm()
            ])
         })
      } else {
         return this._fb.group({
            riderName: [''],
            riderId: [''],
            carrierRiderId: [''],
            commissionList: this._fb.array([
               this.initRiderComm()
            ])
         })
      }
   }

   /**
    * To initialize rateList array for rider commission form
    * @param commRate
    */
   initializeRiderRates(commRate?) {
      if (commRate && Object.keys(commRate).length > 0) {
         let effectiveDate = '';
         if (commRate[CarrierConstant.EFFECTIVE_DATE]) {
            effectiveDate = this.displayDateFormatMyDatePicker(commRate[CarrierConstant.EFFECTIVE_DATE]);
         }
         return this._fb.group({
            id: commRate[CommonConstant.PLAIN_ID],
            range: commRate[CarrierConstant.RANGE],
            year: commRate[CarrierConstant.YEAR],
            fromMonth: commRate[CarrierConstant.FROM_DATE_MONTH],
            fromYear: commRate[CarrierConstant.FROM_DATE_YEAR],
            toMonth: commRate[CarrierConstant.TO_DATE_MONTH],
            toYear: commRate[CarrierConstant.TO_DATE_YEAR],
            commissionRate: commRate[CarrierConstant.COMMISSION_RATE],
            effectiveDate: effectiveDate,
            remark: commRate[CarrierConstant.REMARK],
            status: commRate[CommonConstant.STATUS],
            newField: false
         })
      } else {
         return this._fb.group({
            id: [''],
            range: [false],
            year: [''],
            fromMonth: [''],
            fromYear: [''],
            toMonth: [''],
            toYear: [''],
            commissionRate: [''],
            effectiveDate: [''],
            remark: [''],
            status: [false],
            newField: [true]
         })
      }
   }

   /**
    * To patch values in commission rate table
    * @param commRate
    */
   patchCommissionRateValue(commRate) {
      return this._fb.group({
         id: [''],
         subTermMonth: [commRate.subTermMonth],
         subTermRange: [commRate.subTermRange],
         subTermYear: [commRate.subTermYear],
         subTermFromMonth: [commRate.subTermFromMonth],
         subTermFromYear: [commRate.subTermFromYear],
         subTermToMonth: [commRate.subTermToMonth],
         subTermToYear: [commRate.subTermToYear],
         termMonth: [commRate.termMonth],
         range: [commRate.range],
         year: [commRate.year],
         fromMonth: [commRate.fromMonth],
         fromYear: [commRate.fromYear],
         toMonth: [commRate.toMonth],
         toYear: [commRate.toYear],
         commissionRate: [commRate.commissionRate],
         effectiveDate: [commRate.effectiveDate],
         maturityDate: [commRate.maturityDate],
         remark: [commRate.remark],
         status: [false],
         policyCount: [0],
         newField: [true]
      });
   }

   /**
    * To group commission list
    * @param any[] arr
    */
   groupCommissionList(arr: any[]) {
      const tempArray: any[] = [];
      const arrayMetaData: any = {};
      arr.forEach(element => {
         if (!element.subTermFromYear) {
            element.subTermFromYear = Number(element.subTermFromYear);
         }
         if (!element.subTermFromMonth) {
            element.subTermFromMonth = Number(element.subTermFromMonth);
         }
         if (!element.subTermToYear) {
            element.subTermToYear = Number(element.subTermToYear);
         }
         if (!element.subTermToMonth) {
            element.subTermToMonth = Number(element.subTermToMonth);
         }
         const key = element.subTermFromYear + '_' + element.subTermFromMonth + '_' + element.subTermToYear + '_' + element.subTermToMonth;
         if (arrayMetaData[key]) {
            arrayMetaData[key]['subTermList'].push(element);
         } else {
            const obj: any = {};
            obj['subTerm'] = element;
            obj['subTermList'] = [];
            obj['subTermList'].push(element);
            arrayMetaData[key] = obj;
         }
      });
      return arrayMetaData;
   }


   /**
    * To set carrier source data
    * This function is used to differentiate whether carrier data is coming through
    * everest app or coming through scraped(aca platform)
    * @param flag
    */
   setCarrierSourceFlag(flag: string) {
      let carrierData: any = {};
      carrierData['carrierFlag'] = flag;

      carrierData = JSON.stringify(carrierData);
      localStorage.setItem('carrierSourceData', carrierData);
   }

   /**
    * To remove carrier source flag from localstorage
    */
   removeCarrierSourceFlag() {
      localStorage.removeItem('carrierSourceData');
   }

   /**
    * To get carrier source flag
    */
   getCarrierSourceFlag() {
      let carrierData = localStorage.getItem('carrierSourceData');
      if (carrierData) {
         carrierData = JSON.parse(carrierData);
         return carrierData['carrierFlag'];
      }
   }

   /**
    * To set scraped carrier data
    * @param data
    */
   setCarrierScrapedData(data: any) {
      let carrierData: any = {};
      carrierData = data;
      carrierData = JSON.stringify(carrierData);
      localStorage.setItem('scrapedCarrierData', carrierData)
   }

   /**
    * To get scraped carrier data
    */
   getCarrierScrapedData() {
      let carrierData = localStorage.getItem('scrapedCarrierData');
      if (carrierData) {
         carrierData = JSON.parse(carrierData);
         return carrierData;
      } else {
         return '';
      }
   }

   /**
    * To get scraped carrier ID
    */
   getScrapedCarrierId() {
      let carrierData = localStorage.getItem('scrapedCarrierData');
      if (carrierData) {
         carrierData = JSON.parse(carrierData);
         return carrierData['carrierData']['id'];
      } else {
         return '';
      }
   }

   /**
    * To set scraped carrier plan data
    * @param any data
    */
   setCarrierPlanScrapedData(data: any) {
      let carrierData: any = {};
      carrierData = data;
      carrierData = JSON.stringify(carrierData);
      localStorage.setItem('scrapedCarrierPlanData', carrierData)
   }

   /**
    * To get scraped carrier plan data
    */
   getCarrierPlanScrapedData() {
      let carrierData = localStorage.getItem('scrapedCarrierPlanData');
      if (carrierData) {
         carrierData = JSON.parse(carrierData);
         return carrierData;
      } else {
         return '';
      }
   }
}
