import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthorisedHeaderModule } from '../header/authorised-header.module';
import { AuthorisedFooterModule } from '../footer/authorised-footer.module';
import { CommonHelperService } from '../helpers/common/common.helper';

import { XMLViewerComponent } from './xml-viewer.component';
import { XMLViewerAppRoutingModule } from './xml-viewer.routes';
import { SharedModule } from '../shared/shared.module';

/**
 * XML viewer module class
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AuthorisedHeaderModule,
    AuthorisedFooterModule,
    SharedModule,
    XMLViewerAppRoutingModule
  ],
  declarations: [XMLViewerComponent],
  exports: [XMLViewerComponent],
  providers: [CommonHelperService]
})
export class XmlViewerModule { }
