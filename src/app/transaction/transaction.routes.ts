import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guards';
import { TransactionComponent } from './transaction.component';

export const TransactionRoutes: Routes = [
    {
        path: 'transaction', component: TransactionComponent,
        canActivate: [AuthGuard]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(TransactionRoutes)
    ],
    exports: [RouterModule]
})
export class TransactionAppRoutingModule { }
