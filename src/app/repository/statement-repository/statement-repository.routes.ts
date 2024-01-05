import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StatementRepositoryComponent } from './statement-repository.component';

export const StatementRepositoryRoutes: Routes = [
    {
        path: 'statementrepository', component: StatementRepositoryComponent
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(StatementRepositoryRoutes)
    ],
    exports: [RouterModule]
})
export class StatementRepositoryAppRoutingModule {  }
