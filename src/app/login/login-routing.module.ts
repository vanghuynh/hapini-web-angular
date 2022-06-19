import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core';
import { LoginComponent } from './user-login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { ForgetPassComponent } from './forget-pass/forget-pass.component';
import { ConfirmPassComponent } from './confirm-pass/confirm-pass.component';
import { UserSettingComponent } from './user-setting/user-setting.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: extract('Login') } },
  Shell.childRoutesWithoutAuth([
    { path: 'register', component: RegisterComponent, data: { title: extract('Register') } }
  ]),
  Shell.childRoutesWithoutAuth([
    { path: 'forgetpass', component: ForgetPassComponent, data: { title: extract('Forget Password') } }
  ]),
  Shell.childRoutesWithoutAuth([
    { path: 'resetpass/:userId/:code', component: ResetPassComponent, data: { title: extract('Reset Password') } }
  ]),
  Shell.childRoutesWithoutAuth([
    { path: 'confirmpass/:code', component: ConfirmPassComponent, data: { title: extract('Confirmation') } }
  ]),
  Shell.childRoutes([
    { path: 'changepass', component: ChangePassComponent, data: { title: extract('Change Password') } }
  ]),
  Shell.childRoutes([
    { path: 'usersetting', component: UserSettingComponent, data: { title: extract('User Setting') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LoginRoutingModule { }
