import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guards';

import { CarrierComponent } from './carrier.component';
import { ContactInformationRoutes } from './carrier-information/carrier-information.routes';
import { PolicyInformationRoutes } from './policy-information/policy-information.routes';
import { RiderCommissionRoutes } from './rider-commission/rider-commission.routes';
import { PlanRoutes } from './plan/plan.routes';

export const CarrierRoutes: Routes = [
    {
        path: 'carriers', component: CarrierComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', redirectTo: 'carrier-information', pathMatch: 'full'},
            ...ContactInformationRoutes,
            ...PolicyInformationRoutes,
            ...RiderCommissionRoutes,
            ...PlanRoutes
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(CarrierRoutes)
    ],
    exports: [RouterModule]
})
export class CarrierAppRoutingModule {  }
