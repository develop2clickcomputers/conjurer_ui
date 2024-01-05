import { NgModule } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

import * as moment from 'moment';
import { CurrencySymbol } from '../../shared/currency-symbol';

/** @ignore */
const PADDING = '000000';

/**
 * Currency symbol pipe
 */
@Pipe({
    name: 'currencySymbol'
})
export class CurrencySymbolPipe implements PipeTransform {
    transform(value: any, fromCurrency: string) {
        let targeted_symbol: any;
        if (fromCurrency in CurrencySymbol) {
            targeted_symbol = CurrencySymbol[fromCurrency];
        } else {
            targeted_symbol = '';
        }
        return targeted_symbol + '  ' + value;
    }
}

/**
 * Date format pipe based on format given
 */
@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
    transform(value: any, format: string) {
        if (value && format) {
            value = moment(value).format(format);
        }
        return value;
        /* const myMoment: moment.Moment = moment(value).format(format);
        return myMoment; */
    }
}

/**
 * Date format pipe
 */
@Pipe({
    name: 'dateFormatNew'
})
export class DateFormatNewPipe implements PipeTransform {
    transform(value: any, format: string) {
        value = moment(value).format(format);
        return value;
        /* const myMoment: moment.Moment = moment(value).format(format);
        return myMoment; */
    }
}

/**
 * Pipe to replace special character from input fields
 */
@Pipe({
    name: 'filterInputValue',
    pure: false
})
export class FilterInputValue implements PipeTransform {
    transform(value: any, obj: any) {
        if (value) {
            value = value.replace(/[<>%]/g , '');
            return value;
        } else {
            return value;
        }
    }
}

/**
 * Safe html pipe
 */
@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

/**
 * Pipe for list of items
 */
@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any, term: any): any {
        if (term === undefined) {
            return items;
        }
        return items.filter((item) => {
            for (const property in item) {
                if (item[property] === null) {
                    continue;
                }
                if (item[property].toString().toLowerCase().includes(term.toLowerCase())) {
                    return true;
                }
            }
            return false;
        });
    }
}

/**
 * Table filter
 */
@Pipe({
    name: 'tablefilter',
    pure: false
})
export class TableFilterPipe implements PipeTransform {
    transform(items, filter) {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter((item) => this.applyFilter(item, filter));
    }

    applyFilter(item, filter): boolean {
        for (const field in filter) {
            if (filter[field]) {
                if (typeof filter[field] === 'string') {
                    if (item[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
                        return false;
                    }
                } else if (typeof filter[field] === 'number') {
                    if (item[field] !== filter[field]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}

/**
 * Pipe for multi search
 */
@Pipe({
    name: 'searchFilter',
    pure: false
})
export class SearchFilterPipe implements PipeTransform {
    transform(items: any, searchFilter: any) {
        let isSearchFilterEmpty = true;
        searchFilter.forEach(searchstring => {
            if (searchstring != null && searchstring !== '') {
                isSearchFilterEmpty = false;
            }
        });
        if (!isSearchFilterEmpty) {
            const result: any = [];
            items.forEach(item => {
                let isFound = false;
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        let term = item[key];
                        if (term != null && !isFound) {
                            term = term.toString();
                            term = term.toLowerCase();
                            searchFilter.forEach(searchstring => {
                                searchstring = searchstring.toLowerCase().trim();
                                if (searchstring !== '' && term.indexOf(searchstring) !== -1 && !isFound) {
                                    result.push(item);
                                    isFound = true;
                                }
                            })
                        }
                    }
                }
            })
            return result;
        } else {
            return items;
        }
    }
}

/**
 * Search extact word
 */
@Pipe({
    name: 'exactSearchFilter',
    pure: false
})
export class ExactSearchFilterPipe implements PipeTransform {
    transform(items: any, searchFilter: any) {
        let isSearchFilterEmpty = true;
        searchFilter.forEach(searchstring => {
            if (searchstring != null && searchstring !== '') {
                isSearchFilterEmpty = false;
            }
        });
        if (!isSearchFilterEmpty) {
            const result: any = [];
            items.forEach(item => {
                let isFound = false;
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        let term = item[key];
                        if (term != null && !isFound) {
                            term = term.toString();
                            term = term.toLowerCase();
                            searchFilter.forEach(searchstring => {
                                searchstring = searchstring.toLowerCase().trim();
                                if (searchstring !== '' && term === searchstring && !isFound) {
                                    result.push(item);
                                    isFound = true;
                                }
                            })
                        }
                    }
                }
            })
            return result;
        } else {
            return items;
        }
    }
}

/**
 * Group By pipe
 */
@Pipe({
    name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
  transform(value: Array<any>, field: string): Array<any> {
    const groupedObj = value.reduce((prev, cur) => {
      if (!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(
        key => {
            return {
                key, value: groupedObj[key]
            }
        });
  }
}

/**
 * Pipe to display data when value is not there
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
 * Standard date format
 */
@Pipe({
    name: 'standardDateFormat'
})
export class StandardDateFormatPipe implements PipeTransform {
    transform(value: any) {
        if (value) {
            value = moment(value).format('DD MMM YYYY');
        }
        return value;
    }
}

/**
 * To validate table value
 */
@Pipe({
    name: 'ValidateTableValue'
})
export class ValidatetableValuePipe implements PipeTransform {
    transform(value: any) {
        if (value === '' || value === 'No Data' || value === null) {
            return '-';
        } else {
            return value;
        }
    }
}

/**
 * Currency pipe
 */
@Pipe({
    name: 'myCurrency'
})
export class MyCurrencyPipe implements PipeTransform {

    private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;

    constructor() {
        // TODO comes from configuration settings
        this.DECIMAL_SEPARATOR = '.';
        this.THOUSANDS_SEPARATOR = ',';
    }

    transform(value: number | string, fractionSize: number = 2): string {
        let [integer, fraction = ''] = (value || '').toString()
            .split(this.DECIMAL_SEPARATOR);

        fraction = fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : '';

        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

        return integer + fraction;
    }

    parse(value: string, fractionSize: number = 2): string {
        let [integer, fraction = ''] = (value || '').split(this.DECIMAL_SEPARATOR);

        integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, 'g'), '');

        fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : '';

        return integer + fraction;
    }

}

/**
 * Common pipe module class
 */
@NgModule({
    imports: [],
    declarations: [
        CurrencySymbolPipe, DateFormatPipe, FilterPipe, SearchFilterPipe, FilterInputValue, SafeHtmlPipe,
        GroupByPipe, DateFormatNewPipe, TableFilterPipe, ValidateValuePipe, StandardDateFormatPipe,
        MyCurrencyPipe, ValidatetableValuePipe, ExactSearchFilterPipe
    ],
    exports: [
        CurrencySymbolPipe, DateFormatPipe, FilterPipe, SearchFilterPipe, FilterInputValue, SafeHtmlPipe,
        GroupByPipe, DateFormatNewPipe, TableFilterPipe, ValidateValuePipe, StandardDateFormatPipe,
        MyCurrencyPipe, ValidatetableValuePipe, ExactSearchFilterPipe
    ]
})
export class CommonPipeModule {  }
