import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import {WelcomeComponent} from '@app/pages/login/welcome/welcome.component';
import {LogedinGuard} from '@core/guard/logedin.guard';
import {NoUserGuard} from '@core/guard/no-user.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
    canActivate: [NoUserGuard]
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [LogedinGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
