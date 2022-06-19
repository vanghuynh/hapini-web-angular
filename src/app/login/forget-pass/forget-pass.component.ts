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
  selector: 'forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss']
})
export class ForgetPassComponent implements OnInit {

  forgetPasswordForm: FormGroup;
  userId: string;
  code: string;
  userPassword: IUserPassword;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private matSnackBar: MatSnackBar,
    private i18nService: I18nService) {
      this.forgetPasswordForm = this.fb.group({
        username: ['', Validators.required],
        phone: ['', Validators.required],
        agree: false
      });
  }

  ngOnInit() {
    this.initUserPassword();
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
    this.userPassword.username = this.forgetPasswordForm.value.username;
    this.userPassword.phone = this.forgetPasswordForm.value.phone;
    this.userPassword.agree = this.forgetPasswordForm.value.agree;
    console.log("Forget password: ", this.userPassword);
    this.userService.forgetUserPassword(this.userPassword).subscribe(username => {;
      console.log("User forgot password request: ", username);
      this.matSnackBar.open(this.i18nService.instant("common.forgetPassword"), this.i18nService.instant("common.close"), {
        duration: 2000,
      });
      this.router.navigate(['/confirmpass', "FORGET"], { replaceUrl: true });
    }, err => {
      console.log("Error forgot password request", err);      
      this.matSnackBar.open(this.i18nService.instant("common.emailPhoneError"), this.i18nService.instant("common.close"), {
        duration: 2000,
      });
    });
  }
}
