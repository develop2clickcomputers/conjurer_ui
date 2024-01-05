import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RepositoryComponent } from './repository.component';
import { RepositoryAppRoutingModule } from './repository.routes';
import { StatementRepositoryModule } from './statement-repository/statement-repository.module';
import { XmlfileModule } from './xmlfile/xmlfile.module';
import { FactFinderModule } from './fact-finder/fact-finder.module';
import { BatchReportModule } from './batch-report/batch-report.module';

/**
 * Repository module class
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    StatementRepositoryModule,
    XmlfileModule,
    FactFinderModule,
    BatchReportModule,
    RepositoryAppRoutingModule
  ],
  declarations: [RepositoryComponent],
  exports: [RepositoryComponent]
})
export class RepositoryModule { }
