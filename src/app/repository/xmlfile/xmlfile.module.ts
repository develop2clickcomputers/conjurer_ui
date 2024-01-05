import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonPipeModule } from '../../pipes/common/common.pipes';
import { PreviewPipeModule } from '../../pipes/preview/preview.pipes';

import { XmlfileComponent } from './xmlfile.component';
import { AuthorisedHeaderModule } from '../../header/authorised-header.module';
import { AuthorisedFooterModule } from '../../footer/authorised-footer.module';
import { Review } from '../../helpers/review/review';

/**
 * XML file module class
 */
@NgModule({
  imports: [
    CommonModule,
    AuthorisedHeaderModule,
    AuthorisedFooterModule,
    CommonPipeModule,
    PreviewPipeModule
  ],
  declarations: [XmlfileComponent],
  exports: [XmlfileComponent],
  providers: [Review]
})
export class XmlfileModule { }
