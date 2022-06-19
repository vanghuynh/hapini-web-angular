import { Component, OnInit } from '@angular/core';
import { HouseService } from '@app/core/services/house.service';
import { IUser } from '@app/model/interfaces';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@app/core/services/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { I18nService } from '@app/core';
import { MustMatch } from '@app/core/util/common.util';

@Component({
  selector: 'user-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user: IUser;
  
  constructor(private houseService: HouseService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private matSnackBar: MatSnackBar,
    private i18nService: I18nService) {
      this.userForm = this.fb.group({
        username: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required]),
        confirmPassword: new FormControl("", [Validators.required]),
        name: new FormControl("", [Validators.required]),
        phone:new FormControl("", [Validators.required, Validators.pattern('[0-9]*')]),
        agree: new FormControl(false, [Validators.required, Validators.requiredTrue]),
      },{
        validator: MustMatch('password', 'confirmPassword')
      });
    }
  
  userForm: FormGroup;

  ngOnInit() {
    this.initUser();
  }

  private initUser(){
    this.user = {
      id: 0,
      password: "",
      username: "",
      name: "",
      phone: ""
    };
  }
  onSubmit() {
    console.log("User Form Data: ", this.userForm.value);
    let user: IUser = this.userForm.value;
    this.userService.registerUser(user).subscribe(user => {
      this.user = user;
      console.log("User created: ", this.user);
      this.matSnackBar.open(this.i18nService.instant("common.accountCreated"), this.i18nService.instant("common.close"), {
        duration: 4000,
      });
      this.router.navigate(['/login'], { replaceUrl: true });
    }, err => {
      console.log("Error create user", err);
      this.matSnackBar.open(this.i18nService.instant("common.usernameExist"), this.i18nService.instant("common.close"), {
        duration: 4000,
      });
    });
  }
}
