import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guards';
import { BudgetComponent } from './budget.component';

export const BudgetRoutes: Routes = [
    {
        path: 'budget', component: BudgetComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(BudgetRoutes)
    ],
    exports: [RouterModule]
})
export class BudgetAppRoutingModule {  }
