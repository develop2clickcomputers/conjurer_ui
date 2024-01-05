import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BatchReportComponent } from './batch-report.component';

export const BatchReportRoutes: Routes = [
    {
        path: 'batchreport', component: BatchReportComponent
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(BatchReportRoutes)
    ],
    exports: [RouterModule]
})
export class BatchReportAppRoutingModule {  }
