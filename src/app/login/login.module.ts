import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './user-login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { ForgetPassComponent } from './forget-pass/forget-pass.component';
import { ConfirmPassComponent } from './confirm-pass/confirm-pass.component';
import { UserSettingComponent } from './user-setting/user-setting.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    LoginRoutingModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ChangePassComponent,
    ResetPassComponent,
    ForgetPassComponent,
    ConfirmPassComponent,
    UserSettingComponent
  ]
})
export class LoginModule { }
