import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from '@modules/main/main.component';
import {BlankComponent} from '@pages/blank/blank.component';
import {LoginComponent} from '@modules/login/login.component';
import {ProfileComponent} from '@pages/profile/profile.component';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {AuthGuard} from '@guards/auth.guard';
import {NonAuthGuard} from '@guards/non-auth.guard';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {PrivacyPolicyComponent} from '@modules/privacy-policy/privacy-policy.component';
import {MainMenuComponent} from '@pages/main-menu/main-menu.component';
import {SubMenuComponent} from '@pages/main-menu/sub-menu/sub-menu.component';
import { CompanyComponent } from './company/company.component';
import { DeviceComponent } from './device/device.component';
import { UploadComponent } from './upload/upload.component';
import { Error404Component } from './error404/error404.component';

const routes: Routes = [

    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                component: DashboardComponent,
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'blank',
                component: BlankComponent
            },
            {
                path: 'sub-menu-1',
                component: SubMenuComponent
            },
            {
                path: 'sub-menu-2',
                component: BlankComponent
            },
            {
                path: 'company',
                component: CompanyComponent
            },
            {
                path: 'device',
                component: DeviceComponent
            },
            {
                path: 'upload',
                component: UploadComponent
            },
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'recover-password',
        component: RecoverPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        canActivate: [NonAuthGuard]
    },
    {path: '**', component: Error404Component}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
