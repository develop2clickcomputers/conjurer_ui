import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignupComponent } from './signup.component';

const SignupRoutes: Routes = [
    {
        path: 'signup', component: SignupComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(SignupRoutes)
    ],
    exports: [RouterModule]
})
export class SignupAppRoutingModule {

}