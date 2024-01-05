import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guards';
import { InvestmentComponent } from './investment.component';

const InvestmentRoutes: Routes = [
    {
        path: 'investment', component: InvestmentComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(InvestmentRoutes)
    ],
    exports: [RouterModule]
})
export class InvestmentAppRoutingModule {  }
