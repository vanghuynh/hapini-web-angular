import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AddressService } from '@app/core/services/address.service';
import { HouseService } from '@app/core/services/house.service';
import { IUserPassword } from '@app/model/interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpEvent, HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import endpoints from '../../app.endpoints';
import { AuthenticationService } from "@app/core/authentication/authentication.service";
import { UserService } from '@app/core/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { I18nService } from '@app/core';

@Component({
  selector: 'reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent implements OnInit {

  resetPasswordForm: FormGroup;
  userId: string;
  code: string;
  userPassword: IUserPassword;
  userName: string;
  
  constructor(private houseService: HouseService,
    private fb: FormBuilder,
    private HttpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private addressService: AddressService,
    private userService: UserService,
    private matSnackBar: MatSnackBar,
    private i18nService: I18nService) {
      this.activatedRoute.params.forEach((params: Params) => {
        console.log("params: ", params);
        this.userId = params['userId'];
        this.code = params['code'];
      });
      this.resetPasswordForm = this.fb.group({
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        //phone: ['', Validators.required],
        agree: false
      });
  }

  ngOnInit() {
    console.log("Input params: ", this.userId, this.code);
    this.initUserPassword();
    this.userService.getUserForResetPassword(this.userId, this.code).subscribe(data => {
      this.userPassword = data;
      this.userName = this.userPassword.username;
      console.log("Response data userPassword: ",data, this.userPassword);
    }, err => {
      console.log("Error getting user: ", err);
    });
  }

  private initUserPassword(){
    this.userPassword = {
      username: "",
      newPassword: "",
      confirmPassword: "",
      phone: "",
      agree: false
    };
  }
  onSubmit() {
    this.userPassword.newPassword = this.resetPasswordForm.value.newPassword;
    this.userPassword.confirmPassword = this.resetPasswordForm.value.confirmPassword;
    //this.userPassword.phone = this.resetPasswordForm.value.phone;
    this.userPassword.agree = this.resetPasswordForm.value.agree;
    this.userPassword.code = this.code;
    console.log("Reset password: ", this.userPassword);
    this.userService.resetUserPassword(this.userPassword).subscribe(username => {
      console.log("User password changed: ", username);
      this.authenticationService.logout().subscribe(res => {
        this.matSnackBar.open(this.i18nService.instant("common.passwordChanged"), this.i18nService.instant("common.close"), {
          duration: 2000,
        });
        this.router.navigate(['/login'], { replaceUrl: true });
      });
    }, err => {
      console.log("Error create user", err);
    });
  }
}
