import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guards';
import { RepositoryComponent } from './repository.component';
import { StatementRepositoryRoutes } from './statement-repository/statement-repository.routes';
import { XMLRoutes } from './xmlfile/xmlfile.routes';
import { FactFinderRoutes } from './fact-finder/fact-finder.routes';
import { BatchReportRoutes } from './batch-report/batch-report.routes';

const RepositoryRoutes: Routes = [
    {
        path: 'repo', component: RepositoryComponent,
        canActivate: [AuthGuard],
        children: [
            ...StatementRepositoryRoutes,
            ...XMLRoutes,
            ...FactFinderRoutes,
            ...BatchReportRoutes
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(RepositoryRoutes)
    ],
    exports: [RouterModule]
})
export class RepositoryAppRoutingModule {  }
