import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent, ResetPasswordComponent } from './forgot-password.component';

const ForgotPasswordRoutes: Routes = [
    {
        path: 'forgotpassword', component: ForgotPasswordComponent
    },
    {
        path: 'resetpassword/:username/:timestamp', component: ResetPasswordComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(ForgotPasswordRoutes)
    ],
    exports: [RouterModule]
})
export class AppForgotPasswordRoutinModule {  }
