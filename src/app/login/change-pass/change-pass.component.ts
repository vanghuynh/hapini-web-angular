import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AddressService } from '@app/core/services/address.service';
import { HouseService } from '@app/core/services/house.service';
import { IUser, IUserPassword } from '@app/model/interfaces';
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
  selector: 'user-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {

  userPassword: IUserPassword;
  
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
      this.userForm = this.fb.group({
        oldPassword: new FormControl("", [Validators.required]),
        newPassword: new FormControl("", [Validators.required]),
        confirmPassword: new FormControl("", [Validators.required]),
        agree: new FormControl(false, [Validators.required, Validators.requiredTrue]),
      });
    }
  
  userForm: FormGroup;

  ngOnInit() {
    this.initUser();
  }

  private initUser(){
    this.userPassword = {
      username: this.authenticationService.credentials.username,
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
  }
  onSubmit() {
    console.log("User Form Data: ", this.userForm.value);
    this.userPassword.oldPassword = this.userForm.value.oldPassword;
    this.userPassword.newPassword = this.userForm.value.newPassword;
    this.userPassword.confirmPassword = this.userForm.value.confirmPassword;
    this.userService.changeUserPassword(this.userPassword).subscribe(username => {;
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
