import { NgModule } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

import { CurrencySymbol } from '../../shared/currency-symbol';

/**
 * To validate value
 */
@Pipe({
    name: 'ValidateValue'
})
export class ValidateValuePipe implements PipeTransform {
    transform(value: any) {
        if (value === '' || value === 'No Data' || value === null) {
            return '-';
        } else {
            return value;
        }
    }
}

/**
 * To validate ISIN
 */
@Pipe({
    name: 'ValidateISIN'
})
export class ValidateISINPipe implements PipeTransform {
    transform(value) {
        if (value === 'tbd') {
            return '-';
        } else {
            return value;
        }
    }
}

/**
 * To validate date
 */
@Pipe({
    name: 'ValidateDate'
})
export class ValidateDatePipe implements PipeTransform {
    transform(value: any, format) {
        if (value === '' || value === 'No Data' || value === null) {
            return '-';
        } else {
            value = moment(value).format(format);
            return value;
        }
    }
}

/**
 * Number format based on currency symbol
 */
@Pipe({ name: 'NumberFormatWithCurrencySymbol' })
export class NumberFormatWithCurrencySymbolPipe implements PipeTransform {
    transform(value: any, fromCurrency: string, fractionSize: number) {
        // console.log(value, fromCurrency, fractionSize);
        if (value === '' || value === 'No Data' || value == null || value === 'tbd') {
            return '-';
        } else {
            if (!isNaN(value)) {
                let targeted_symbol
                if (fromCurrency in CurrencySymbol) {
                    targeted_symbol = CurrencySymbol[fromCurrency];
                } else {
                    targeted_symbol = '';
                }

                let p: any;
                if (fractionSize) {
                    p = parseFloat(value).toFixed(fractionSize).split('.');
                } else {
                    p = parseFloat(value).toFixed(2).split('.');
                }
                return targeted_symbol + '  ' + p[0].split('').reverse().reduce(function (acc, val, i) {
                    return val + (i && !(i % 3) ? ',' : '') + acc;
                }, '') + '.' + p[1];
            }
        }
    }
}

/**
 * Number format
 */
@Pipe({ name: 'NumberFormatWithoutCurrencySymbol' })
export class NumberFormatWithoutCurrencySymbolPipe implements PipeTransform {
    transform(value: any) {
        if (value === '' || value === 'No Data' || value == null || value === 'tbd') {
            return '-';
        } else {
            if (!isNaN(value)) {
                const p = parseFloat(value).toFixed(2).split('.');
                return p[0].split('').reverse().reduce(function (acc, val, i) {
                    return val + (i && !(i % 3) ? ',' : '') + acc;
                }, '') + '.' + p[1];
            }

        }
    }
}

/**
 * Number with zero
 */
@Pipe({ name: 'NumberWithZeroCurrencySymbol' })
export class NumberWithZeroCurrencySymbolPipe implements PipeTransform {
    transform(value: any, fromCurrency) {
        if (!isNaN(value)) {
            let targeted_symbol;
            if (fromCurrency in CurrencySymbol) {
                targeted_symbol = CurrencySymbol[fromCurrency];
            } else {
                targeted_symbol = '';
            }

            const p: any = parseFloat(value).toFixed(2).split('.');

            return targeted_symbol + '  ' + p[0].split('').reverse().reduce(function (acc, val, i) {
                return val + (i && !(i % 3) ? ',' : '') + acc;
            }, '') + '.' + p[1];
        } else {
            return '-';
        }
    }
}

/**
 * Preview pipe module class
 */
@NgModule({
    imports: [],
    declarations: [
        ValidateValuePipe, ValidateDatePipe, NumberFormatWithCurrencySymbolPipe,
        NumberFormatWithoutCurrencySymbolPipe, NumberWithZeroCurrencySymbolPipe,
        ValidateISINPipe
    ],
    exports: [
        ValidateValuePipe, ValidateDatePipe, NumberFormatWithCurrencySymbolPipe,
        NumberFormatWithoutCurrencySymbolPipe, NumberWithZeroCurrencySymbolPipe,
        ValidateISINPipe
    ]
})
export class PreviewPipeModule {  }
