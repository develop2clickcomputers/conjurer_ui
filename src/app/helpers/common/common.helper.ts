import { Injectable } from '@angular/core';

import { CurrencySymbol } from '../../shared/currency-symbol';
import { CommonConstant } from '../../constants/common/common.constant';

import * as moment from 'moment';
import { coutries } from '../common/coutries';

/**
 * Common helper serivce class
 */
@Injectable()
export class CommonHelperService {

    /** xml view data */
    private XMLViewData: any = {};

    /** Regex for username */
    public unamePattern = '^[a-z0-9_-]{8,15}$';

    /** Regex for email */
    public emailPattern = '^[_a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{1,4})$';

    /** Regex for password */
    public pwdPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?&#~^])[A-Za-z\\d$@$!%*?&#~^]{8,20}$';

    /** @ignore */
    constructor() { }

    /**
     * To remove special characters from object
     * @param any object
     */
    public sanitizeDataObject(object: any) {
        if (object) {
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    if (object[key] && isNaN(object[key])) {
                        object[key] = object[key].toString().replace(/[<>%]/g, '');
                    }
                }
            }

            return object;
        }
    }

    /**
     * To set file Name and repo Id
     * @param string id
     * @param string filename
     */
    public setXMLFileViewData(repoId: string, fileName: string) {
        this.XMLViewData = {};
        this.XMLViewData[CommonConstant.REPO_ID] = repoId;
        this.XMLViewData[CommonConstant.NAME] = fileName;
        this.XMLViewData = JSON.stringify(this.XMLViewData);
        sessionStorage.setItem('XMLViewData', this.XMLViewData);
    }

    /**
     * To get xml file view data
     */
    public getXMLFileViewData() {
        let xmlFileData = sessionStorage.getItem('XMLViewData');
        if (xmlFileData) {
            xmlFileData = JSON.parse(xmlFileData);
            return xmlFileData;
        }
        return {};
    }

    /**
     * To get number format with comma
     * @param any x
     */
    public numberWithCommas = (x): any => {
        // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const p = parseFloat(x).toFixed(2).split('.');
        return p[0].split('').reverse().reduce((acc, num, i) => {
            return num + (i && !(i % 3) ? ',' : '') + acc;
        }, '') + '.' + p[1];
    }

    /**
     * For comma separated number ("num" is input number)
     * @param any x
     */
    public formatNumberWithComma(x) {
        const p = x.toFixed(2).split('.');
        return p[0].split('').reverse().reduce((acc, num, i) => {
            return num + (i && !(i % 3) ? ',' : '') + acc;
        }, '') + '.' + p[1];
    }

    /**
     * With dynamic number and fractionSize
     * @param any x
     * @param any fractionSize
     */
    public formatNumber(x, fractionSize?) {
        let p;
        if (fractionSize) {
            p = x.toFixed(fractionSize).split('.');
        } else {
            p = x.toFixed(2).split('.');
        }
        return p[0].split('').reverse().reduce((acc, num, i) => {
            return num + (i && !(i % 3) ? ',' : '') + acc;
        }, '') + '.' + p[1];
    }

    /**
     * Number format
     * @param number n
     */
    numberFormat(n): string {
        let negativeValue: boolean;
        if (Math.sign(n) === -1) {
            n = String(n);
            n = n.replace('-', '');
            negativeValue = true;
        }
        n = parseFloat(n);
        let returnVal;
        returnVal = n.toFixed(2).replace(/./g, function (c, i, a) {
            return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
        });
        if (negativeValue) {
            return '-' + returnVal;
        } else {
            return returnVal;
        }
    }

    /**
     * Convert number lo string
     * @param any number
     */
    numberToLocalstring(number: any) {
        if (number) {
            number = number.toFixed(2).split('.');

            number = number.toLocaleString();
            return number;
        }
        return number;
    }

    /**
     * To get currency symbol
     * @param string fromcurrency
     */
    public toGetCurrencySymbol = (fromcurrency: string) => {
        let targeted_symbol;
        const fromCurrency = fromcurrency;
        if (fromCurrency in CurrencySymbol) {
            targeted_symbol = CurrencySymbol[fromCurrency];
            return targeted_symbol;
        } else {
            targeted_symbol = '';
            return targeted_symbol;
        }
    }

    /**
     * To remove special characters
     * @param string str
     */
    public removeSpecialCharacters(str: string) {
        if (str) {
            str = str.replace(/,/g, '');
        }
        return str;
    }

    /**
     * To store preferred currency
     * @param string curr
     */
    public setPreferredCurrency(curr: string) {
        let userData: any = {};
        if (curr) {
            userData[CommonConstant.PREFERRED_CURRENCY] = curr;

            userData = JSON.stringify(userData);
            sessionStorage.setItem('userData', userData);
        }
    }

    /**
     * To get user preffered currency
     */
    public getUserPreferredCurrency() {
        let userData = sessionStorage.getItem('userData');
        let preferredCurr: string;
        if (userData) {
            userData = JSON.parse(userData);
            preferredCurr = userData[CommonConstant.PREFERRED_CURRENCY];

            return preferredCurr;
        }
    }

    /**
     * To change date format
     * @param value
     * @param format
     */
    public serviceDateFormat(value, format?) {
        if (format) {
            value = moment(value).format(format)
        } else {
            value = moment(value, 'DD-MM-YYYY').format('YYYY-MM-DD');
        }
        return value;
    }

    /**
     * To change date format
     * @param value
     * @param format
     */
    public prepareServiceDate(value: any) {
        if (typeof value === 'object') {
            let requiredDate;
            if (value.hasOwnProperty('date')) {
                let month = value['date'].month;
                month = ('0' + month).slice(-2);
                let date = value['date'].day;
                date = ('0' + (date)).slice(-2);
                requiredDate = value['date'].year + '-' + month + '-' + date;
            }
            return requiredDate;
        }
        return value;
    }

    /**
     * To change date format for my date picker
     * @param value
     * @param format
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
     * To display jquery date format
     * @param value
     * @param format
     */
    public displayJqueryDateFormat(value, format?) {
        if (format) {
            value = moment(value).format(format)
        } else {
            value = moment(value, 'DD-MM-YYYY').format('YYYY-MM-DD');
        }
        return value;
    }

    /**
     * To get current date
     */
    public getCurrentDate() {
        const date = new Date();
        // Disable dates after current date
        date.setDate(date.getDate() + 1);
        const currentDate = {
            year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()
        }
        return currentDate;
    }

    /**
     * To get curent date based on formats
     * @param format
     */
    public getCurrentMomentDate(format?) {
        const currDate = moment();
        if (format) {
            return currDate.format(format);
        }
        return currDate;
    }

    /**
     * To get maturity date based on month
     * @param month
     */
    public getMaturityDate(month) {
        const currDate = moment();
        month = Number(month);
        const matDate = currDate.add(month, 'months');
        const finalDate = matDate.subtract(1, 'days');
        return finalDate;
    }

    /**
     * To get days to populate it into dropdown
     */
    getDayList() {
        const min = 0;
        const max = 30;
        const days: number[] = [];
        for (let i = min; i <= max; i++) {
            days.push(i);
        }

        return days;
    }

    /**
     * To get months to populate it into dropdown
     */
    getMonthList() {
        const min = 0;
        const max = 11;
        const months: number[] = [];
        for (let i = min; i <= max; i++) {
            months.push(i);
        }

        return months;
    }

    /**
     * To get years to populate it into dropdown
     */
    getYearList() {
        const min = 0;
        const max = 99;
        const years: number[] = [];
        for (let i = min; i <= max; i++) {
            years.push(i);
        }

        return years;
    }

    /**
     * To display date format into input field
     * @param date
     */
    public displayDateFormat(date) {
        let month;
        let year;
        let day;
        month = date['month'];
        month = ('0' + (month)).slice(-2);
        year = date['year'];
        day = date['day'];
        day = ('0' + (day)).slice(-2);
        const res = {
            date: {
                year: parseInt(year, 10),
                month: parseInt(month, 10),
                day: parseInt(day, 10)
            }
        }
        return res;
    }

    /**
     * To get current date
     */
    getCurrentDateToDisplay() {
        const date = new Date();
        const currentDate = {
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            }
        }
        return currentDate;
    }

    /**
     * To get currency symbol
     * @param fromcurrency
     */
    public getCurrencySymbol = (fromcurrency) => {
        let targeted_symbol;
        const fromCurrency = fromcurrency;
        if (fromCurrency in CurrencySymbol) {
            targeted_symbol = CurrencySymbol[fromCurrency];
            return targeted_symbol;
        } else {
            targeted_symbol = '';
            return targeted_symbol;
        }
    }

    /**
     * To convert year and month in months
     * @param month
     * @param year
     */
    getConvertedMonth(month, year) {
        month = Number(month);
        year = Number(year);
        let requiredMonth: number;
        requiredMonth = year * 12 + month;
        return requiredMonth;
    }

    /**
     * To create common structure for dropdown to send
     * it into any request structure
     * @param type
     * @param value
     */
    getDropdownRequestStructure(type: any, value: any) {
        const dropdownObj: any = {};
        if (value) {
            dropdownObj[CommonConstant.TYPE] = type;
            dropdownObj[CommonConstant.VALUE] = value;
            return dropdownObj;
        }
        return null;
    }

    /**
   * To create common structure for mudra(currency and amount) to send
   * it into any request structure
   * @param amount
   * @param currency
   */
    getMudraStructure(amount: any, currency: any) {
        const mudraObject: any = {};
        if (amount && currency) {
            mudraObject[CommonConstant.AMOUNT] = amount;
            mudraObject[CommonConstant.CURRENCY] = currency;
            return mudraObject;
        }
        return null;
    }

    /**
     * To check statement date
     * @param obj
     * @param list
     */
    checkForDuplicateValue(obj, list, fieldName) {
        let i;
        for (i = 0; i < list.length; i++) {
            if (list[i][fieldName] === obj[fieldName]) {
                return i;
            }
        }
        return false;
    }

    /**
     * To check statement date
     * @param obj
     * @param list
     */
    checkForDuplicateFieldsValue(obj, list, fieldName1, fieldName2) {
        let i;
        for (i = 0; i < list.length; i++) {
            if (list[i][fieldName1] === obj[fieldName1] && list[i][fieldName2] === obj[fieldName2]) {
                return i;
            }
        }
        return false;
    }

    /**
     * To remove duplicates object form list
     * @param myArr
     * @param prop
     */
    removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }

    /**
     * To get country code
     * @param currencyCode
     */
    getCountryCode(currencyCode: string): string {
        const currency = currencyCode; // coutries
        const filteredCoutries = coutries.filter((element) => {
            return element['currencyCode'] === currency;
        });
        if (filteredCoutries.length > 0) {
            return filteredCoutries[0]['isoAlpha3']
        }
        return '';
    }

    /**
     * To get country symbol
     * @param currencyCode
     */
    getCountrySymbol(countryName: string): string {
        const country = countryName; // coutries
        const filteredCoutries = coutries.filter((element) => {
            return element['countryName'] === country;
        });
        if (filteredCoutries.length > 0) {
            const currecnyCode = filteredCoutries[0]['currencyCode'];
            const currencySymbol = this.getCurrencySymbol(currecnyCode);
            return currencySymbol;
        }
        return '';
    }

    /**
     * To abbreviate number - to format number
     * @param value
     */
    abbreviateNumber(value) {
        let newValue = value;
        if (value >= 1000) {
            value = parseInt(value, 10);
            const suffixes = ['', 'K', 'M', 'B', 'T'];
            const suffixNum = Math.floor(('' + value).length / 3);
            let shortValue: number;
            for (let precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
                const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
                if (dotLessShortValue.length <= 2) { break; }
            }
            if (shortValue % 1 !== 0) {
                shortValue = Number(shortValue.toFixed(1));
            };
            newValue = shortValue + suffixes[suffixNum];
        } else {
            newValue = this.formatNumberWithComma(newValue);
        }
        return newValue;
    }
}

