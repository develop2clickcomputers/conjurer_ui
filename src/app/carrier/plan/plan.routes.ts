import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanComponent } from './plan.component';

import { PolicyInformationRoutes } from '../../carrier/policy-information/policy-information.routes';
import { RiderCommissionRoutes } from '../../carrier/rider-commission/rider-commission.routes';

export const PlanRoutes: Routes = [
    {
        path: 'plan', component: PlanComponent,
        children: [
            {path: '', redirectTo: 'policy-information', pathMatch: 'full'},
            ...PolicyInformationRoutes,
            ...RiderCommissionRoutes
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(PlanRoutes)
    ],
    exports: [RouterModule]
})
export class RiderAppRoutingModule {  }
