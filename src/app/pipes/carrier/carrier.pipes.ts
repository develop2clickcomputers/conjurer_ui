import { NgModule } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Carrier search Pipes
 */
@Pipe({
   name: 'carrierSearchFilter',
   pure: false
})
export class CarrierSearchFilterPipe implements PipeTransform {
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
            for (const key in item['carrierData']) {
               if (item['carrierData'].hasOwnProperty(key)) {
                  let term = item['carrierData'][key];
                  if (term != null && !isFound) {
                     if (typeof term === 'string') {
                        term = term.toLowerCase();
                        searchFilter.forEach(searchstring => {
                           searchstring = searchstring.toLowerCase();
                           if (searchstring !== '' && term.indexOf(searchstring) !== -1 && !isFound) {
                              result.push(item);
                              isFound = true;
                           }
                        })
                     }
                  }
               }
            }
            /* item.forEach((term, key) => {
               if (term != null && !isFound) {
                  term = term.toString();
                  term = term.toLowerCase();
                  searchFilter.forEach(searchstring => {
                     searchstring = searchstring.toLowerCase();
                     if (searchstring !== '' && term.indexOf(searchstring) !== -1 && !isFound) {
                        result.push(item);
                        isFound = true;
                     }
                  })
               }
            }) */
         })
         return result;
      } else {
         return items;
      }
   }
}

/**
 * Carrier pipe module class
 */
@NgModule({
   imports: [],
   declarations: [
      CarrierSearchFilterPipe
   ],
   exports: [
      CarrierSearchFilterPipe
   ]
})
export class CarrierPipeModule { }
