import { NgModule } from '@angular/core';

import { AuthorisedFooterComponent } from './authorised-footer.component';

/**
 * After login footer module
 */
@NgModule({
    imports: [],
    declarations: [AuthorisedFooterComponent],
    exports: [AuthorisedFooterComponent]
})
export class AuthorisedFooterModule {  }
